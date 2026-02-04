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
      time: "09:00 AM - 05:00 PM",
      location: "San Francisco, CA",
      venue: "Moscone Center",
      organizer: "TechEvents Inc.",
    },
    ticketType: "General Admission",
    purchaseDate: "Jan 28, 2026",
    price: "$299",
  },
  {
    id: "t2",
    status: "USED",
    event: {
      id: "2",
      title: "Design Workshop",
      date: "Feb 20, 2026",
      time: "10:00 AM - 04:00 PM",
      location: "New York, NY",
      venue: "Design Hub",
      organizer: "Creative Studios",
    },
    ticketType: "VIP Pass",
    purchaseDate: "Jan 15, 2026",
    price: "$149",
  },
];

export default async function MyTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center border-2 border-soft-slate bg-white p-12">
          <svg className="mx-auto h-16 w-16 text-steel-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-charcoal-blue">Ticket Not Found</h2>
          <p className="mt-2 text-steel-gray">The ticket you're looking for doesn't exist.</p>
          <a href="/attendee/dashboard" className="mt-6 inline-block border-2 border-charcoal-blue bg-charcoal-blue px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-charcoal-blue">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const isActive = ticket.status === "VALID";

  return (
    <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">

      {/* HEADER SECTION - Matches Event Detail Page Structure */}
      <div className="bg-white border-b-2 border-soft-slate">
        <div className="mx-auto max-w-7xl px-6 py-8">

          {/* BACK NAVIGATION */}
          <div className="mb-6">
            <Link href="/attendee/dashboard" className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-teal hover:text-charcoal-blue transition">
              <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Tickets
            </Link>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-charcoal-blue uppercase">
                {ticket.event.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-6 text-sm font-medium text-steel-gray">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{ticket.event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{ticket.event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{ticket.event.location}</span>
                </div>
              </div>
            </div>

            {/* STATUS BADGE */}
            <div
              className={`border-2 px-6 py-3 ${isActive
                ? "border-muted-teal bg-muted-teal/10"
                : "border-gray-400 bg-gray-100"
                }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-steel-gray opacity-80">
                Ticket Status
              </div>
              <div
                className={`mt-1 text-xl font-extrabold uppercase tracking-tight ${isActive ? "text-muted-teal" : "text-gray-600"
                  }`}
              >
                {isActive ? "Valid" : "Used"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* LEFT COLUMN - QR CODE */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border-2 border-soft-slate bg-white">

              {/* QR SECTION */}
              <div className="border-b-2 border-soft-slate bg-linear-to-br from-charcoal-blue to-charcoal-blue/80 p-12">
                <div className="mx-auto max-w-md">
                  <div className="relative">
                    {/* QR Code Container */}
                    <div className="border-8 border-white bg-white p-8 shadow-2xl">
                      <div className="aspect-square bg-linear-to-br from-soft-slate to-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="mx-auto h-32 w-32 text-charcoal-blue/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h3v3h-3v-3zm0 5h3v3h-3v-3zm-5-5h3v3h-3v-3zm0 5h3v3h-3v-3z" />
                          </svg>
                          <div className="mt-4 text-sm font-bold uppercase tracking-widest text-charcoal-blue/50">
                            QR Code
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute -top-2 -left-2 h-6 w-6 border-l-4 border-t-4 border-white"></div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 border-r-4 border-t-4 border-white"></div>
                    <div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-4 border-r-4 border-white"></div>
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-base font-medium text-white/90">
                      {isActive
                        ? "Present this QR code at the venue for entry verification"
                        : "This ticket has already been scanned and used"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* TICKET INFO SECTION */}
              <div className="p-10">
                <h2 className="mb-8 text-xl font-bold uppercase tracking-widest text-charcoal-blue">
                  Ticket Details
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Ticket ID */}
                  <div className="border-l-4 border-muted-teal bg-muted-teal/5 px-6 py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                      Ticket ID
                    </div>
                    <div className="mt-2 font-mono text-lg font-bold text-charcoal-blue">
                      {ticket.id.toUpperCase()}
                    </div>
                  </div>

                  {/* Ticket Type */}
                  <div className="border-l-4 border-muted-teal bg-muted-teal/5 px-6 py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                      Ticket Type
                    </div>
                    <div className="mt-2 text-lg font-bold text-charcoal-blue">
                      {ticket.ticketType}
                    </div>
                  </div>

                  {/* Purchase Date */}
                  <div className="border-l-4 border-gray-300 bg-soft-slate/20 px-6 py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                      Purchase Date
                    </div>
                    <div className="mt-2 text-lg font-bold text-charcoal-blue">
                      {ticket.purchaseDate}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="border-l-4 border-gray-300 bg-soft-slate/20 px-6 py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                      Price Paid
                    </div>
                    <div className="mt-2 text-lg font-bold text-charcoal-blue">
                      {ticket.price}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INSTRUCTIONS */}
            {isActive && (
              <div className="border-2 border-muted-teal/20 bg-muted-teal/5 p-8">
                <h3 className="mb-4 flex items-center text-lg font-bold uppercase tracking-tight text-charcoal-blue">
                  <svg className="mr-3 h-6 w-6 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Information
                </h3>
                <ul className="space-y-3 text-steel-gray text-sm font-medium">
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-teal"></span>
                    <span>Arrive at least 30 minutes before the event start time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-teal"></span>
                    <span>Bring a valid photo ID for verification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-teal"></span>
                    <span>Screenshot or print this QR code for backup access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-teal"></span>
                    <span>Each ticket can only be scanned once for entry</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - EVENT INFO */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">

              {/* VENUE INFO */}
              <div className="border-2 border-soft-slate bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-steel-gray">
                  Venue Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-muted-teal">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider">Venue</span>
                    </div>
                    <div className="font-bold text-charcoal-blue">{ticket.event.venue}</div>
                    <div className="mt-1 text-sm text-steel-gray">{ticket.event.location}</div>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-6">
                    <div className="mb-2 flex items-center gap-2 text-muted-teal">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider">Organizer</span>
                    </div>
                    <div className="font-bold text-charcoal-blue">{ticket.event.organizer}</div>
                    <a href="#" className="mt-2 inline-block text-sm font-medium text-muted-teal hover:underline">
                      Contact Support
                    </a>
                  </div>
                </div>

                <div className="mt-6 border-t-2 border-gray-100 pt-6">
                  <a
                    href={`/event/${ticket.event.id}`}
                    className="flex w-full items-center justify-center border-2 border-charcoal-blue bg-charcoal-blue px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-charcoal-blue"
                  >
                    View Event Details
                  </a>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="border-2 border-soft-slate bg-white p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-steel-gray">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="flex w-full items-center justify-between border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-steel-gray transition hover:border-charcoal-blue hover:text-charcoal-blue">
                    <span>Add to Calendar</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button className="flex w-full items-center justify-between border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-steel-gray transition hover:border-charcoal-blue hover:text-charcoal-blue">
                    <span>Download Ticket</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button className="flex w-full items-center justify-between border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-steel-gray transition hover:border-charcoal-blue hover:text-charcoal-blue">
                    <span>Share Ticket</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* HELP */}
              <div className="border-2 border-gray-200 bg-slate-50 p-6">
                <h4 className="mb-2 flex items-center text-sm font-bold uppercase tracking-wider text-charcoal-blue">
                  <svg className="mr-2 h-5 w-5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Need Help?
                </h4>
                <p className="text-sm text-steel-gray">
                  Having issues with your ticket? Contact our support team.
                </p>
                <a href="#" className="mt-3 inline-block text-sm font-bold text-muted-teal hover:underline">
                  Get Support →
                </a>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}