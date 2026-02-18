import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import RegisterButton from '@/components/RegisterButton';
import EventMap from '@/components/EventMap';
import { fetchFromApi } from '@/lib/api-client';
import { unpackEventDescription } from '@/lib/event-details';

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;
    const session = await getServerSession(getAuthOptions());

    const event = await fetchFromApi(`/api/events/${eventId}`);

    if (!event) {
        notFound();
    }

    const details = unpackEventDescription(event.description);
    // Use unpacked overview for the main description display if available
    const descriptionText = details.overview || event.description || '';

    // Process data
    const locationParts = event.location ? event.location.split('|') : [];
    const displayLocation = locationParts[0] || 'TBD';
    const coordinates = locationParts[1] || ''; // "lat,lng"

    const soldCount = event.participants.length;
    const spotsLeft = event.capacity - soldCount;
    const isFree = event.isFree;
    const priceDisplay = isFree ? 'Free' : `$${event.price}`;

    // Check if registered
    const isRegistered = session?.user?.id ? event.participants.some(p => p.id === session.user.id) : false;

    // Date Formatting
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const organizerName = event.organizers[0]?.name || 'EventOps Organizer';

    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray selection:bg-muted-teal selection:text-white pt-16">

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-4">
                    <Link href="/events" className="group inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted-teal hover:text-charcoal-blue">
                        <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2">
                        {/* Hero Image Placeholder */}
                        <div className="mb-8 aspect-video w-full overflow-hidden border-2 border-gray-200 bg-soft-slate shadow-sm relative">
                            {event.image && event.image !== '/placeholder-1.jpg' ? (
                                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center font-bold uppercase tracking-widest text-steel-gray opacity-50">
                                    Event Cover Image
                                </div>
                            )}
                        </div>

                        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-charcoal-blue lg:text-5xl">
                            {event.title}
                        </h1>

                        <div className="mb-10 flex flex-wrap gap-4 text-sm font-medium text-charcoal-blue mt-4">
                            <span className="inline-flex items-center rounded-full bg-soft-slate/50 px-3 py-1 text-charcoal-blue">
                                {event.category}
                            </span>
                            {/* <span className="inline-flex items-center rounded-full bg-soft-slate/50 px-3 py-1 text-charcoal-blue">
                                Conference
                            </span> */}
                        </div>

                        <div className="sticky top-18.25 z-10 -mx-6 mb-8 border-b-2 border-soft-slate bg-off-white/95 px-6 backdrop-blur-md">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                                <a href="#overview" className="border-b-4 border-muted-teal py-4 text-sm font-bold uppercase tracking-wider text-muted-teal whitespace-nowrap">
                                    Overview
                                </a>
                                {details.agenda.length > 0 && (
                                    <a href="#agenda" className="border-b-4 border-transparent py-4 text-sm font-bold uppercase tracking-wider text-steel-gray hover:border-gray-300 hover:text-charcoal-blue whitespace-nowrap transition-colors">
                                        Agenda
                                    </a>
                                )}
                                {details.speakers.length > 0 && (
                                    <a href="#speakers" className="border-b-4 border-transparent py-4 text-sm font-bold uppercase tracking-wider text-steel-gray hover:border-gray-300 hover:text-charcoal-blue whitespace-nowrap transition-colors">
                                        Speakers
                                    </a>
                                )}
                                <a href="#venue" className="border-b-4 border-transparent py-4 text-sm font-bold uppercase tracking-wider text-steel-gray hover:border-gray-300 hover:text-charcoal-blue whitespace-nowrap transition-colors">
                                    Venue & Info
                                </a>
                            </nav>
                        </div>

                        <div className="space-y-16">
                            {/* Overview Section */}
                            <section id="overview" className="scroll-mt-36 prose prose-lg prose-slate max-w-none text-steel-gray">
                                <h3 className="text-2xl font-bold text-charcoal-blue">About this Event</h3>
                                <p className="mt-4 leading-relaxed whitespace-pre-line">
                                    {descriptionText}
                                </p>
                            </section>

                            {/* Agenda Section */}
                            {details.agenda.length > 0 && (
                                <section id="agenda" className="scroll-mt-36">
                                    <h3 className="mb-6 text-2xl font-bold text-charcoal-blue">Event Agenda</h3>
                                    <div className="space-y-4">
                                        {details.agenda.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row gap-4 p-6 bg-white border-2 border-soft-slate hover:border-muted-teal transition-colors">
                                                <div className="sm:w-32 shrink-0">
                                                    <span className="inline-block px-3 py-1 bg-soft-slate text-charcoal-blue text-sm font-bold rounded">
                                                        {item.time}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-charcoal-blue">{item.title}</h4>
                                                    {item.description && <p className="mt-2 text-steel-gray">{item.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Speakers Section */}
                            {details.speakers.length > 0 && (
                                <section id="speakers" className="scroll-mt-36">
                                    <h3 className="mb-6 text-2xl font-bold text-charcoal-blue">Speakers</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {details.speakers.map((speaker, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-white border-2 border-soft-slate">
                                                <div className="w-16 h-16 rounded-full bg-soft-slate overflow-hidden border-2 border-gray-200 shrink-0">
                                                    {speaker.avatar ? (
                                                        <img src={speaker.avatar} alt={speaker.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-charcoal-blue">{speaker.name}</h4>
                                                    <p className="text-sm text-muted-teal font-medium uppercase tracking-wide">{speaker.role}</p>
                                                    {speaker.company && <p className="text-sm text-steel-gray">{speaker.company}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Venue & Policies Section */}
                            <section id="venue" className="scroll-mt-36">
                                <h3 className="mb-6 text-2xl font-bold text-charcoal-blue">Venue & Location</h3>
                                <div className="rounded-xl border border-soft-slate bg-white p-6 mb-8">
                                    <div className="mb-4 w-full rounded-lg overflow-hidden bg-soft-slate/50 border-2 border-gray-100">
                                        {coordinates ? (
                                            <EventMap value={coordinates} readOnly={true} />
                                        ) : (
                                            <div className="aspect-video flex items-center justify-center text-steel-gray font-medium">
                                                No map coordinates available
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-charcoal-blue text-lg">{displayLocation}</h4>
                                </div>

                                {details.policies && (
                                    <>
                                        <h3 className="mb-4 text-xl font-bold text-charcoal-blue">Policies & Additional Info</h3>
                                        <div className="prose prose-slate text-steel-gray p-6 bg-off-white border-l-4 border-muted-teal">
                                            <p className="whitespace-pre-line">{details.policies}</p>
                                        </div>
                                    </>
                                )}
                            </section>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="sticky top-28 space-y-8 self-start">
                        {/* Registration Card */}
                        <div className="border-2 border-soft-slate bg-white p-8 shadow-sm">
                            <div className="mb-6 flex items-baseline justify-between border-b-2 border-gray-100 pb-4">
                                <span className="text-3xl font-bold text-charcoal-blue">{priceDisplay}</span>
                                <span className="text-sm font-bold uppercase tracking-wider text-steel-gray">per attendee</span>
                            </div>

                            <RegisterButton
                                eventId={event.id}
                                isFull={spotsLeft <= 0}
                                isRegistered={isRegistered}
                            />

                            <div className="mt-4 text-center">
                                <p className={`text-sm font-medium ${spotsLeft < 10 ? 'text-signal-orange' : 'text-muted-teal'}`}>
                                    {spotsLeft > 0 ? (spotsLeft < 20 ? `Only ${spotsLeft} spots remaining!` : `${spotsLeft} spots available`) : 'Event is full'}
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
                                        <p className="text-sm text-steel-gray">{dateStr}</p>
                                        <p className="text-sm text-steel-gray">{timeStr}</p>
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
                                        <p className="text-sm text-steel-gray">{displayLocation}</p>
                                        <a href="#venue" className="mt-1 block text-sm font-medium text-muted-teal hover:underline">View Map</a>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="mt-1 mr-3 h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-charcoal-blue">Organizer</h4>
                                        <p className="text-sm text-steel-gray">{organizerName}</p>
                                        <a href="#" className="mt-1 block text-sm font-medium text-muted-teal hover:underline">Contact</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Safety / Info Card */}
                        <div className="border border-soft-slate bg-slate-50 p-6">
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
