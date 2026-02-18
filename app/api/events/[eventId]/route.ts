import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { invalidateEventCache, getCachedEvent, cacheEvent } from "@/lib/event-cache";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await context.params;

    try {
        // Check Redis Cache
        const cachedEvent = await getCachedEvent(eventId);
        if (cachedEvent) {
            return NextResponse.json(cachedEvent);
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                organizers: true,
                participants: true
            }
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Cache the result
        await cacheEvent(eventId, event);

        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await context.params;
    const session = await getServerSession(getAuthOptions());

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Check if user is an organizer of this event
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            include: { organizers: true }
        });

        if (!existingEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const isOrganizer = existingEvent.organizers.some(o => o.id === session.user.id);
        if (!isOrganizer) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const data = await request.json();

        // Basic validation could be improved, but relying on client for now + basic type checks
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                title: data.title,
                tagline: data.tagline,
                category: data.category,
                date: data.date ? new Date(data.date) : undefined,
                time: data.time,
                location: data.location,
                description: data.description,
                image: data.image,
                capacity: data.capacity !== undefined ? parseInt(data.capacity) : undefined,
                price: data.price,
                isFree: data.isFree,
            }
        });

        // Invalidate cache (both list and this specific event)
        await invalidateEventCache(eventId);

        return NextResponse.json(updatedEvent);

    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await context.params;
    const session = await getServerSession(getAuthOptions());

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Check if user is an organizer
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            include: { organizers: true }
        });

        if (!existingEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const isOrganizer = existingEvent.organizers.some(o => o.id === session.user.id);
        if (!isOrganizer) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.event.delete({
            where: { id: eventId }
        });

        // Invalidate cache (both list and this specific event)
        await invalidateEventCache(eventId);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
