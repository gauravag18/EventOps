import React from 'react';
import { getEvent } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;
    const event = getEvent(eventId);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray selection:bg-muted-teal selection:text-white">
            {/* Navigation Placeholder (Assuming a Layout handles this, but adding a simple top bar for standalone completeness if needed) */}
            <nav className="border-b border-soft-slate bg-white px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="text-xl font-bold tracking-tight text-charcoal-blue">EventOps</div>
                    <div className="flex gap-4">
                        <button className="text-sm font-medium text-steel-gray hover:text-charcoal-blue">Log In</button>
                        <button className="rounded-md bg-charcoal-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90">Sign Up</button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-4">
                    <a href="/events" className="group inline-flex items-center text-sm font-medium text-muted-teal hover:underline">
                        <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2">
                        {/* Hero Image Placeholder */}
                        <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-soft-slate shadow-sm">
                            {/* In a real app, <img src={event.image} /> */}
                            <div className="flex h-full w-full items-center justify-center text-steel-gray opacity-50">
                                Event Cover Image
                            </div>
                        </div>

                        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-charcoal-blue lg:text-5xl">
                            {event.title}
                        </h1>
                        <p className="mb-6 text-xl text-steel-gray">
                            {event.tagline}
                        </p>

                        <div className="mb-10 flex flex-wrap gap-4 text-sm font-medium text-charcoal-blue">
                            <span className="inline-flex items-center rounded-full bg-soft-slate/50 px-3 py-1 text-charcoal-blue">
                                {event.category}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-soft-slate/50 px-3 py-1 text-charcoal-blue">
                                Conference
                            </span>
                        </div>

                        {/* Sticky Tab Navigation */}
                        <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-soft-slate bg-off-white/95 px-6 backdrop-blur-md lg:rounded-t-lg">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                                <a href="#overview" className="border-b-2 border-muted-teal py-4 text-sm font-bold text-muted-teal whitespace-nowrap">
                                    Overview
                                </a>
                                <a href="#agenda" className="border-b-2 border-transparent py-4 text-sm font-medium text-steel-gray hover:border-soft-slate hover:text-charcoal-blue whitespace-nowrap">
                                    Agenda
                                </a>
                                <a href="#speakers" className="border-b-2 border-transparent py-4 text-sm font-medium text-steel-gray hover:border-soft-slate hover:text-charcoal-blue whitespace-nowrap">
                                    Speakers
                                </a>
                                <a href="#venue" className="border-b-2 border-transparent py-4 text-sm font-medium text-steel-gray hover:border-soft-slate hover:text-charcoal-blue whitespace-nowrap">
                                    Venue & Policies
                                </a>
                            </nav>
                        </div>

                        <div className="space-y-16">
                            {/* Overview Section */}
                            <section id="overview" className="scroll-mt-24 prose prose-lg prose-slate max-w-none text-steel-gray">
                                <h3 className="text-2xl font-bold text-charcoal-blue">About this Event</h3>
                                <p className="mt-4 leading-relaxed whitespace-pre-line">
                                    {event.description}
                                </p>
                            </section>

                            {/* Agenda Section */}
                            <section id="agenda" className="scroll-mt-24">
                                <h3 className="mb-6 text-2xl font-bold text-charcoal-blue">Agenda Highlights</h3>
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-soft-slate bg-white p-5 transition hover:border-muted-teal/30">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-lg bg-soft-slate/30 px-3 py-2 text-center">
                                                    <span className="block text-xs font-bold uppercase text-steel-gray">Oct</span>
                                                    <span className="block text-xl font-bold text-charcoal-blue">15</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-charcoal-blue">Opening Keynote</h4>
                                                    <p className="text-sm text-steel-gray">09:00 AM – 10:30 AM</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-charcoal-blue/10 px-2.5 py-0.5 text-xs font-medium text-charcoal-blue">
                                                Main Stage
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-soft-slate bg-white p-5 transition hover:border-muted-teal/30">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-lg bg-soft-slate/30 px-3 py-2 text-center">
                                                    <span className="block text-xs font-bold uppercase text-steel-gray">Oct</span>
                                                    <span className="block text-xl font-bold text-charcoal-blue">15</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-charcoal-blue">Scalable Architecture Workshop</h4>
                                                    <p className="text-sm text-steel-gray">11:30 AM – 01:00 PM</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-muted-teal/10 px-2.5 py-0.5 text-xs font-medium text-muted-teal">
                                                Room A
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Speakers Section */}
                            <section id="speakers" className="scroll-mt-24">
                                <h3 className="mb-6 text-2xl font-bold text-charcoal-blue">Featured Speakers</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center gap-4 rounded-xl border border-soft-slate bg-white p-4 shadow-sm">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-soft-slate">
                                                {/* Placeholder Avatar */}
                                                <svg className="h-full w-full text-soft-slate" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            </div>
                                            <div>
                                                <div className="font-bold text-charcoal-blue">Sarah Jenkins</div>
                                                <div className="text-sm text-steel-gray">CTO, TechGrowth</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Venue Section */}
                            <section id="venue" className="scroll-mt-24">
                                <h3 className="mb-6 text-2xl font-bold text-charcoal-blue">Venue & Travel</h3>
                                <div className="rounded-xl border border-soft-slate bg-white p-6">
                                    <div className="mb-4 aspect-video w-full rounded-lg bg-soft-slate/50">
                                        <div className="flex h-full items-center justify-center text-steel-gray">Map View</div>
                                    </div>
                                    <h4 className="font-bold text-charcoal-blue">{event.location}</h4>
                                    <p className="text-sm text-steel-gray">747 Howard St, San Francisco, CA 94103</p>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="sticky top-6 space-y-8 self-start">
                        {/* Registration Card */}
                        <div className="rounded-2xl border border-soft-slate bg-white p-8 shadow-sm">
                            <div className="mb-6 flex items-baseline justify-between">
                                <span className="text-3xl font-bold text-charcoal-blue">{event.price}</span>
                                <span className="text-sm font-medium text-steel-gray">per attendee</span>
                            </div>

                            <button className="flex w-full items-center justify-center rounded-lg bg-charcoal-blue px-6 py-4 text-center text-lg font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:ring-2 focus:ring-muted-teal focus:ring-offset-2">
                                Register Now
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-sm font-medium text-signal-orange">
                                    Only {event.spotsLeft} spots remaining!
                                </p>
                            </div>

                            <hr className="my-6 border-soft-slate" />

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <svg className="mt-1 mr-3 h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-charcoal-blue">Date & Time</h4>
                                        <p className="text-sm text-steel-gray">{event.date}</p>
                                        <p className="text-sm text-steel-gray">{event.time}</p>
                                        <a href="#" className="mt-1 block text-sm font-medium text-muted-teal hover:underline">Add to Calendar</a>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="mt-1 mr-3 h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-charcoal-blue">Location</h4>
                                        <p className="text-sm text-steel-gray">{event.location}</p>
                                        <a href="#" className="mt-1 block text-sm font-medium text-muted-teal hover:underline">View Map</a>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="mt-1 mr-3 h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-charcoal-blue">Organizer</h4>
                                        <p className="text-sm text-steel-gray">{event.organizer}</p>
                                        <a href="#" className="mt-1 block text-sm font-medium text-muted-teal hover:underline">Contact</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Safety / Info Card */}
                        <div className="rounded-2xl border border-soft-slate bg-slate-50 p-6">
                            <h4 className="mb-2 font-semibold text-charcoal-blue">Event Policies</h4>
                            <ul className="space-y-2 text-sm text-steel-gray">
                                <li className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-muted-teal"></span>
                                    Non-refundable tickets
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-muted-teal"></span>
                                    Code of Conduct applies
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
