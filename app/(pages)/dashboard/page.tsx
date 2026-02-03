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
        },
    },
    {
        id: "t2",
        status: "USED",
        event: {
            id: "2",
            title: "Design Workshop",
            date: "Feb 20, 2026",
            location: "New York, NY",
        },
    },
    {
        id: "t3",
        status: "VALID",
        event: {
            id: "3",
            title: "Marketing Summit",
            date: "Mar 05, 2026",
            location: "Austin, TX",
        },
    },
];

export default function AttendeeDashboard() {
    const total = MOCK_TICKETS.length;
    const active = MOCK_TICKETS.filter(t => t.status === "VALID").length;
    const checkedIn = MOCK_TICKETS.filter(t => t.status === "USED").length;

    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">
            <main className="mx-auto max-w-7xl px-6 py-14">

                {/* HEADER */}
                <div className="mb-16 max-w-3xl">
                    <h1 className="text-5xl font-extrabold tracking-tight text-charcoal-blue">
                        My Tickets
                    </h1>
                    <p className="mt-4 text-xl leading-relaxed text-steel-gray">
                        View your registrations, ticket status, and upcoming attendance.
                    </p>
                </div>

                {/* STATS — NEW LAYOUT */}
                <section className="mb-28 grid gap-8 lg:grid-cols-3">

                    {/* TOTAL — HERO CARD */}
                    <div className="relative overflow-hidden border-2 border-charcoal-blue bg-charcoal-blue px-10 py-12 text-white lg:col-span-2">
                        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5" />

                        <div className="relative z-10">
                            <div className="text-sm font-bold uppercase tracking-widest opacity-80">
                                Total Tickets
                            </div>
                            <div className="mt-4 text-6xl font-extrabold tracking-tight">
                                {total}
                            </div>
                            <p className="mt-3 max-w-md text-lg opacity-90">
                                Total event registrations across all attended and upcoming events.
                            </p>
                        </div>
                    </div>

                    {/* SIDE STATS */}
                    <div className="flex flex-col gap-8">

                        {/* ACTIVE */}
                        <div className="relative overflow-hidden border-2 border-muted-teal bg-muted-teal/10 px-8 py-8">
                            <div className="absolute inset-y-0 left-0 w-1 bg-muted-teal" />
                            <div className="text-sm font-bold uppercase tracking-widest text-muted-teal">
                                Active Tickets
                            </div>
                            <div className="mt-3 text-5xl font-extrabold text-charcoal-blue">
                                {active}
                            </div>
                            <p className="mt-2 text-sm text-steel-gray">
                                Upcoming events you can attend
                            </p>
                        </div>

                        {/* CHECKED IN */}
                        <div className="relative overflow-hidden border-2 border-gray-300 bg-soft-slate/40 px-8 py-8">
                            <div className="absolute inset-y-0 left-0 w-1 bg-gray-400" />
                            <div className="text-sm font-bold uppercase tracking-widest text-gray-600">
                                Checked In
                            </div>
                            <div className="mt-3 text-5xl font-extrabold text-charcoal-blue">
                                {checkedIn}
                            </div>
                            <p className="mt-2 text-sm text-steel-gray">
                                Events you’ve already attended
                            </p>
                        </div>

                    </div>
                </section>


                {/* TICKET HISTORY*/}
                <section className="mb-28">
                    <h2 className="mb-12 text-2xl font-bold uppercase tracking-widest text-charcoal-blue">
                        Ticket History
                    </h2>

                    <div className="space-y-12">
                        {MOCK_TICKETS.map((ticket) => {
                            const isActive = ticket.status === "VALID";

                            return (
                                <div
                                    key={ticket.id}
                                    className="relative border-2 border-soft-slate bg-white px-10 py-8 transition hover:border-charcoal-blue"
                                >
                                    {/* Status Dot */}
                                    <div
                                        className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 ${isActive
                                            ? "border-muted-teal bg-muted-teal"
                                            : "border-gray-400 bg-gray-300"
                                            }`}
                                    />

                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <h3 className="text-2xl font-bold uppercase tracking-tight text-charcoal-blue">
                                                {ticket.event.title}
                                            </h3>

                                            <div className="mt-3 flex flex-wrap gap-6 text-sm font-medium text-steel-gray">
                                                <span>{ticket.event.date}</span>
                                                <span>{ticket.event.location}</span>
                                            </div>

                                            <span
                                                className={`mt-5 inline-flex border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${isActive
                                                    ? "border-muted-teal bg-muted-teal/10 text-muted-teal"
                                                    : "border-gray-300 bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {isActive ? "Active" : "Checked In"}
                                            </span>
                                        </div>

                                        {isActive && (
                                            <Link
                                                href={`/ticket/${ticket.id}`}
                                                className="self-start border-2 border-charcoal-blue bg-charcoal-blue px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-charcoal-blue"
                                            >
                                                View Ticket
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>



                {/* UPCOMING TICKET*/}
                <section>
                    <h2 className="mb-12 text-2xl font-bold uppercase tracking-widest text-charcoal-blue">
                        Upcoming Attendance
                    </h2>

                    <div className="space-y-6">
                        {MOCK_TICKETS.filter(t => t.status === "VALID").map(ticket => (
                            <div
                                key={ticket.id}
                                className="group flex flex-col gap-6 border-2 border-soft-slate bg-white px-10 py-8 transition hover:border-charcoal-blue sm:flex-row sm:items-center sm:justify-between"
                            >
                                {/* DATE BLOCK */}
                                <div className="flex items-center gap-6">
                                    <div className="flex h-16 w-16 flex-col items-center justify-center border-2 border-muted-teal bg-muted-teal/10 text-muted-teal">
                                        <span className="text-xs font-bold uppercase tracking-widest">
                                            {ticket.event.date.split(" ")[0]}
                                        </span>
                                        <span className="text-xl font-extrabold">
                                            {ticket.event.date.split(" ")[1]}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold uppercase tracking-tight text-charcoal-blue group-hover:text-muted-teal transition">
                                            {ticket.event.title}
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-steel-gray">
                                            {ticket.event.location}
                                        </p>
                                    </div>
                                </div>

                                {/* ACTION */}
                                <Link
                                    href={`/event/${ticket.event.id}`}
                                    className="self-start sm:self-center border-b-2 border-muted-teal pb-1 text-sm font-bold uppercase tracking-widest text-muted-teal transition hover:text-charcoal-blue hover:border-charcoal-blue"
                                >
                                    View Event →
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>


            </main>
        </div>
    );
}
