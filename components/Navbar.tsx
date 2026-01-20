import Link from 'next/link';
import React from 'react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
                    EventOps
                </Link>
                <div className="flex items-center gap-8">
                    <Link href="/events" className="text-sm font-medium text-gray-700 transition hover:text-gray-900">
                        Browse Events
                    </Link>
                    <Link href="/login" className="text-sm font-medium text-gray-700 transition hover:text-gray-900">
                        Log In
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-lg bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-800"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
