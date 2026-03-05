'use server'
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addManualAttendee({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in as organizer" };
  }
  try {
    // Verify organizer permission
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizers: true },
    });
    if (!event) {
      return { success: false, message: "Event not found" };
    }
    const isOrganizer = event.organizers.some(o => o.id === session.user.id);
    if (!isOrganizer) {
      return { success: false, message: "Not authorized" };
    }
    // Capacity check
    const currentTickets = await prisma.ticket.count({
      where: { eventId },
    });
    if (event.capacity > 0 && currentTickets >= event.capacity) {
      return { success: false, message: "Event capacity reached" };
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return { success: false, noAccount: true, message: "User does not have an account" };
    }
    // Prevent duplicate ticket
    const existing = await prisma.ticket.findFirst({
      where: { eventId, userId: user.id },
    });
    if (existing) {
      return { success: false, message: "This person already has a ticket for this event" };
    }
    // Create ticket
    await prisma.ticket.create({
      data: {
        userId: user.id,
        eventId,
        status: "VALID",
      },
    });
    // Connect to participants relation
    await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          connect: { id: user.id },
        },
      },
    });
    revalidatePath(`/organizer/event/${eventId}`);
    return { success: true, message: "Attendee added successfully" };
  } catch (err: any) {
    console.error("addManualAttendee error:", err);
    return {
      success: false,
      message: err.message?.includes("Unique")
        ? "Email might already exist or duplicate entry"
        : "Failed to add attendee – check server logs"
    };
  }
}

export async function removeAttendee({
  eventId,
  ticketId,
}: {
  eventId: string;
  ticketId: string;
}) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in as organizer" };
  }
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizers: true },
    });
    if (!event) return { success: false, message: "Event not found" };

    const isOrganizer = event.organizers.some(o => o.id === session.user.id);
    if (!isOrganizer) return { success: false, message: "Not authorized" };

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket || ticket.eventId !== eventId) {
      return { success: false, message: "Ticket not found for this event" };
    }

    // Disconnect from participants and delete ticket
    await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          disconnect: { id: ticket.userId },
        },
      },
    });
    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    revalidatePath(`/organizer/event/${eventId}`);
    return { success: true, message: "Attendee removed successfully" };
  } catch (err: any) {
    console.error("removeAttendee error:", err);
    return { success: false, message: "Failed to remove attendee" };
  }
}

export async function markTicketUsed({
  eventId,
  ticketId,
}: {
  eventId: string;
  ticketId: string;
}) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return { success: false, message: "You must be logged in as organizer" };
  }
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizers: true },
    });
    if (!event) return { success: false, message: "Event not found" };

    const isOrganizer = event.organizers.some(o => o.id === session.user.id);
    if (!isOrganizer) return { success: false, message: "Not authorized" };

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket || ticket.eventId !== eventId) {
      return { success: false, message: "Ticket not found for this event" };
    }
    if (ticket.status === "USED") {
      return { success: false, message: "Ticket is already marked as used" };
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "USED" },
    });

    revalidatePath(`/organizer/event/${eventId}`);
    return { success: true, message: "Ticket marked as used" };
  } catch (err: any) {
    console.error("markTicketUsed error:", err);
    return { success: false, message: "Failed to update ticket status" };
  }
}