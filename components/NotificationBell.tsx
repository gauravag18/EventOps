"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'attendee'|'organizer'>('attendee');
    const [notifications, setNotifications] = useState({ attendee: [], organizer: [] });
    const [hasUnread, setHasUnread] = useState(false);
    const [lastReadTime, setLastReadTime] = useState<number>(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem('eventops_notifs_read');
        if (stored) {
            setLastReadTime(parseInt(stored, 10));
        }
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                
                const currentReadTime = parseInt(localStorage.getItem('eventops_notifs_read') || '0', 10);

                const filterNew = (n: any) => new Date(n.time).getTime() > currentReadTime;
                
                data.attendee = data.attendee.filter(filterNew);
                data.organizer = data.organizer.filter(filterNew);
                
                // Set unread true if new notifications differ from currently viewed
                const prevTotal = notifications.attendee.length + notifications.organizer.length;
                const newTotal = data.attendee.length + data.organizer.length;
                
                if (newTotal > prevTotal && newTotal > 0) {
                    setHasUnread(true);
                } else if (newTotal === 0) {
                    setHasUnread(false);
                }

                setNotifications(data);
            }
        } catch (error) {}
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [notifications]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkAllRead = () => {
        const now = Date.now();
        localStorage.setItem('eventops_notifs_read', now.toString());
        setLastReadTime(now);
        setNotifications({ attendee: [], organizer: [] });
        setHasUnread(false);
        setIsOpen(false);
    };

    const unreadCount = notifications.attendee.length + notifications.organizer.length;

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={handleOpen}
                className="w-10 h-10 bg-[#13151C] border border-white/[0.08] hover:border-white/30 transition-all flex items-center justify-center relative hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] group"
            >
                <svg className={`w-5 h-5 transition-colors ${hasUnread ? 'text-signal-orange animate-pulse' : 'text-[#8896AD] group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-signal-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#13151C]">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white shadow-2xl border-2 border-soft-slate z-50 overflow-hidden slide-in-from-top-2 animate-in duration-200">
                    <div className="flex bg-gray-50 border-b-2 border-soft-slate">
                        <button 
                            onClick={() => setActiveTab('attendee')}
                            className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'attendee' ? 'text-charcoal-blue bg-white border-b-2 border-b-muted-teal' : 'text-steel-gray hover:bg-white hover:text-charcoal-blue'}`}
                        >
                            Attendee ({notifications.attendee.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('organizer')}
                            className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'organizer' ? 'text-charcoal-blue bg-white border-b-2 border-b-signal-orange' : 'text-steel-gray hover:bg-white hover:text-charcoal-blue'}`}
                        >
                            Organizer ({notifications.organizer.length})
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {activeTab === 'attendee' && (
                            <div className="divide-y divide-gray-100">
                                {notifications.attendee.length > 0 ? (
                                    notifications.attendee.map((n: any) => (
                                        <Link key={n.id} href={`/event/${n.eventId}`} onClick={() => setIsOpen(false)} className="block p-4 hover:bg-muted-teal/5 transition-colors">
                                            <p className="text-xs font-bold tracking-widest uppercase text-muted-teal mb-1">Reply Received</p>
                                            <p className="text-sm font-bold text-charcoal-blue mb-1 truncate">{n.eventTitle}</p>
                                            <p className="text-xs text-steel-gray">The organizer has responded to your message.</p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-xs text-steel-gray">No new attendee notifications.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'organizer' && (
                            <div className="divide-y divide-gray-100">
                                {notifications.organizer.length > 0 ? (
                                    notifications.organizer.map((n: any) => (
                                        <Link key={n.id} href={`/organizer/event/${n.eventId}`} onClick={() => setIsOpen(false)} className="block p-4 hover:bg-signal-orange/5 transition-colors">
                                            <p className="text-xs font-bold tracking-widest uppercase text-signal-orange mb-1">New Message</p>
                                            <p className="text-sm font-bold text-charcoal-blue mb-1 truncate">{n.eventTitle}</p>
                                            <p className="text-xs text-steel-gray truncate">From: {n.userName}</p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-xs text-steel-gray">No new organizer notifications.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t-2 border-soft-slate bg-gray-50 flex justify-center">
                        <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold tracking-widest uppercase text-steel-gray hover:text-charcoal-blue transition-colors"
                        >
                            Mark all as read
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
