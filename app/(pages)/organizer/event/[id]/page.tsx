import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import OrganizerEventView from '@/components/OrganizerEventView';

export default async function OrganizerEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(getAuthOptions());

    if (!session?.user?.id) {
        redirect(`/login?error=${encodeURIComponent("You must be logged in to manage an event.")}`);
    }

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            organizers: true,
        }
    });

    if (!event) {
        notFound();
    }

    const isOrganizer = event.organizers.some(o => o.id === session.user.id);
    if (!isOrganizer) {
        redirect("/organizer/dashboard");
    }

    // Fetch tickets for detailed attendee info
    const tickets = await prisma.ticket.findMany({
        where: { eventId: id },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    // Map tickets to attendees + add qrValue
    const attendees = tickets.map(t => ({
        id: t.id,
        name: t.user.name || "Unknown",
        email: t.user.email || "",
        ticket: event.isFree ? "Free Registration" : "Standard Ticket",
        status: t.status === "VALID" ? "Confirmed" : t.status,
        purchaseDate: t.createdAt.toLocaleDateString(),
        checkedIn: false,

        // the attendee's ticket page / view.
        // Examples of common formats:
        // `ticket:${t.id}`
        // `${event.id}-${t.id}`
        // `event:${event.id}|ticket:${t.id}|user:${t.userId}`
        // `{"eventId":"${event.id}","ticketId":"${t.id}","email":"${t.user.email}"}`
        // `checkin:${event.id}:${t.id}:${Date.now()}`
        qrValue: `ticket:${t.id}`,    // ← ← ← REPLACE / ADJUST THIS LINE
    }));

    // Calculate Stats
    const sold = tickets.filter(t => t.status === "VALID").length;
    const priceVal = event.isFree ? 0 : parseFloat(event.price || "0");
    const revenue = isNaN(priceVal) ? 0 : sold * priceVal;

    const stats = {
        revenue,
        sold,
        capacity: event.capacity,
        views: 0,
        conversionRate: "N/A"
    };

    const eventData = {
        id: event.id,
        title: event.title,
        status: new Date(event.date) < new Date() ? "ENDED" : "PUBLISHED",
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: event.time || '',
        location: event.location?.split('|')[0] || ''
    };

    return (
        <OrganizerEventView
            event={eventData}
            attendees={attendees}
            stats={stats}
        />
    );
}