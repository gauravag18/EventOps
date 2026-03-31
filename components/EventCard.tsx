import Link from 'next/link';
import React from 'react';
import FavoriteButton from './FavoriteButton';

interface EventCardProps {
    event: {
        id?: string;
        title: string;
        category: string;
        date: string | Date;
        image?: string;
        isFree?: boolean;
        price?: string | number;
        location?: string;
        displayLocation?: string;
        attendees?: number;
        spotsLeft?: number;
        capacity?: number;
        participants?: any[];
    };
    href?: string;
}

export default function EventCard({ event, href }: EventCardProps) {
    // Handle date parsing safely
    const eventDate = event.date ? new Date(event.date) : new Date();
    const dateString = isNaN(eventDate.getTime()) ? 'TBD' : eventDate.toLocaleDateString();

    // Handle location display
    const locationDisplay = event.displayLocation || (event.location ? event.location.split('|')[0] : 'TBD');
    const imageUrl = event.image && event.image !== '' ? event.image : '/placeholder-1.jpg';

    // Participants count logic
    const participantsCount = event.participants ? event.participants.length : (event.attendees || 0);
    const spotsLeft = event.spotsLeft !== undefined ? event.spotsLeft : (event.capacity ? event.capacity - participantsCount : 0);

    const eventLink = href || (event.id ? `/event/${event.id}` : '#');

    return (
        <div className="group flex flex-col overflow-hidden border-2 border-gray-200 bg-white shadow-sm transition-all hover:border-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
            {/* Event Image */}
            <div className="h-48 w-full bg-soft-slate shrink-0 relative overflow-hidden border-b-2 border-gray-200">
                {imageUrl !== '/placeholder-1.jpg' ? (
                    <img
                        src={imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-1.jpg';
                            (e.target as HTMLImageElement).onerror = null;
                        }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-soft-slate text-xs font-bold  tracking-widest text-charcoal-blue/50">
                        Image
                    </div>
                )}

                {/* Featured Tag or Date Badge */}
                <div className="absolute top-0 left-0 border-b-2 border-r-2 border-gray-900 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-charcoal-blue shadow-sm">
                    {event.category || 'Event'}
                </div>

                {/* Favorite Button */}
                <div className="absolute top-2 right-2 z-10 transition-transform group-hover:scale-105">
                    {event.id && <FavoriteButton eventId={event.id} />}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-5">
                <div className="mb-4">
                    <h3 className="text-lg font-black tracking-tight text-charcoal-blue group-hover:text-muted-teal transition-colors line-clamp-2 leading-[1.2]">
                        <Link href={eventLink}>{event.title || 'Untitled Event'}</Link>
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-steel-gray uppercase tracking-widest">
                        <div className="flex items-center">
                            <svg className="mr-1.5 h-3.5 w-3.5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {dateString}
                        </div>
                        <div className="flex items-center">
                            <svg className="mr-1.5 h-3.5 w-3.5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {locationDisplay}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                         <div className={`shrink-0 flex items-center justify-center px-2 py-0.5 border text-white ${event.isFree ? 'bg-muted-teal border-muted-teal' : 'bg-charcoal-blue border-charcoal-blue'}`}>
                            <span className="text-[10px] font-black tracking-widest uppercase">
                                {event.isFree ? 'Free' : (event.price ? `$${event.price}` : 'Free')}
                            </span>
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-steel-gray">
                            {participantsCount} attending
                        </div>
                    </div>

                    <Link href={eventLink} className="group/btn inline-flex items-center text-[10px] font-black tracking-widest uppercase text-charcoal-blue hover:text-muted-teal transition-colors">
                        Explore
                        <svg className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
