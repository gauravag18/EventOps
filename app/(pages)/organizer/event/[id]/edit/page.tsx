"use client";

import React from 'react';
import CreateEventForm from '@/components/CreateEventForm';
import Link from 'next/link';

// MOCK DATA - This would normally come from an API/Database based on the ID
const MOCK_EVENT_DATA = {
    title: "Global Developer Summit 2026",
    tagline: "Building the future of software, together.",
    category: "Technology",
    date: "2026-10-15",
    time: "09:00 AM",
    location: "Moscone Center, San Francisco, CA",
    description: "Experience the most anticipated developer conference of the year.",
    image: "/placeholder-1.jpg",
    capacity: 5000,
    price: "299",
    isFree: false,
};

export default function EditEventPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="fixed top-[72px] right-6 z-20">
                <Link
                    href="/organizer/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-soft-slate text-xs font-bold uppercase tracking-widest text-steel-gray hover:text-signal-orange hover:border-signal-orange transition shadow-sm"
                >
                    ✕ Cancel Edit
                </Link>
            </div>
            {/* Reusing the form with initial data */}
            <CreateEventForm initialData={MOCK_EVENT_DATA} isEditMode={true} />
        </div>
    );
}
