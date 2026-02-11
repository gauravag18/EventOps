import React from 'react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import CreateEventForm from '@/components/CreateEventForm';
import Link from 'next/link';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(getAuthOptions());

    if (!session?.user?.id) {
        redirect(`/login?error=${encodeURIComponent("You must be logged in to edit an event.")}`);
    }

    const event = await prisma.event.findUnique({
        where: { id },
        include: { organizers: true }
    });

    if (!event) {
        notFound();
    }

    // Check if organizer
    const isOrganizer = event.organizers.some(o => o.id === session.user.id);
    if (!isOrganizer) {
        redirect("/organizer/dashboard?error=unauthorized"); // Better handling later
    }

    // Transform data for form
    const initialData = {
        title: event.title,
        tagline: event.tagline || '',
        category: event.category,
        date: event.date.toISOString().split('T')[0],
        time: event.time || '',
        location: event.location?.split('|')[0] || '',
        coordinates: event.location?.split('|')[1] || '',
        description: event.description || '',
        image: event.image || '',
        capacity: event.capacity,
        price: event.price || '',
        isFree: event.isFree,
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed top-[72px] right-6 z-20">
                <Link
                    href={`/organizer/event/${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-soft-slate text-xs font-bold uppercase tracking-widest text-steel-gray hover:text-signal-orange hover:border-signal-orange transition shadow-sm"
                >
                    ✕ Cancel Edit
                </Link>
            </div>
            {/* Reusing the form with initial data */}
            <CreateEventForm
                initialData={initialData}
                isEditMode={true}
                eventId={id}
            />
        </div>
    );
}
