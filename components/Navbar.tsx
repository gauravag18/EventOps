"use client";
import Link from 'next/link';
import React, { useState } from 'react';

export default function Navbar() {
    const [viewMode, setViewMode] = useState<'organizer' | 'attendee'>('attendee');

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
                    EventOps
                </Link>
                <div className="flex items-center gap-8">
                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setViewMode('attendee')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === 'attendee'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Attendee
                        </button>
                        <button
                            onClick={() => setViewMode('organizer')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === 'organizer'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Organizer
                        </button>
                    </div>

                    <Link href="/events" className="text-sm font-medium text-gray-700 transition hover:text-gray-900">
                        Browse Events
                    </Link>
                    <Link href="/login" className="text-sm font-medium text-gray-700 transition hover:text-gray-900">
                        Log In
                    </Link>
                    {viewMode === 'organizer' ? (
                        <Link
                            href="/create-event"
                            className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-700"
                        >
                            Create Event
                        </Link>
                    ) : (
                        <Link
                            href="/signup"
                            className="rounded-lg bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-800"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
