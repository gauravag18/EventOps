'use server'

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function registerForEvent(eventId: string) {
    const session = await getServerSession(getAuthOptions());

    if (!session || !session.user || !session.user.id) {
        return { success: false, message: "You must be logged in to register." };
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { tickets: true } // Use tickets relation to check count
        });

        if (!event) {
            return { success: false, message: "Event not found." };
        }

        // Check if already registered
        const existingTicket = await prisma.ticket.findFirst({
            where: {
                eventId: eventId,
                userId: session.user.id
            }
        });

        if (existingTicket) {
            return { success: false, message: "You are already registered for this event." };
        }

        // Check capacity
        const soldCount = event.tickets.length;
        if (event.capacity > 0 && soldCount >= event.capacity) {
            return { success: false, message: "Event is sold out." };
        }

        // Create ticket
        await prisma.ticket.create({
            data: {
                userId: session.user.id,
                eventId: eventId,
                status: "VALID"
            }
        });

        // Also update participants relation for backward compatibility if needed, 
        // though strictly speaking we should migrate to using tickets only.
        // But the current UI uses participants.length.
        // So let's connect the user to the event as a participant too.
        await prisma.event.update({
            where: { id: eventId },
            data: {
                participants: {
                    connect: { id: session.user.id }
                }
            }
        });

        revalidatePath(`/event/${eventId}`);
        revalidatePath(`/events`);
        revalidatePath(`/attendee/dashboard`);

        return { success: true, message: "Successfully registered!" };

    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Failed to register. Please try again." };
    }
}
