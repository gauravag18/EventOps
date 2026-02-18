import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export default async function MyTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: {
        include: {
          organizers: true
        }
      },
      user: true
    }
  });

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center border-2 border-soft-slate bg-white p-12">
          <h2 className="mt-4 text-2xl font-bold text-charcoal-blue">Ticket Not Found</h2>
          <Link href="/attendee/dashboard" className="mt-6 inline-block border-2 border-charcoal-blue bg-charcoal-blue px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-charcoal-blue">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isActive = ticket.status === "VALID";
  const event = ticket.event;
  const organizerName = event.organizers[0]?.name || "EventOps Organizer";

  //QR CODE GENERATION 
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const qrCodeDataUrl = await QRCode.toDataURL(
    `${baseUrl}/api/tickets/verify/${ticket.id}`
  );

  // Date Formatting
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const timeStr = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const purchaseDateStr = new Date(ticket.createdAt).toLocaleDateString();
  const locationParts = event.location ? event.location.split("|") : [];
  const displayLocation = locationParts[0] || "TBD";

  return (
    <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">

      {/* HEADER */}
      <div className="bg-white border-b-2 border-soft-slate">
        <div className="mx-auto max-w-7xl px-6 py-8">

          <Link href="/attendee/dashboard" className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-teal hover:text-charcoal-blue transition">
            ← Back to My Tickets
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-charcoal-blue uppercase">
                {event.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-6 text-sm font-medium text-steel-gray">
                <span>{dateStr}</span>
                <span>{timeStr}</span>
                <span>{displayLocation}</span>
              </div>
            </div>

            <div className={`border-2 px-6 py-3 ${isActive
              ? "border-muted-teal bg-muted-teal/10"
              : "border-gray-400 bg-gray-100"
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-steel-gray opacity-80">
                Ticket Status
              </div>
              <div className={`mt-1 text-xl font-extrabold uppercase tracking-tight ${isActive ? "text-muted-teal" : "text-gray-600"}`}>
                {isActive ? "Valid" : "Used"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* QR COLUMN */}
          <div className="lg:col-span-2">
            <div className="border-2 border-soft-slate bg-white">

              {/* QR SECTION */}
              <div className="border-b-2 border-soft-slate bg-charcoal-blue p-12">
                <div className="mx-auto max-w-md">

                  <div className="border-8 border-white bg-white p-6 shadow-2xl">
                    <div className="aspect-square flex items-center justify-center">
                      <img
                        src={qrCodeDataUrl}
                        alt="Ticket QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-8 text-center text-white">
                    {isActive
                      ? "Present this QR code at the venue for entry verification"
                      : "This ticket has already been scanned and used"}
                  </div>

                </div>
              </div>

              {/* Ticket Info */}
              <div className="p-10">
                <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-charcoal-blue">
                  Ticket Details
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">

                  <div className="border-l-4 border-muted-teal bg-muted-teal/5 px-6 py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                      Ticket ID
                    </div>
                    <div className="mt-2 font-mono text-lg font-bold text-charcoal-blue">
                      {ticket.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>

                  <div className="border-l-4 border-gray-300 bg-soft-slate/20 px-6 py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-steel-gray">
                      Purchase Date
                    </div>
                    <div className="mt-2 text-lg font-bold text-charcoal-blue">
                      {purchaseDateStr}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* EVENT INFO */}
          <div>
            <div className="border-2 border-soft-slate bg-white p-6">

              <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-steel-gray">
                Venue Information
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="font-bold text-charcoal-blue">{displayLocation}</div>
                </div>

                <div>
                  <div className="font-bold text-charcoal-blue">{organizerName}</div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`/event/${event.id}`}
                  className="flex w-full items-center justify-center border-2 border-charcoal-blue bg-charcoal-blue px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-charcoal-blue"
                >
                  View Event Details
                </a>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
