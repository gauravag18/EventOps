'use server'
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function sendMessageToOrganizer(eventId: string, content: string, subject?: string) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) return { success: false, message: "Not logged in" };

  try {
    let query = await prisma.eventQuery.findFirst({
      where: { eventId, userId: session.user.id }
    });

    if (query) {
      if (query.status === "OPEN") {
        return { success: false, message: "Please wait for the organizer to reply before sending another message." };
      }
      await prisma.eventQuery.update({
        where: { id: query.id },
        data: { status: "OPEN" }
      });
    } else {
      query = await prisma.eventQuery.create({
        data: {
          eventId,
          userId: session.user.id,
          subject: subject || "General Inquiry",
          status: "OPEN"
        }
      });
    }

    await prisma.queryMessage.create({
      data: {
        queryId: query.id,
        content,
        senderId: session.user.id
      }
    });

    revalidatePath(`/event/${eventId}`);
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Failed to send message" };
  }
}

export async function replyToUserQuery(queryId: string, content: string) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) return { success: false, message: "Not logged in" };

  try {
    const query = await prisma.eventQuery.findUnique({
      where: { id: queryId },
      include: { event: { include: { organizers: true } } }
    });

    if (!query) return { success: false, message: "Query not found" };

    const isOrganizer = query.event.organizers.some((o: { id: string }) => o.id === session.user.id);
    if (!isOrganizer) return { success: false, message: "Not authorized" };

    await prisma.queryMessage.create({
      data: {
        queryId: query.id,
        content,
        senderId: session.user.id
      }
    });

    await prisma.eventQuery.update({
      where: { id: queryId },
      data: { status: "REPLIED" }
    });

    revalidatePath(`/organizer/event/${query.eventId}`);
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Failed to reply" };
  }
}
