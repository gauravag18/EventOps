import React from "react";
import Link from "next/link";

/* MOCK DATA */
const MOCK_TICKETS = [
    {
        id: "t1",
        status: "VALID",
        event: {
            id: "1",
            title: "Tech Conference 2026",
            date: "Feb 15, 2026",
            location: "San Francisco, CA",
            category: "Technology",
        },
        purchaseDate: "Jan 28, 2026",
    },
    {
        id: "t2",
        status: "USED",
        event: {
            id: "2",
            title: "Design Workshop",
            date: "Feb 20, 2026",
            location: "New York, NY",
            category: "Design",
        },
        purchaseDate: "Jan 15, 2026",
    },
    {
        id: "t3",
        status: "VALID",
        event: {
            id: "3",
            title: "Marketing Summit",
            date: "Mar 05, 2026",
            location: "Austin, TX",
            category: "Business",
        },
        purchaseDate: "Feb 01, 2026",
    },
    {
        id: "t4",
        status: "VALID",
        event: {
            id: "4",
            title: "AI Developer Meetup",
            date: "Mar 12, 2026",
            location: "Seattle, WA",
            category: "Technology",
        },
        purchaseDate: "Feb 02, 2026",
    },
];

const UPCOMING_EVENTS = [
    { title: "DevOps Summit 2026", date: "Mar 20, 2026", category: "Technology" },
    { title: "Product Design Bootcamp", date: "Mar 28, 2026", category: "Design" },
    { title: "Sales & Growth Conference", date: "Apr 05, 2026", category: "Business" },
];

