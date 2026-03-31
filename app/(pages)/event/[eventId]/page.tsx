import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { getCachedEvent, cacheEvent, getCachedUserEventState, cacheUserEventState } from '@/lib/event-cache';
import { unpackEventDescription } from '@/lib/event-details';
import EventMap from '@/components/EventMap';
import EventDetailPageClient from '@/components/EventDetailPageClient';

/**
 * SSR PAGE: PARALLEL DATA ORCHESTRATION (HITS REDIS AND RENDERS INSTANTLY)
 * Now also pre-fetches user registration/team status from a per-user Redis cache.
 */
export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;

    // ── STEP 1: PARALLEL CACHE/DB HIT ── (FASTEST POSSIBLE SSR PATH)
    const [session, cachedEvent] = await Promise.all([
        getServerSession(getAuthOptions()),
        getCachedEvent(eventId)
    ]);

    let event = cachedEvent;
    let soldCount = event?.soldCount ?? 0;

    // Fetch user state in parallel ONLY if authenticated
    let userState = null;
    if (session?.user?.id) {
        userState = await getCachedUserEventState(session.user.id, eventId);
    }

    // DB FILLER ON MISS (Only runs if Redis is empty)
    if (!event || (session?.user?.id && !userState)) {
        const [dbEvent, dbCount, dbUserState] = await Promise.all([
            !event ? prisma.event.findUnique({
                where: { id: eventId },
                include: { organizers: { select: { id: true, name: true, image: true } } }
            }) : Promise.resolve(null),
            !event ? prisma.user.count({ where: { participatingEvents: { some: { id: eventId } } } }) : Promise.resolve(null),
            (session?.user?.id && !userState) ? (async () => {
                const isReg = await prisma.user.findFirst({
                    where: { id: session.user.id, participatingEvents: { some: { id: eventId } } }
                });
                
                let team: any = null;
                const eCat = event?.category || '';
                const isTeamFormat = ['Hackathon', 'Competition'].includes(eCat);
                if (isReg && isTeamFormat) {
                    const ticket = await prisma.ticket.findFirst({
                        where: { eventId: eventId, userId: session.user.id },
                        include: {
                            teamMembership: {
                                include: {
                                    leader: { select: { id: true, name: true } },
                                    members: { include: { user: { select: { id: true, name: true } } } }
                                }
                            }
                        }
                    } as any);
                    team = (ticket as any)?.teamMembership ?? null;
                }
                
                const query = await prisma.eventQuery.findFirst({
                    where: { eventId, userId: session.user.id },
                    include: { messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { name: true, id: true, image: true } } } } }
                });

                return { isRegistered: !!isReg, userTeam: team, userQuery: query };
            })() : Promise.resolve(null)
        ]);

        if (dbEvent) {
            await cacheEvent(eventId, dbEvent, dbCount!);
            event = { ...dbEvent, soldCount: dbCount! } as any;
            soldCount = dbCount!;
        }

        if (dbUserState && session?.user?.id) {
            await cacheUserEventState(session.user.id, eventId, dbUserState);
            userState = dbUserState;
        }
    }

    if (!event) notFound();

    // ── STEP 2: METADATA & PARSING ──
    const details = unpackEventDescription(event.description);
    const fm = details.formatMeta ?? {};
    const descriptionText = details.overview || '';
    const locationParts = event.location ? event.location.split('|') : [];
    const displayLocation = locationParts[0] || 'TBD';
    const coordinates = locationParts[1] || '';
    
    const spotsLeft = Math.max(0, event.capacity - soldCount);
    const isFree = event.isFree;
    const priceDisplay = isFree ? 'Free' : `$${event.price}`;
    
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = event.time || eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const organizerName = event.organizers[0]?.name || 'EventOps Organizer';
    const tags: string[] = event.tags ?? []; 

    const agendaLabel = event.category === 'Bootcamp' ? 'Curriculum' : 'Agenda';
    const speakersLabel = event.category === 'Webinar' ? 'Presenters' : event.category === 'Expo' ? 'Speakers' : 'Speakers';
    
    const hasFormatDetails = !!(
        fm.teamSizeMin || fm.prizePool || fm.submissionDeadline || fm.judgingCriteria ||
        fm.skillLevel || fm.prerequisites || fm.durationWeeks || fm.hasCertificate ||
        fm.meetingLink || fm.recordingAvailable !== undefined ||
        fm.isRecurring || fm.recurringSchedule
    );

    const teamSizeMax = fm.teamSizeMax ? parseInt(fm.teamSizeMax) : null;
    const allowSolo = fm.allowSolo || false;

    // Prefetched state for instant client hydration
    const isRegisteredInitial = userState?.isRegistered ?? false;
    const userTeamInitial = userState?.userTeam ?? null;
    const userQueryInitial = userState?.userQuery ?? null;

    // ── STEP 3: RENDER THE FULL RICH UI (SSR) ──
    return (
        <div className="min-h-screen bg-[#E8F8F5] font-sans text-steel-gray selection:bg-muted-teal selection:text-white pt-16">

            {/* PAGE HEADER */}
            <div className="bg-white/70 backdrop-blur-sm border-b border-[#ccf0ea]">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <Link href="/events" className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-steel-gray/50 hover:text-charcoal-blue transition-colors mb-5">
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </Link>

                    <h1 className="text-3xl font-extrabold tracking-tight text-charcoal-blue leading-tight lg:text-4xl">
                        {event.title}
                    </h1>
                    {event.tagline && (
                        <p className="mt-2 text-lg text-steel-gray font-medium">{event.tagline}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 my-3">
                        <span className="inline-block border border-muted-teal/40 bg-muted-teal/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-teal">
                            {event.category}
                        </span>
                        {spotsLeft < 20 && spotsLeft > 0 && (
                            <span className="inline-block bg-signal-orange/10 border border-signal-orange/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-signal-orange">
                                Only {spotsLeft} spots left
                            </span>
                        )}
                        {tags.map((tag: string) => (
                            <span key={tag} className="inline-block border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-steel-gray">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2 lg:pr-2 pb-10">

                        {/* Hero Image */}
                        <div className="mb-8 aspect-video w-full overflow-hidden border-2 border-gray-200 bg-soft-slate relative">
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-bold uppercase tracking-widest text-steel-gray/40">
                                    Event Cover Image
                                </div>
                            )}
                        </div>

                        {/* Sticky Tab Nav */}
                        <div className="sticky top-0 z-20 -mx-6 mb-10 border-b-2 border-soft-slate bg-[#E8F8F5]/95 px-6 backdrop-blur-md">
                            <nav className="-mb-px flex gap-0 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                                <a href="#overview" className="border-b-4 border-muted-teal py-4 px-1 mr-8 text-xs font-bold uppercase tracking-widest text-muted-teal whitespace-nowrap">Overview</a>
                                {hasFormatDetails && (
                                    <a href="#format-details" className="border-b-4 border-transparent py-4 px-1 mr-8 text-xs font-bold uppercase tracking-widest text-steel-gray hover:border-gray-300 hover:text-charcoal-blue whitespace-nowrap transition-colors">
                                        {event.category} Info
                                    </a>
                                )}
                                {details.agenda.length > 0 && (
                                    <a href="#agenda" className="border-b-4 border-transparent py-4 px-1 mr-8 text-xs font-bold uppercase tracking-widest text-steel-gray hover:border-gray-300 hover:text-charcoal-blue whitespace-nowrap transition-colors">
                                        {agendaLabel}
                                    </a>
                                )}
                                {details.speakers.length > 0 && (
                                    <a href="#speakers" className="border-b-4 border-transparent py-4 px-1 mr-8 text-xs font-bold uppercase tracking-widest text-steel-gray hover:border-gray-300 hover:text-charcoal-blue whitespace-nowrap transition-colors">
                                        {speakersLabel}
                                    </a>
                                )}
                                <a href="#venue" className="border-b-4 border-transparent py-4 px-1 mr-8 text-xs font-bold uppercase tracking-widest text-steel-gray hover:border-gray-300 hover:text-charcoal-blue whitespace-nowrap transition-colors">
                                    Venue & Info
                                </a>
                            </nav>
                        </div>

                        <div className="space-y-16">

                            {/* OVERVIEW Section */}
                            <section id="overview" className="scroll-mt-36">
                                <div className="bg-white border-2 border-gray-200 relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                                    <div className="absolute top-0 left-0 right-0 h-0.75 bg-muted-teal" />
                                    <div className="px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 mt-0.75">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-blue">About this Event</h3>
                                    </div>
                                    <div className="px-6 py-6">
                                        {descriptionText ? (
                                            <p className="text-base leading-relaxed text-steel-gray whitespace-pre-line">{descriptionText}</p>
                                        ) : (
                                            <p className="text-sm italic text-steel-gray/50">No description provided by the organizer.</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* FORMAT-SPECIFIC DETAILS SECTION */}
                            {hasFormatDetails && (
                                <section id="format-details" className="scroll-mt-36">
                                    <div className="bg-white border-2 border-gray-200 relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                                        <div className="absolute top-0 left-0 right-0 h-0.75 bg-signal-orange" />
                                        <div className="px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 mt-0.75 flex items-center gap-3">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-blue">{event.category} Details</h3>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-signal-orange bg-signal-orange/10 px-2.5 py-1">{event.category}</span>
                                        </div>
                                        <div className="divide-y divide-gray-100">

                                            {/* Team Size Logic */}
                                            {(fm.teamSizeMin || fm.teamSizeMax) && (
                                                <div className="px-6 py-4 flex items-start gap-4">
                                                    <div className="w-8 h-8 bg-signal-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                                                        <svg className="h-4 w-4 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-charcoal-blue">Team Size</h4>
                                                        <p className="text-sm text-steel-gray mt-0.5">
                                                            {fm.teamSizeMin && fm.teamSizeMax
                                                                ? `${fm.teamSizeMin}–${fm.teamSizeMax} members per team`
                                                                : fm.teamSizeMin ? `Min ${fm.teamSizeMin} members` : `Max ${fm.teamSizeMax} members`}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Prize logic */}
                                            {fm.prizePool && (
                                                <div className="px-6 py-4 flex items-start gap-4">
                                                    <div className="w-8 h-8 bg-signal-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                                                        <svg className="h-4 w-4 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-charcoal-blue">Prize Pool</h4>
                                                        <p className="text-sm text-steel-gray mt-0.5">{fm.prizePool}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* AGENDA SECTION */}
                            {details.agenda.length > 0 && (
                                <section id="agenda" className="scroll-mt-36">
                                    <div className="bg-white border-2 border-gray-200 relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                                        <div className="absolute top-0 left-0 right-0 h-0.75 bg-muted-teal" />
                                        <div className="px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 mt-0.75">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-blue">{agendaLabel}</h3>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {details.agenda.map((item, idx) => (
                                                <div key={idx} className="group flex gap-5 p-5 hover:bg-muted-teal/3 transition-colors">
                                                    <div className="w-1 shrink-0 bg-muted-teal" />
                                                    <div className="w-20 shrink-0 pt-0.5">
                                                        <span className="text-xs font-bold text-muted-teal">{item.time}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-base font-bold text-charcoal-blue">{item.title}</h4>
                                                        {item.description && <p className="mt-1.5 text-sm text-steel-gray">{item.description}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* SPEAKERS SECTION */}
                            {details.speakers.length > 0 && (
                                <section id="speakers" className="scroll-mt-36">
                                    <div className="bg-white border-2 border-gray-200 relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                                        <div className="absolute top-0 left-0 right-0 h-0.75 bg-muted-teal" />
                                        <div className="px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 mt-0.75">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-blue">{speakersLabel}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                            {details.speakers.map((speaker, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-5 hover:bg-muted-teal/3 transition-colors">
                                                    <div className="w-14 h-14 bg-soft-slate border-2 border-gray-200 overflow-hidden shrink-0">
                                                        {speaker.avatar ? (
                                                            <img src={speaker.avatar} alt={speaker.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-steel-gray/30">
                                                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-charcoal-blue">{speaker.name}</h4>
                                                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-teal mt-0.5">{speaker.role}</p>
                                                        {speaker.company && <p className="text-sm text-steel-gray">{speaker.company}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* VENUE SECTION */}
                            <section id="venue" className="scroll-mt-36">
                                <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-steel-gray border-l-4 border-muted-teal pl-4">
                                    Venue & Location
                                </h3>
                                <div className="bg-white border-2 border-gray-200 relative overflow-hidden mb-6 transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                                    <div className="absolute top-0 left-0 right-0 h-0.75 bg-muted-teal" />
                                    <div className="px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 mt-0.75">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal-blue">Venue & Location</h3>
                                    </div>
                                    <div className="w-full bg-soft-slate/50 border-b-2 border-gray-100">
                                        {fm.isRemote ? (
                                            <div className="aspect-video flex flex-col items-center justify-center text-steel-gray bg-[#E8F8F5] border-b-2 border-gray-100">
                                                <svg className="h-12 w-12 text-muted-teal mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                <span className="font-bold tracking-wider text-charcoal-blue">Online Event</span>
                                            </div>
                                        ) : coordinates ? (
                                            <EventMap value={coordinates} readOnly={true} />
                                        ) : (
                                            <div className="aspect-video flex items-center justify-center text-sm text-steel-gray/40 font-medium">
                                                No map coordinates available
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-6 py-4">
                                        <h4 className="font-bold text-charcoal-blue">{fm.isRemote ? 'Remote / Online' : displayLocation}</h4>
                                    </div>
                                </div>

                                {/* Capacity stats */}
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="bg-white border-2 border-gray-200 px-4 py-4 text-center">
                                        <span className="block text-2xl font-black text-charcoal-blue">{event.capacity}</span>
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-steel-gray mt-1">Capacity</span>
                                    </div>
                                    <div className="bg-white border-2 border-gray-200 px-4 py-4 text-center">
                                        <span className="block text-2xl font-black text-muted-teal">{soldCount}</span>
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-steel-gray mt-1">Registered</span>
                                    </div>
                                    <div className={`border-2 px-4 py-4 text-center ${spotsLeft <= 0 ? 'bg-signal-orange/10 border-signal-orange/30' : 'bg-white border-gray-200'}`}>
                                        <span className={`block text-2xl font-black ${spotsLeft <= 0 ? 'text-signal-orange' : 'text-charcoal-blue'}`}>{Math.max(0, spotsLeft)}</span>
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-steel-gray mt-1">Remaining</span>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="lg:sticky lg:top-24 space-y-6 self-start lg:pr-2 pb-8">

                        {/* REGISTRATION CARD with Client Hydration */}
                        <div className="border-2 border-gray-200 bg-white relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[6px_6px_0px_0px_rgba(31,42,55,1)]">
                            <div className="absolute top-0 left-0 right-0 h-0.75 bg-muted-teal" />

                            <div className="border-b-2 border-gray-100 bg-gray-50 px-7 py-6 mt-0.75">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-4xl font-black text-charcoal-blue">{priceDisplay}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-steel-gray">per attendee</span>
                                </div>
                                <p className={`mt-2 text-xs font-semibold ${spotsLeft <= 0 ? 'text-signal-orange' : 'text-muted-teal'}`}>
                                    {spotsLeft > 0 ? `${spotsLeft} spots available` : 'This event is full'}
                                </p>
                            </div>

                            {/* CLIENT ACTIONS BOX - PRE-HYDRATED FROM SSR */}
                            <div className="px-7 py-5">
                                <EventDetailPageClient 
                                    eventId={event.id}
                                    isFull={spotsLeft <= 0}
                                    eventCategory={event.category}
                                    eventTitle={event.title}
                                    isFree={isFree}
                                    price={event.price || '0'}
                                    teamSizeMax={teamSizeMax}
                                    allowSolo={allowSolo}
                                    initialUserState={{
                                        isRegistered: isRegisteredInitial,
                                        userTeam: userTeamInitial,
                                        userQuery: userQueryInitial
                                    }}
                                />
                            </div>

                            <div className="divide-y divide-gray-100 border-t border-gray-100">
                                <div className="flex items-start gap-3 px-7 py-5">
                                    <svg className="mt-0.5 h-5 w-5 text-muted-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <h4 className="text-sm font-bold text-charcoal-blue">Date & Time</h4>
                                        <p className="text-sm text-steel-gray mt-1">{dateStr}</p>
                                        <p className="text-sm text-steel-gray">{timeStr}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 px-7 py-5">
                                    <svg className="mt-0.5 h-5 w-5 text-muted-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="text-sm font-bold text-charcoal-blue">Location</h4>
                                        <p className="text-sm text-steel-gray mt-1">{displayLocation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QUICK FACTS CARD */}
                        {hasFormatDetails && (
                            <div className="bg-white border-2 border-gray-200 relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                                <div className="absolute top-0 left-0 right-0 h-0.75 bg-signal-orange" />
                                <div className="px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 mt-0.75">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal-blue">Quick Facts</h4>
                                </div>
                                <div className="px-5 py-4 space-y-3">
                                    {fm.skillLevel && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-steel-gray font-medium">Level</span>
                                            <span className="font-bold text-charcoal-blue">{fm.skillLevel}</span>
                                        </div>
                                    )}
                                    {(fm.teamSizeMin || fm.teamSizeMax) && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-steel-gray font-medium">Team Size</span>
                                            <span className="font-bold text-charcoal-blue">
                                                {fm.teamSizeMin && fm.teamSizeMax ? `${fm.teamSizeMin}–${fm.teamSizeMax}` : fm.teamSizeMin || fm.teamSizeMax}
                                            </span>
                                        </div>
                                    )}
                                    {fm.prizePool && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-steel-gray font-medium">Prizes</span>
                                            <span className="font-bold text-signal-orange">{fm.prizePool.split('—')[0].trim()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* POLICIES CARD */}
                        <div className="bg-white border-2 border-gray-200 relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                            <div className="absolute top-0 left-0 right-0 h-0.75 bg-muted-teal" />
                            <div className="px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 mt-0.75">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal-blue">Event Policies</h4>
                            </div>
                            <ul className="space-y-2.5 px-6 py-5">
                                <li className="flex items-center gap-2.5 text-sm text-steel-gray">
                                    <span className="h-1.5 w-1.5 bg-muted-teal shrink-0" />
                                    Non-refundable tickets
                                </li>
                                <li className="flex items-center gap-2.5 text-sm text-steel-gray">
                                    <span className="h-1.5 w-1.5 bg-muted-teal shrink-0" />
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