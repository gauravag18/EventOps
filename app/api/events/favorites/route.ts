import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idsString = searchParams.get('ids');

    if (!idsString) return NextResponse.json([], { status: 200 });

    const ids = idsString.split(',').filter(id => id.length > 0);

    try {
        const events = await prisma.event.findMany({
            where: {
                id: { in: ids }
            },
            include: {
                _count: {
                    select: { participants: true }
                }
            }
        });

        // Format similarly to list view for consistency
        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description || '',
            category: event.category,
            tags: event.tags ?? [],
            date: event.date,
            image: event.image || '/placeholder-1.jpg',
            price: event.price,
            isFree: event.isFree,
            capacity: event.capacity,
            displayLocation: event.location ? event.location.split('|')[0] : 'TBD',
            spotsLeft: event.capacity - event._count.participants,
            attendeesCount: event._count.participants,
            isRemote: false, // Default or parse from description if needed
        }));

        return NextResponse.json(formattedEvents);
    } catch (error) {
        console.error("[FAVORITES_API_ERROR]", error);
        return NextResponse.json({ error: "Failed to fetch favorite events" }, { status: 500 });
    }
}
