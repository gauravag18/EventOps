import React from 'react';
import { prisma } from '@/lib/prisma';
import EventsBrowser from '@/components/EventsBrowser';
import { getCachedEvents, cacheEvents } from '@/lib/event-cache';

// Revalidate the page every 2 minutes — gives fresh data without hitting DB on every request
export const revalidate = 120;

export default async function EventsListPage() {
    const cacheKey = 'list:all';
    let allEvents = await getCachedEvents(cacheKey);

    if (!allEvents) {
        const allEventsRaw = await prisma.event.findMany({
            include: { participants: true },
            orderBy: { createdAt: 'desc' }
        });

        allEvents = allEventsRaw.map((event: any) => {
            let isRemote = false;
            if (event.description) {
                try {
                    const parsed = JSON.parse(event.description);
                    if (parsed && typeof parsed === 'object' && parsed.formatMeta) {
                        isRemote = !!parsed.formatMeta.isRemote;
                    }
                } catch { }
            }
            return {
                id: event.id,
                title: event.title,
                description: event.description || '',
                category: event.category,
                tags: event.tags ?? [],
                date: event.date,
                image: event.image || '/placeholder-1.jpg',
                price: event.price,
                isFree: event.isFree,
                capacity: event.capacity,
                displayLocation: event.location ? event.location.split('|')[0] : 'TBD',
                spotsLeft: event.capacity - event.participants.length,
                attendeesCount: event.participants.length,
                isRemote,
            };
        });

        await cacheEvents(cacheKey, allEvents);
    }

    // Calculate Trending (Top 5 by participants)
    const trendingEvents = [...allEvents]
        .sort((a, b) => b.attendeesCount - a.attendeesCount)
        .slice(0, 5)
        .map(e => ({
            id: e.id,
            title: e.title,
            attendees: e.attendeesCount,
        }));

    return (
        <div className="min-h-screen bg-[#E8F8F5] font-sans text-steel-gray pt-16">
            {/* Subtle page header */}
            <div className="bg-white/70 backdrop-blur-sm border-b border-[#ccf0ea]">
                <main className="mx-auto max-w-400 px-6 py-8">
                    <p className="text-xs font-semibold tracking-widest uppercase text-muted-teal mb-1.5">Discover</p>
                    <h1 className="text-3xl font-bold text-charcoal-blue">Explore Events</h1>
                    <p className="mt-1.5 text-[15px] text-steel-gray">Conferences, workshops, and meetups tailored for you.</p>
                </main>
            </div>

            <main className="mx-auto max-w-400 px-6 py-8">
                <EventsBrowser initialEvents={allEvents} trendingEvents={trendingEvents} />
            </main>
        </div>
    );
}