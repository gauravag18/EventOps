'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icon issues in Next.js + Leaflet
// ... (icon code same)

const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// @ts-ignore
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    value: string; // "lat,lng"
    onChange?: (coords: string) => void;
    readOnly?: boolean;
}

function LocationMarker({ position, setPosition, onChange, readOnly }: {
    position: L.LatLng | null,
    setPosition: (pos: L.LatLng) => void,
    onChange?: (coords: string) => void,
    readOnly: boolean
}) {
    useMapEvents({
        click(e) {
            if (!readOnly && onChange) {
                setPosition(e.latlng);
                onChange(`${e.latlng.lat},${e.latlng.lng}`);
            }
        },
    });

    return position === null ? null : (
        <Marker position={position} interactive={!readOnly}>
            <Popup>Event Location</Popup>
        </Marker>
    );
}

// ... (AutoRecenter same)

function AutoRecenter({ position }: { position: L.LatLng | null }) {
    const map = useMap();

    // Fly to the new position when it changes
    useEffect(() => {
        if (position) {
            map.setView(position, 13, {
                animate: true,
                duration: 1.5
            });
        }
    }, [position, map]);

    return null;
}


const LocationPicker = ({ value, onChange, readOnly = false }: LocationPickerProps) => {
    // Default to London or some center point if no value
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const center = { lat: 51.505, lng: -0.09 };

    useEffect(() => {
        if (value) {
            const parts = value.split(',');
            if (parts.length === 2) {
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                    const newPos = new L.LatLng(lat, lng);
                    console.log("Setting position:", newPos);
                    setPosition(newPos);
                }
            }
        }
    }, [value]);

    return (
        <div className="h-[300px] w-full border-2 border-soft-slate z-0 relative">
            <MapContainer
                center={position || center}
                zoom={13}
                scrollWheelZoom={!readOnly} // Maybe nicer UX for detail page? Or keep true. Let's keep true if user wants to look around.
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} onChange={onChange} readOnly={readOnly} />
                <AutoRecenter position={position} />
            </MapContainer>
        </div>
    );
};

export default LocationPicker;
