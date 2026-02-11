import { prisma } from '@/lib/prisma';

export async function getAttendeeData(userId: string) {
    const tickets = await prisma.ticket.findMany({
        where: {
            userId: userId,
        },
        include: {
            event: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const now = new Date();

    // Recommended: Fetch upcoming events user hasn't registered for
    const recommendedEvents = await prisma.event.findMany({
        where: {
            date: { gt: now },
            participants: {
                none: {
                    id: userId
                }
            }
        },
        take: 3,
        orderBy: {
            date: 'asc'
        }
    });

    return {
        tickets,
        recommendedEvents
    };
}
