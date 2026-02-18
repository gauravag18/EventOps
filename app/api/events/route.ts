import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedEvents, cacheEvents } from '@/lib/event-cache';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';

    // Construct Cache Key
    const cacheKey = JSON.stringify({ q, category });

    // Check Cache
    const cachedEvents = await getCachedEvents(cacheKey);
    if (cachedEvents) {
        return NextResponse.json(cachedEvents);
    }

    // Construct Where Clause
    const where: any = {};
    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
        ];
    }
    if (category && category !== 'All Events') {
        where.category = category;
    }

    try {
        // Fetch Events
        const events = await prisma.event.findMany({
            where,
            include: {
                participants: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Post-process logic could go here or in the client/component
        const processedEvents = events.map(event => ({
            ...event,
            spotsLeft: event.capacity - event.participants.length,
            displayLocation: event.location ? event.location.split('|')[0] : 'TBD'
        }));

        // Cache the result
        await cacheEvents(cacheKey, processedEvents);

        return NextResponse.json(processedEvents);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}