export default function AttendeeDashboard() {
    const total = MOCK_TICKETS.length;
    const active = MOCK_TICKETS.filter(t => t.status === "VALID").length;
    const checkedIn = MOCK_TICKETS.filter(t => t.status === "USED").length;
    const validTickets = MOCK_TICKETS.filter(t => t.status === "VALID");

    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">
            <main className="mx-auto max-w-7xl px-6 py-14">

                {/* HEADER */}
                <div className="mb-16">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl font-extrabold tracking-tight text-charcoal-blue">
                                My Tickets
                            </h1>
                            <p className="mt-4 text-xl leading-relaxed text-steel-gray">
                                Manage your event registrations, view ticket status, and track upcoming attendance.
                            </p>
                        </div>
                        
                        <Link
                            href="/events"
                            className="group inline-flex items-center gap-2 border-2 border-muted-teal bg-muted-teal px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-muted-teal"
                        >
                            Browse Events
                            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* STATS GRID */}
                <section className="mb-20">
                    <div className="grid gap-6 lg:grid-cols-3">
                        
                        {/* TOTAL TICKETS - FEATURED */}
                        <div className="group relative overflow-hidden border-2 border-charcoal-blue bg-charcoal-blue px-10 py-12 transition hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                            {/* Decorative elements */}
                            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
                            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
                            
                            <div className="relative z-10">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                                        Total Tickets
                                    </span>
                                    <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <div className="mb-4 text-6xl font-extrabold tracking-tight text-white">
                                    {total}
                                </div>
                                <div className="h-1 w-20 bg-muted-teal" />
                                <p className="mt-4 text-sm leading-relaxed text-white/80">
                                    All event registrations across attended and upcoming events
                                </p>
                            </div>
                        </div>

                        {/* ACTIVE TICKETS */}
                        <div className="group relative overflow-hidden border-2 border-muted-teal bg-white transition hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                            <div className="absolute inset-0 bg-linear-to-br from-muted-teal/5 to-transparent" />
                            <div className="absolute bottom-0 left-0 h-2 w-full bg-muted-teal" />
                            
                            <div className="relative z-10 px-8 py-10">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-teal">
                                        Active
                                    </span>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-teal/10">
                                        <svg className="h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mb-3 text-5xl font-extrabold text-charcoal-blue">
                                    {active}
                                </div>
                                <p className="text-sm font-medium text-steel-gray">
                                    Upcoming events you can attend
                                </p>
                            </div>
                        </div>

                        {/* CHECKED IN */}
                        <div className="group relative overflow-hidden border-2 border-gray-300 bg-white transition hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                            <div className="absolute inset-0 bg-linear-to-br from-gray-100/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 h-2 w-full bg-gray-400" />
                            
                            <div className="relative z-10 px-8 py-10">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                                        Checked In
                                    </span>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mb-3 text-5xl font-extrabold text-charcoal-blue">
                                    {checkedIn}
                                </div>
                                <p className="text-sm font-medium text-steel-gray">
                                    Events already attended
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* MAIN CONTENT GRID */}
                <div className="grid gap-12 lg:grid-cols-3">
                    
                    {/* LEFT COLUMN - TICKET HISTORY */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        <section>
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-2xl font-bold uppercase tracking-widest text-charcoal-blue">
                                    All Tickets
                                </h2>
                                <select className="border-b-2 border-gray-200 bg-transparent py-1 pl-3 pr-8 text-sm font-bold uppercase tracking-wide text-charcoal-blue focus:border-charcoal-blue focus:ring-0">
                                    <option>All Status</option>
                                    <option>Active Only</option>
                                    <option>Used Only</option>
                                </select>
                            </div>

                            <div className="space-y-6">
                                {MOCK_TICKETS.map((ticket) => {
                                    const isActive = ticket.status === "VALID";

                                    return (
                                        <div
                                            key={ticket.id}
                                            className="group relative border-2 border-soft-slate bg-white transition-all hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            {/* Status indicator line */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isActive ? "bg-muted-teal" : "bg-gray-400"}`} />

                                            {/* Right side - Status badge and button */}
                                            <div className="absolute right-6 top-6 flex flex-col items-end gap-3">
                                                <span className={`inline-block border px-4 py-2 text-xs font-bold uppercase tracking-widest ${isActive ? "border-muted-teal bg-muted-teal/10 text-muted-teal" : "border-gray-300 bg-gray-100 text-gray-500"}`}>
                                                    {isActive ? "Valid" : "Used"}
                                                </span>
                                                
                                                {isActive && (
                                                    <Link
                                                        href={`/attendee/ticket/${ticket.id}`}
                                                        className="inline-flex shrink-0 items-center gap-2 border-2 border-charcoal-blue bg-charcoal-blue px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-charcoal-blue"
                                                    >
                                                        View Ticket
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="p-8 pl-10 pr-32">
                                                <h3 className="mb-3 text-xl font-bold uppercase tracking-tight text-charcoal-blue group-hover:text-muted-teal transition">
                                                    {ticket.event.title}
                                                </h3>

                                                <div className="mb-4 flex flex-wrap gap-4 text-sm font-medium text-steel-gray">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="h-4 w-4 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {ticket.event.date}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="h-4 w-4 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {ticket.event.location}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-steel-gray">
                                                    <span>Purchased: {ticket.purchaseDate}</span>
                                                    <span>•</span>
                                                    <span className="font-mono">ID: {ticket.id.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* QUICK STATS */}
                        <section className="border-2 border-soft-slate bg-white p-8">
                            <h3 className="mb-6 text-lg font-bold uppercase tracking-widest text-charcoal-blue">
                                Your Activity
                            </h3>
                            <div className="grid gap-6 sm:grid-cols-3">
                                <div className="border-l-4 border-muted-teal bg-muted-teal/5 px-4 py-3">
                                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                                        This Month
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-charcoal-blue">
                                        {validTickets.length}
                                    </div>
                                </div>
                                <div className="border-l-4 border-charcoal-blue bg-charcoal-blue/5 px-4 py-3">
                                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                                        Categories
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-charcoal-blue">
                                        {new Set(MOCK_TICKETS.map(t => t.event.category)).size}
                                    </div>
                                </div>
                                <div className="border-l-4 border-gray-400 bg-gray-100/50 px-4 py-3">
                                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                                        Total Spent
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-charcoal-blue">
                                        $747
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            
                            {/* UPCOMING ATTENDANCE */}
                            <section className="border-2 border-soft-slate bg-white p-8 shadow-sm">
                                <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-steel-gray">
                                    Next Event
                                </h3>

                                {validTickets.length > 0 ? (
                                    <div className="group">
                                        {/* Date Badge */}
                                        <div className="mb-4 inline-flex items-center gap-3">
                                            <div className="flex h-16 w-16 flex-col items-center justify-center border-2 border-muted-teal bg-muted-teal/10">
                                                <span className="text-xs font-bold uppercase tracking-widest text-muted-teal">
                                                    {validTickets[0].event.date.split(" ")[0]}
                                                </span>
                                                <span className="text-2xl font-extrabold text-muted-teal">
                                                    {validTickets[0].event.date.split(" ")[1].replace(",", "")}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                                                    Days to go
                                                </span>
                                                <span className="text-3xl font-extrabold text-charcoal-blue">
                                                    11
                                                </span>
                                            </div>
                                        </div>

                                        <h4 className="mb-2 text-lg font-bold uppercase tracking-tight text-charcoal-blue group-hover:text-muted-teal transition">
                                            {validTickets[0].event.title}
                                        </h4>
                                        <p className="mb-4 text-sm font-medium text-steel-gray">
                                            {validTickets[0].event.location}
                                        </p>

                                        <Link
                                            href={`/attendee/ticket/${validTickets[0].id}`}
                                            className="inline-flex w-full items-center justify-center border-2 border-muted-teal bg-muted-teal px-4 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-muted-teal"
                                        >
                                            View Ticket
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-sm text-steel-gray">No upcoming events</p>
                                )}
                            </section>

                            {/* RECOMMENDATIONS */}
                            <section className="border-2 border-soft-slate bg-white p-8 shadow-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-bold uppercase tracking-widest text-charcoal-blue">
                                        Recommended For You
                                    </h3>
                                    <svg className="h-6 w-6 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>

                                <div className="space-y-6">
                                    {UPCOMING_EVENTS.map((event, i) => (
                                        <div 
                                            key={i} 
                                            className="group cursor-pointer border-2 border-soft-slate bg-white p-5 transition-all hover:border-muted-teal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                                        >
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <h4 className="text-base font-bold uppercase tracking-tight text-charcoal-blue group-hover:text-muted-teal transition">
                                                    {event.title}
                                                </h4>
                                                <span className="shrink-0 border border-muted-teal/20 bg-muted-teal/5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-muted-teal">
                                                    {event.category}
                                                </span>
                                            </div>
                                            
                                            <div className="mb-4 flex items-center gap-2 text-sm text-steel-gray">
                                                <svg className="h-4 w-4 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-medium">{event.date}</span>
                                            </div>

                                            <Link 
                                                href="/events"
                                                className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-muted-teal hover:text-charcoal-blue transition"
                                            >
                                                View Details
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    ))}
                                </div>

                                <Link 
                                    href="/events" 
                                    className="mt-6 flex w-full items-center justify-center border-2 border-charcoal-blue bg-charcoal-blue px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-charcoal-blue"
                                >
                                    Explore All Events
                                </Link>
                            </section>

                            {/* PROMO */}
                            <section className="relative overflow-hidden border-2 border-charcoal-blue bg-charcoal-blue p-8 text-white">
                                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
                                <div className="relative z-10">
                                    <h3 className="mb-2 text-lg font-bold">Invite Friends</h3>
                                    <p className="mb-4 text-sm text-white/80">
                                        Get $20 credit for each friend who registers for an event
                                    </p>
                                    <button className="w-full border-2 border-white bg-white px-4 py-2 text-sm font-bold uppercase tracking-wider text-charcoal-blue transition hover:bg-transparent hover:text-white">
                                        Share Link
                                    </button>
                                </div>
                            </section>

                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}