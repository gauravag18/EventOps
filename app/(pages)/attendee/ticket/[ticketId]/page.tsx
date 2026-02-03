import React from "react";

/* MOCK DATA */
const MOCK_TICKETS = [
  {
    id: "t1",
    status: "VALID",
    event: {
      title: "Tech Conference 2026",
      date: "Feb 15, 2026",
      location: "San Francisco, CA",
    },
  },
  {
    id: "t2",
    status: "USED",
    event: {
      title: "Design Workshop",
      date: "Feb 20, 2026",
      location: "New York, NY",
    },
  },
];

export default async function MyTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  // ✅ unwrap params
  const { ticketId } = await params;

  const ticket = MOCK_TICKETS.find(t => t.id === ticketId);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <p className="text-lg font-bold text-charcoal-blue">
          Invalid Ticket
        </p>
      </div>
    );
  }

  const isActive = ticket.status === "VALID";

  return (
  <div className="min-h-screen bg-off-white font-sans text-steel-gray px-6 pt-20">
    <main className="mx-auto max-w-4xl">

      {/* EVENT HEADER */}
      <header className="mb-12 border-b-2 border-soft-slate pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-charcoal-blue">
          {ticket.event.title}
        </h1>
        <div className="mt-3 text-lg font-medium text-steel-gray">
          {ticket.event.date} · {ticket.event.location}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 gap-12 border-2 border-soft-slate bg-white p-10 md:grid-cols-2">

        {/* LEFT — QR */}
        <div className="flex items-center justify-center border-2 border-soft-slate p-6">
          <div className="flex h-72 w-72 items-center justify-center bg-soft-slate/40">
            <span className="text-sm font-bold uppercase tracking-widest text-steel-gray">
              QR Code
            </span>
          </div>
        </div>

        {/* RIGHT — STATUS + INFO */}
        <div className="flex flex-col justify-center gap-8">

          {/* STATUS */}
          <div
            className={`border-2 px-6 py-4 ${
              isActive
                ? "border-muted-teal bg-muted-teal/10"
                : "border-gray-400 bg-gray-100"
            }`}
          >
            <div
              className={`text-lg font-extrabold uppercase tracking-widest ${
                isActive ? "text-muted-teal" : "text-gray-600"
              }`}
            >
              {isActive ? "Active Ticket" : "Checked In"}
            </div>
            <div className="mt-2 text-base font-medium text-steel-gray">
              {isActive
                ? "Ready for event entry"
                : "This ticket has already been used"}
            </div>
          </div>

          {/* META */}
          <div className="border-2 border-soft-slate px-6 py-4">
            <div className="text-sm font-bold uppercase tracking-wider text-steel-gray">
              Ticket ID
            </div>
            <div className="mt-1 text-lg font-mono font-semibold text-charcoal-blue">
              {ticket.id}
            </div>
          </div>
        </div>
      </div>

      {/* INSTRUCTION */}
      <div className="mt-10 border-2 border-soft-slate bg-white px-8 py-6">
        <p className="text-lg font-medium text-steel-gray">
          Present this QR code to the staff at the entry gate for verification.
        </p>
      </div>

    </main>
  </div>
);

}
