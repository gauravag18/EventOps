import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";
import { invalidateEventCache } from "@/lib/event-cache";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(getAuthOptions());

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Validate basic fields
        if (!data.title || !data.date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create the event
        const event = await prisma.event.create({
            data: {
                title: data.title,
                tagline: data.tagline,
                category: data.category,
                // Parse date string to Date object if needed, or assume it's ISO
                date: new Date(data.date),
                time: data.time,
                location: data.location,
                description: data.description,
                image: data.image,
                capacity: parseInt(data.capacity) || 0,
                price: data.price,
                isFree: data.isFree,
                // Connect the creator as an organizer
                organizers: {
                    connect: {
                        id: session.user.id
                    }
                }
            }
        });

        // Initialize participants array as empty for the new event
        // The creator is added as an organizer, not necessarily a participant

        await invalidateEventCache();

        return NextResponse.json({ success: true, eventId: event.id });

    } catch (error) {
        console.error("Event creation error:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}
