import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;
    const session = await getServerSession(getAuthOptions());

    if (!session?.user?.id) {
        return NextResponse.json({ isRegistered: false, userTeam: null, userQuery: null });
    }

    const userId = session.user.id;

    const [event, isRegisteredUser] = await Promise.all([
        prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, category: true }
        }),
        prisma.user.findFirst({
            where: { id: userId, participatingEvents: { some: { id: eventId } } }
        })
    ]);

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const isRegistered = !!isRegisteredUser;
    
    // Fetch user's team for this event (if registered + team format)
    const TEAM_FORMATS = ['Hackathon', 'Competition'];
    let userTeam: any = null;
    if (isRegistered && TEAM_FORMATS.includes(event.category)) {
        try {
            const ticket = await prisma.ticket.findFirst({
                where: { eventId: event.id, userId: userId },
                include: {
                    teamMembership: {
                        include: {
                            leader: { select: { id: true, name: true } },
                            members: {
                                include: { user: { select: { id: true, name: true } } }
                            }
                        }
                    }
                }
            } as any);
            userTeam = (ticket as any)?.teamMembership ?? null;
        } catch (e) { console.error("Error fetching user team:", e); }
    }

    let userQuery = null;
    try {
        userQuery = await prisma.eventQuery.findFirst({
            where: { eventId: event.id, userId: userId },
            include: { 
                messages: { 
                    orderBy: { createdAt: 'asc' }, 
                    include: { sender: { select: { name: true, id: true, image: true } } } 
                } 
            }
        });
    } catch (e) { console.error("Error fetching user query:", e); }

    return NextResponse.json({
        isRegistered,
        userTeam,
        userQuery
    });
}
