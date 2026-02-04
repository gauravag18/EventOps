"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { data: realSession } = useSession();
    // DEV MODE: Mock session to show authenticated UI
    const session = realSession || {
        user: { name: "Dev User", email: "dev@local", image: null }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
        setIsSidebarOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 z-50 w-full border-b-2 border-soft-slate bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="text-2xl font-extrabold uppercase tracking-tighter text-charcoal-blue border-2 border-transparent hover:border-charcoal-blue px-2 -mx-2 transition-all">
                        EventOps
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/events" className="hidden md:block text-xs font-bold uppercase tracking-wider text-steel-gray transition hover:text-charcoal-blue hover:underline decoration-2 underline-offset-4">
                            Browse Events
                        </Link>

                        {/* Profile Trigger */}
                        <button
                            onClick={toggleSidebar}
                            className="w-10 h-10 bg-off-white border-2 border-soft-slate hover:border-charcoal-blue transition-all flex items-center justify-center overflow-hidden hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-5 h-5 text-charcoal-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-charcoal-blue/50 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
                />
            )}

            {/* Right Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white z-[70] border-l-2 border-soft-slate shadow-2xl transform transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b-2 border-soft-slate flex items-center justify-between bg-off-white">
                        <span className="text-sm font-bold uppercase tracking-wider text-charcoal-blue">Menu</span>
                        <button onClick={() => setIsSidebarOpen(false)} className="text-steel-gray hover:text-charcoal-blue transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {session ? (
                            <>
                                {/* Profile Info */}
                                <div className="flex items-center gap-4 pb-6 border-b-2 border-soft-slate">
                                    <div className="w-12 h-12 bg-muted-teal/10 border-2 border-muted-teal/20 flex items-center justify-center shrink-0">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-muted-teal uppercase">{session.user?.name?.[0] || 'U'}</span>
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-charcoal-blue truncate">{session.user?.name || 'User'}</h3>
                                        <p className="text-xs text-steel-gray truncate">{session.user?.email}</p>
                                    </div>
                                </div>

                                {/* General Links */}
                                <div className="space-y-3">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="flex items-center gap-3 text-steel-gray hover:text-charcoal-blue font-bold transition-colors group"
                                    >
                                        <span className="w-2 h-2 bg-steel-gray group-hover:bg-muted-teal transition-colors rounded-sm" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="flex items-center gap-3 text-steel-gray hover:text-charcoal-blue font-bold transition-colors group"
                                    >
                                        <span className="w-2 h-2 bg-steel-gray group-hover:bg-muted-teal transition-colors rounded-sm" />
                                        Settings
                                    </Link>
                                </div>

                                {/* ATTENDEE SECTION */}
                                <div className="space-y-4 pt-4 border-t-2 border-soft-slate">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-teal">Attendee</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/my-tickets"
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="border-2 border-soft-slate hover:border-charcoal-blue p-3 text-center transition-all hover:bg-off-white group"
                                        >
                                            <div className="flex justify-center mb-2">
                                                <svg className="w-6 h-6 text-steel-gray group-hover:text-muted-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold text-charcoal-blue uppercase">My Tickets</span>
                                        </Link>
                                        <Link
                                            href="/favorites"
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="border-2 border-soft-slate hover:border-charcoal-blue p-3 text-center transition-all hover:bg-off-white group"
                                        >
                                            <div className="flex justify-center mb-2">
                                                <svg className="w-6 h-6 text-steel-gray group-hover:text-muted-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold text-charcoal-blue uppercase">Favorites</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* ORGANIZER SECTION */}
                                <div className="space-y-4 pt-4 border-t-2 border-soft-slate">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-signal-orange">Organizer</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="border-2 border-soft-slate hover:border-charcoal-blue p-3 text-center transition-all hover:bg-off-white group"
                                        >
                                            <div className="flex justify-center mb-2">
                                                <svg className="w-6 h-6 text-steel-gray group-hover:text-signal-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold text-charcoal-blue uppercase">Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/organizer/create-event"
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="border-2 border-soft-slate hover:border-charcoal-blue p-3 text-center transition-all hover:bg-off-white group"
                                        >
                                            <div className="flex justify-center mb-2">
                                                <svg className="w-6 h-6 text-steel-gray group-hover:text-signal-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold text-charcoal-blue uppercase">New Event</span>
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6 text-center pt-10">
                                <h3 className="text-xl font-bold text-charcoal-blue uppercase tracking-tight">Join EventOps</h3>
                                <p className="text-sm text-steel-gray">Sign in to manage your tickets and events.</p>
                                <div className="space-y-3">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="block w-full border-2 border-charcoal-blue bg-charcoal-blue py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-charcoal-blue"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="block w-full border-2 border-charcoal-blue py-3 text-sm font-bold uppercase tracking-wider text-charcoal-blue transition hover:bg-charcoal-blue hover:text-white"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {session && (
                        <div className="p-6 border-t-2 border-soft-slate bg-off-white">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-signal-orange hover:text-charcoal-blue transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
