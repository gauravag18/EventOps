import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) return NextResponse.json({ attendee: [], organizer: [] });

  const userId = session.user.id;
  const NOTIF_CACHE_KEY = `notifs:${userId}`;

  try {
    const cached = await (await import('@/lib/redis')).redis.get(NOTIF_CACHE_KEY);
    if (cached) {
      console.log(`[REDIS] Notification HIT: ${userId}`);
      return NextResponse.json(JSON.parse(cached));
    }
  } catch (e) { /* fallback if redis fails */ }

  const [attendeeQueries, organizerQueries] = await Promise.all([
    prisma.eventQuery.findMany({
        where: { userId, status: "REPLIED" },
        include: { event: { select: { id: true, title: true } } },
        orderBy: { updatedAt: 'desc' },
    }),
    prisma.eventQuery.findMany({
        where: { 
          status: "OPEN",
          event: { organizers: { some: { id: userId } } } 
        },
        include: { 
          event: { select: { id: true, title: true } },
          user: { select: { name: true, email: true } }
        },
        orderBy: { updatedAt: 'desc' },
    })
  ]);

  const responseData = {
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
  };

  try {
      await (await import('@/lib/redis')).redis.setex(NOTIF_CACHE_KEY, 30, JSON.stringify(responseData));
      console.log(`[REDIS] Set Notification cache: ${userId}`);
  } catch (e) {}

  return NextResponse.json(responseData);
}
