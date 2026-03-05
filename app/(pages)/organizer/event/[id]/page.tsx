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
        include: { organizers: true }
    });

    if (!event) notFound();

    const isOrganizer = event.organizers.some(o => o.id === session.user.id);
    if (!isOrganizer) redirect("/organizer/dashboard");

    const tickets = await prisma.ticket.findMany({
        where: { eventId: id },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    const attendees = tickets.map(t => ({
        id: t.id,
        name: t.user.name || "Unknown",
        email: t.user.email || "",
        ticket: event.isFree ? "Free Registration" : "Standard Ticket",
        status: t.status === "VALID" ? "Confirmed" : t.status,
        purchaseDate: t.createdAt.toLocaleDateString(),
        checkedIn: false,
        qrValue: `ticket:${t.id}`,
    }));

    const sold = tickets.filter(t => t.status === "VALID" || t.status === "USED").length;
    const priceVal = event.isFree ? 0 : parseFloat(event.price || "0");
    const revenue = isNaN(priceVal) ? 0 : sold * priceVal;

    const stats = {
        revenue,
        sold,
        capacity: event.capacity,
    };

    // Sales by month — last 12 months rolling window
    const now = new Date();
    const salesByMonth: { label: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString('default', { month: 'short' });
        const count = tickets.filter(t => {
            const td = new Date(t.createdAt);
            return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
        }).length;
        salesByMonth.push({ label, count });
    }

    function timeAgo(date: Date): string {
        const diff = Math.floor((Date.now() - date.getTime()) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    const recentActivity = tickets.slice(0, 10).map(t => ({
        userName: t.user.name || t.user.email || "Unknown",
        ticketType: event.isFree ? "Free" : "Standard",
        status: t.status,
        timeAgo: timeAgo(new Date(t.updatedAt)),
    }));

    const eventData = {
        id: event.id,
        title: event.title,
        status: new Date(event.date) < new Date() ? "ENDED" : "PUBLISHED",
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: event.time || '',
        location: event.location?.split('|')[0] || '',
        rawDate: event.date.toISOString(),
    };

    return (
        <OrganizerEventView
            event={eventData}
            attendees={attendees}
            stats={stats}
            salesByMonth={salesByMonth}
            recentActivity={recentActivity}
        />
    );
}