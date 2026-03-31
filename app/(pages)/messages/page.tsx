import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage() {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) redirect("/login");

    const userId = session.user.id;

    // Queries where the user is the attendee
    const myQueries = await prisma.eventQuery.findMany({
        where: { userId },
        include: {
            event: { select: { id: true, title: true } },
            messages: {
                orderBy: { createdAt: 'asc' },
                include: { sender: { select: { name: true, id: true, image: true } } }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    // Queries where the user is an organizer
    const organizerQueries = await prisma.eventQuery.findMany({
        where: {
            event: { organizers: { some: { id: userId } } }
        },
        include: {
            event: { select: { id: true, title: true } },
            user: { select: { name: true, email: true } },
            messages: {
                orderBy: { createdAt: 'asc' },
                include: { sender: { select: { name: true, id: true, image: true } } }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <MessagesClient 
            initialAttendeeQueries={myQueries} 
            initialOrganizerQueries={organizerQueries} 
            userId={userId} 
        />
    );
}
