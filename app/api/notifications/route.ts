import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) return NextResponse.json({ attendee: [], organizer: [] });

  const userId = session.user.id;

  const attendeeQueries = await prisma.eventQuery.findMany({
    where: { userId, status: "REPLIED" },
    include: { event: { select: { id: true, title: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  const organizerQueries = await prisma.eventQuery.findMany({
    where: { 
      status: "OPEN",
      event: { organizers: { some: { id: userId } } } 
    },
    include: { 
      event: { select: { id: true, title: true } },
      user: { select: { name: true, email: true } }
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({
    attendee: attendeeQueries.map((q: any) => ({
      id: q.id,
      eventId: q.event.id,
      eventTitle: q.event.title,
      type: 'reply',
      time: q.updatedAt
    })),
    organizer: organizerQueries.map((q: any) => ({
      id: q.id,
      eventId: q.event.id,
      eventTitle: q.event.title,
      userName: q.user.name || q.user.email,
      type: 'new_message',
      time: q.updatedAt
    }))
  });
}
