import React from 'react';
import EventFilters from '@/components/EventFilters';
// import { prisma } from '@/lib/prisma'; // Removed default prisma import
import Link from 'next/link';
import { fetchFromApi } from '@/lib/api-client';

export default async function EventsListPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const q = (params.q as string)?.toLowerCase() || '';
    const categoryQuery = (params.category as string) || '';

    // Fetch Events via API
    let query = `/api/events?q=${encodeURIComponent(q)}&category=${encodeURIComponent(categoryQuery)}`;

    const filteredEventsRaw = await fetchFromApi(query) || [];

    // Post-process for display (spots left, etc) - API already does some, but we can do more
    // The API returns the raw event plus spotsLeft and displayLocation.
    const filteredEvents = filteredEventsRaw;

    // Fetch Trending (Top 5 by participants) - We could add a 'trending' endpoint or param
    // For now, since "trending" logic was:
    // await prisma.event.findMany({ take: 5, orderBy: { participants: { _count: 'desc' } } })
    // Let's create a trending endpoint or just sort the full list if logical? No, full list might not be full.
    // Let's create a dedicated trending endpoint or just mock it for now since the user wants API routes for everything.
    // I will add a `sort=trending` param to the events API or just fetch all and slice for now if the list is small.
    // Assuming backend handles it. I'll just clear it for now or use the first 5 of the list as "Trending" if I don't want to make another route.
    // Actually, I should probably make a trending route. 
    // Let's just use the first 5 of filtered events as placeholder for trending to save time, or fetch all.
    // Real implementation:
    const trendingEventsRaw = await fetchFromApi('/api/events?sort=trending') || [];
    const trendingEvents = trendingEventsRaw.slice(0, 5).map((e: any) => ({
        id: e.id,
        title: e.title,
        attendees: e.participants?.length || 0
    }));

    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">
            <main className="mx-auto max-w-400 px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-charcoal-blue">Explore Events</h1>
                    <p className="mt-2 text-steel-gray">Discover conferences, workshops, and meetups tailored for you.</p>
                </div>

                {/* 1 : 3 : 1 Layout Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

                    {/* LEFT COLUMN (Filters) - Span 1 */}
                    <div className="lg:col-span-1">
                        <EventFilters />
                    </div>

                    {/* CENTER COLUMN (Events List) - Span 3 */}
                    <div className="space-y-6 lg:col-span-3">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between border-2 border-gray-200 bg-white px-6 py-3 shadow-sm">
                            <span className="text-sm font-bold uppercase tracking-wider text-steel-gray">Showing <strong className="text-charcoal-blue">{filteredEvents.length}</strong> results</span>
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-steel-gray">Sort by:</label>
                                <select className="border-b-2 border-gray-200 bg-transparent py-1 pl-3 pr-8 text-sm font-bold uppercase tracking-wide text-charcoal-blue focus:border-charcoal-blue focus:ring-0">
                                    <option>Most Popular</option>
                                    <option>Date: Soonest</option>
                                    <option>Newest Added</option>
                                </select>
                            </div>
                        </div>

                        {/* Cards List */}
                        <div className="space-y-4">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <div key={event.id} className="group flex flex-col overflow-hidden border-2 border-gray-200 bg-white shadow-sm transition-all hover:border-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:flex-row">
                                        {/* Event Image */}
                                        <div className="h-48 w-full bg-soft-slate sm:h-auto sm:w-48 shrink-0 relative overflow-hidden border-r-2 border-gray-200">
                                            {event.image && event.image !== '/placeholder-1.jpg' ? (
                                                <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-soft-slate text-xs font-bold uppercase tracking-widest text-charcoal-blue/50">
                                                    Image
                                                </div>
                                            )}

                                            {/* Featured Tag or Date Badge */}
                                            <div className="absolute top-0 left-0 border-b-2 border-r-2 border-gray-900 bg-white px-2 py-1 text-xs font-bold uppercase tracking-wider text-charcoal-blue shadow-sm">
                                                {event.category}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-bold uppercase tracking-tight text-charcoal-blue group-hover:text-muted-teal transition-colors line-clamp-1">
                                                        <Link href={`/event/${event.id}`}>{event.title}</Link>
                                                    </h3>
                                                    <span className="text-lg font-bold text-charcoal-blue">{event.isFree ? 'Free' : `$${event.price}`}</span>
                                                </div>

                                                <div className="mt-2 flex items-center space-x-4 text-sm font-medium text-steel-gray">
                                                    <div className="flex items-center">
                                                        <svg className="mr-1.5 h-4 w-4 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="mr-1.5 h-4 w-4 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {event.displayLocation}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4">
                                                <div className="text-xs font-bold uppercase tracking-wide">
                                                    {event.capacity > 0 && event.spotsLeft < 20 ? (
                                                        <span className="text-signal-orange flex items-center">
                                                            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Only {event.spotsLeft > 0 ? event.spotsLeft : 0} spots left!
                                                        </span>
                                                    ) : (
                                                        <span className="text-steel-gray">{event.participants.length} attendees</span>
                                                    )}
                                                </div>

                                                <Link href={`/event/${event.id}`} className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted-teal hover:text-charcoal-blue">
                                                    View Details
                                                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-soft-slate bg-white p-12 text-center">
                                    <h3 className="text-lg font-bold text-charcoal-blue">No events found</h3>
                                    <p className="mt-2 text-steel-gray">Try adjusting your search or filters.</p>
                                    <Link href="/events" className="mt-4 inline-block text-sm font-bold text-muted-teal hover:underline">Clear all filters</Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination (Simplified) */}
                        {filteredEvents.length > 5 && (
                            <div className="flex justify-center pt-8">
                                <nav className="inline-flex -space-x-px rounded-md bg-white shadow-sm ring-1 ring-inset ring-soft-slate" aria-label="Pagination">
                                    <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-steel-gray ring-1 ring-inset ring-soft-slate hover:bg-off-white focus:z-20 focus:outline-offset-0">
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-muted-teal px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-muted-teal">1</a>
                                    {/* <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-charcoal-blue ring-1 ring-inset ring-soft-slate hover:bg-off-white focus:z-20 focus:outline-offset-0">2</a> */}
                                    <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-steel-gray ring-1 ring-inset ring-soft-slate hover:bg-off-white focus:z-20 focus:outline-offset-0">
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN (Sidebar/Trending) - Span 1 */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Trending Widget */}
                            <div className="border-2 border-gray-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-steel-gray">Trending Now</h3>
                                <ul className="space-y-4">
                                    {trendingEvents.length > 0 ? trendingEvents.map((item, i) => (
                                        <li key={i} className="group cursor-pointer">
                                            <div className="text-sm font-bold text-charcoal-blue group-hover:text-muted-teal truncate">
                                                <Link href={`/event/${item.id}`}>{item.title}</Link>
                                            </div>
                                            <div className="text-xs text-steel-gray">{item.attendees} attendees</div>
                                        </li>
                                    )) : (
                                        <li className="text-xs text-steel-gray">No trending events yet.</li>
                                    )}
                                </ul>
                                {/* <a href="#" className="mt-4 block text-xs font-bold text-muted-teal hover:underline">View all trending</a> */}
                            </div>

                            {/* Newsletter / Promo */}
                            <div className="bg-charcoal-blue p-5 text-white shadow-md relative overflow-hidden border-2 border-charcoal-blue">
                                {/* Decorative circle */}
                                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>

                                <h3 className="relative z-10 text-lg font-bold">Stay Updated</h3>
                                <p className="relative z-10 mt-2 text-sm text-soft-slate">Get the latest tech events delivered to your inbox weekly.</p>
                                <div className="relative z-10 mt-4 space-y-2">
                                    <input
                                        type="email"
                                        placeholder="you@email.com"
                                        className="w-full border-2 border-steel-gray bg-charcoal-blue/50 px-3 py-2 text-sm text-white placeholder-soft-slate focus:border-muted-teal focus:outline-none focus:ring-0"
                                    />
                                    <button className="w-full bg-muted-teal px-3 py-2 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-muted-teal border-2 border-transparent hover:border-muted-teal">
                                        Subscribe
                                    </button>
                                </div>
                            </div>

                            {/* Featured Organizer */}
                            <div className="border-2 border-gray-200 bg-slate-50 p-5">
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-steel-gray">Featured Organizer</h3>
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-charcoal-blue"></div>
                                    <div>
                                        <div className="text-sm font-bold text-charcoal-blue">System Design Co.</div>
                                        <div className="text-xs text-steel-gray">12 events hosted</div>
                                    </div>
                                </div>
                                <button className="mt-3 w-full border-2 border-gray-200 bg-white py-1.5 text-xs font-bold uppercase tracking-wider text-steel-gray hover:border-gray-900 hover:text-charcoal-blue transition-all">
                                    Follow
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

