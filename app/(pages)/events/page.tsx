import React from 'react';
import { prisma } from '@/lib/prisma';
import EventsBrowser from '@/components/EventsBrowser';
import { getCachedEvents, cacheEvents } from '@/lib/event-cache';

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

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-[#ccf0ea] shadow-sm">
                <div className="mx-auto max-w-400 px-6 md:px-10 py-8 md:py-10">
                    <div className="max-w-2xl">
                        <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-teal mb-3">
                            Discover
                        </p>
                        <h1 className="text-3xl md:text-[2.6rem] font-bold text-charcoal-blue leading-[1.15] tracking-tight">
                            Explore Events
                        </h1>
                        <p className="mt-3 text-[15px] text-steel-gray/75 leading-relaxed max-w-lg">
                            Conferences, workshops, and meetups tailored for you.
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-400 px-6 md:px-10 py-8 md:py-10">
                <div className="bg-white/60 backdrop-blur-sm border border-[#d7f3ef] rounded-2xl p-4 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                    <EventsBrowser
                        initialEvents={allEvents}
                        trendingEvents={trendingEvents}
                    />
                </div>
            </main>
        </div>
    );
}