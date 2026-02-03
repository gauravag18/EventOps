"use client";
import Link from 'next/link';
import React, { useState } from 'react';

export default function Navbar() {
    const [viewMode, setViewMode] = useState<'organizer' | 'attendee'>('attendee');

    return (
        <nav className="fixed top-0 z-50 w-full border-b-2 border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-2xl font-extrabold uppercase tracking-tighter text-gray-900 border-2 border-transparent hover:border-gray-900 px-2 -mx-2 transition-all">
                    EventOps
                </Link>
                <div className="flex items-center gap-8">
                    {/* View Toggle */}
                    <div className="flex items-center border-2 border-gray-200 bg-white p-0.5">
                        <button
                            onClick={() => setViewMode('attendee')}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${viewMode === 'attendee'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Attendee
                        </button>
                        <button
                            onClick={() => setViewMode('organizer')}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${viewMode === 'organizer'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Organizer
                        </button>
                    </div>

                    <Link href="/events" className="text-xs font-bold uppercase tracking-wider text-gray-600 transition hover:text-gray-900 hover:underline decoration-2 underline-offset-4">
                        Browse Events
                    </Link>
                    <Link href="/login" className="text-xs font-bold uppercase tracking-wider text-gray-600 transition hover:text-gray-900 hover:underline decoration-2 underline-offset-4">
                        Log In
                    </Link>
                    {viewMode === 'organizer' ? (
                        <Link
                            href="/create-event"
                            className="border-2 border-orange-600 bg-orange-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-orange-600 shadow-[4px_4px_0px_0px_rgba(194,65,12,0.4)] hover:shadow-none translate-x-[0px] translate-y-[0px] hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                            Create Event
                        </Link>
                    ) : (
                        <Link
                            href="/signup"
                            className="border-2 border-blue-900 bg-blue-900 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-blue-900 shadow-[4px_4px_0px_0px_rgba(30,58,138,0.4)] hover:shadow-none translate-x-[0px] translate-y-[0px] hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
