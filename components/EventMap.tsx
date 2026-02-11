'use client';

import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 flex items-center justify-center text-slate-400">Loading Map...</div>
});

interface EventMapProps {
    value: string; // "lat,lng" - coordinates string
    readOnly?: boolean;
}

export default function EventMap({ value, readOnly = true }: EventMapProps) {
    if (!value) return null;

    return <LocationPicker value={value} readOnly={readOnly} />;
}
