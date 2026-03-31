'use client';

import React, { useState, useEffect } from 'react';
import EventCard from '@/components/EventCard';
import { LoadingLink } from '@/components/Loaders';

export default function FavoritesClient() {
    const [favEvents, setFavEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFavorites = async () => {
        const favIds = JSON.parse(localStorage.getItem('eventops_favorites') || '[]');
        if (favIds.length === 0) {
            setFavEvents([]);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/events/favorites?ids=${favIds.join(',')}`);
            if (res.ok) {
                const data = await res.json();
                setFavEvents(data);
            }
        } catch (error) {
            console.error("Error fetching favorites", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();

        const handleFavChange = () => {
            fetchFavorites();
        };

        window.addEventListener('favoritesChanged', handleFavChange);
        return () => window.removeEventListener('favoritesChanged', handleFavChange);
    }, []);

    return (
        <div className="min-h-screen bg-[#E8F8F5] pt-16">
            <main className="mx-auto max-w-[1880px] px-6 md:px-10 py-16">
                
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-0.5 w-8 bg-charcoal-blue" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-charcoal-blue/60 uppercase">Personalized</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-charcoal-blue">Your Favorites</h1>
                    <p className="mt-3 text-lg text-steel-gray">Handpicked events you've bookmarked for later.</p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 w-full animate-pulse bg-white border-2 border-gray-100" />
                        ))}
                    </div>
                ) : favEvents.length === 0 ? (
                    <div className="bg-white border-4 border-dashed border-gray-200 p-24 text-center">
                        <div className="w-16 h-16 bg-muted-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-muted-teal/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-charcoal-blue mb-2">No bookmarked events yet</h2>
                        <p className="text-steel-gray mb-8">Start exploring and save the ones you love.</p>
                        <LoadingLink center={true} href="/events" className="inline-block px-8 py-3.5 bg-charcoal-blue text-white text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Explore Events</LoadingLink>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {favEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
