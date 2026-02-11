import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OrganizerDashboard() {
    const session = await getServerSession(getAuthOptions());

    if (!session?.user?.id) {
        redirect(`/login?error=${encodeURIComponent("You must be logged in to view the organizer dashboard.")}`);
    }

    // Fetch events for the logged-in organizer
    const events = await prisma.event.findMany({
        where: {
            organizers: {
                some: {
                    id: session.user.id
                }
            }
        },
        include: {
            participants: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Helper to calculate stats
    const organizedEvents = events.map(event => {
        const sold = event.participants.length;
        // Parse price safely
        const priceVal = event.isFree ? 0 : parseFloat(event.price || "0");
        const revenue = sold * (isNaN(priceVal) ? 0 : priceVal);

        // Determine status simply based on date for now
        const isPast = new Date(event.date) < new Date();
        const status = isPast ? "ENDED" : "PUBLISHED";

        return {
            ...event,
            sold,
            revenue,
            status,
            formattedDate: new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        };
    });

    // Stats calculation
    const totalEvents = organizedEvents.length;
    const totalRevenue = organizedEvents.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalTicketsSold = organizedEvents.reduce((acc, curr) => acc + curr.sold, 0);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">
            <main className="mx-auto max-w-7xl px-6 py-14">

                {/* HEADER */}
                <div className="mb-16">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl font-extrabold tracking-tight text-charcoal-blue">
                                Organizer Dashboard
                            </h1>
                            <p className="mt-4 text-xl leading-relaxed text-steel-gray">
                                Monitor your event performance, manage attendees, and track revenue.
                            </p>
                        </div>

                        <Link
                            href="/organizer/create-event"
                            className="group inline-flex items-center gap-2 border-2 border-signal-orange bg-signal-orange px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-signal-orange"
                        >
                            Create New Event
                            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* STATS GRID */}
                <section className="mb-20">
                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* TOTAL REVENUE - FEATURED */}
                        <div className="group relative overflow-hidden border-2 border-charcoal-blue bg-charcoal-blue px-10 py-12 transition hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                            {/* Decorative elements */}
                            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
                            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5" />

                            <div className="relative z-10">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                                        Total Revenue
                                    </span>
                                    <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="mb-4 text-5xl font-extrabold tracking-tight text-white">
                                    {formatCurrency(totalRevenue)}
                                </div>
                                <div className="h-1 w-20 bg-signal-orange" />
                                <p className="mt-4 text-sm leading-relaxed text-white/80">
                                    Gross revenue across all events
                                </p>
                            </div>
                        </div>

                        {/* TICKETS SOLD */}
                        <div className="group relative overflow-hidden border-2 border-signal-orange bg-white transition hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                            <div className="absolute inset-0 bg-linear-to-br from-signal-orange/5 to-transparent" />
                            <div className="absolute bottom-0 left-0 h-2 w-full bg-signal-orange" />

                            <div className="relative z-10 px-8 py-10">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-signal-orange">
                                        Tickets Sold
                                    </span>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-orange/10">
                                        <svg className="h-5 w-5 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mb-3 text-5xl font-extrabold text-charcoal-blue">
                                    {totalTicketsSold}
                                </div>
                                <p className="text-sm font-medium text-steel-gray">
                                    Across {totalEvents} events
                                </p>
                            </div>
                        </div>

                        {/* TOTAL EVENTS */}
                        <div className="group relative overflow-hidden border-2 border-gray-300 bg-white transition hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                            <div className="absolute inset-0 bg-linear-to-br from-gray-100/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 h-2 w-full bg-gray-400" />

                            <div className="relative z-10 px-8 py-10">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                                        Events
                                    </span>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mb-3 text-5xl font-extrabold text-charcoal-blue">
                                    {totalEvents}
                                </div>
                                <p className="text-sm font-medium text-steel-gray">
                                    {organizedEvents.filter(e => e.status === 'PUBLISHED').length} Published, {organizedEvents.filter(e => e.status === 'ENDED').length} Ended
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* EVENTS LIST */}
                <section>
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-charcoal-blue">
                            My Events
                        </h2>
                        {/* Filter mockup - could be functional later */}
                        <div className="flex gap-4">
                            <select className="border-b-2 border-gray-200 bg-transparent py-1 pl-3 pr-8 text-sm font-bold uppercase tracking-wide text-charcoal-blue focus:border-charcoal-blue focus:ring-0">
                                <option>All Events</option>
                                <option>Published</option>
                                <option>Ended</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {organizedEvents.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-lg">
                                <p className="text-lg text-steel-gray mb-4">You haven't created any events yet.</p>
                                <Link
                                    href="/organizer/create-event"
                                    className="text-signal-orange font-bold hover:underline"
                                >
                                    Create your first event
                                </Link>
                            </div>
                        ) : (
                            organizedEvents.map((event) => {
                                const isPublished = event.status === "PUBLISHED";
                                const percentSold = event.capacity > 0 ? Math.round((event.sold / event.capacity) * 100) : 0;

                                return (
                                    <div
                                        key={event.id}
                                        className="group relative border-2 border-soft-slate bg-white transition-all hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {/* Status Indicator */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPublished ? "bg-signal-orange" : "bg-gray-400"}`} />

                                        <div className="flex flex-col lg:flex-row lg:items-center">
                                            {/* Main Info */}
                                            <div className="flex-1 p-8 pl-10">
                                                <div className="mb-2 flex items-center gap-3">
                                                    <span className={`inline-block border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${isPublished
                                                        ? "border-signal-orange bg-signal-orange/10 text-signal-orange"
                                                        : "border-gray-300 bg-gray-100 text-gray-500"
                                                        }`}>
                                                        {event.status}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-steel-gray">
                                                        {event.category}
                                                    </span>
                                                </div>

                                                <h3 className="mb-3 text-xl font-bold uppercase tracking-tight text-charcoal-blue group-hover:text-signal-orange transition">
                                                    {event.title}
                                                </h3>

                                                <div className="flex flex-wrap gap-6 text-sm font-medium text-steel-gray">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="h-4 w-4 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {event.formattedDate}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="h-4 w-4 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {event.location?.split('|')[0]}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats Mini-Dashboard */}
                                            <div className="border-t border-soft-slate bg-gray-50/50 p-8 lg:w-96 lg:border-l lg:border-t-0">
                                                <div className="mb-4 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">Sold</div>
                                                        <div className="font-mono text-lg font-bold text-charcoal-blue">
                                                            {event.sold} <span className="text-gray-400 text-sm">/ {event.capacity}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">Revenue</div>
                                                        <div className="font-mono text-lg font-bold text-charcoal-blue">
                                                            {formatCurrency(event.revenue)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mb-6">
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                                                        <span>Capacity</span>
                                                        <span>{percentSold}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-200 overflow-hidden rounded-full">
                                                        <div
                                                            className="h-full bg-signal-orange transition-all duration-500"
                                                            style={{ width: `${percentSold}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <Link
                                                        href={`/organizer/event/${event.id}`}
                                                        className="flex-1 border border-soft-slate bg-white py-2 text-xs font-bold uppercase tracking-widest text-charcoal-blue hover:border-charcoal-blue hover:bg-charcoal-blue hover:text-white transition text-center"
                                                    >
                                                        Manage
                                                    </Link>
                                                    <Link
                                                        href={`/organizer/event/${event.id}/edit`}
                                                        className="flex-1 border border-soft-slate bg-white py-2 text-xs font-bold uppercase tracking-widest text-steel-gray hover:border-signal-orange hover:bg-red-50 hover:text-signal-orange transition text-center"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

            </main>
        </div>
    );
}
