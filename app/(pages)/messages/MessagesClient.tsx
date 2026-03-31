"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import ContactOrganizerButton from "@/components/ContactOrganizerButton";

interface MessagesClientProps {
    initialAttendeeQueries: any[];
    initialOrganizerQueries: any[];
    userId: string;
}

export default function MessagesClient({ initialAttendeeQueries, initialOrganizerQueries, userId }: MessagesClientProps) {
    const [activeTab, setActiveTab] = useState<'attendee' | 'organizer'>('attendee');
    const bgColor = activeTab === 'attendee' ? 'bg-[#E8F8F5]' : 'bg-[#FFF7ED]';

    return (
        <div className={`min-h-screen ${bgColor} font-sans text-steel-gray pt-16 transition-colors duration-500`}>
            <div className="mx-auto max-w-[1880px] px-6 md:px-10 py-12">

                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-[11px] font-bold tracking-widest uppercase text-muted-teal mb-2">Inbox</p>
                        <h1 className="text-4xl font-black text-charcoal-blue tracking-tight">Messages</h1>
                        <p className="text-steel-gray mt-2 text-sm max-w-md italic">Manage your event communications in a single, unified view.</p>
                    </div>

                    {/* CSR Tab Switcher */}
                    <div className="flex bg-gray-100 p-1 border-2 border-gray-200">
                        <button
                            onClick={() => setActiveTab('attendee')}
                            className={`px-5 py-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'attendee' ? 'bg-muted-teal text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-steel-gray hover:text-charcoal-blue'}`}
                        >
                            My Queries ({initialAttendeeQueries.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('organizer')}
                            className={`px-5 py-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'organizer' ? 'bg-signal-orange text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-steel-gray hover:text-charcoal-blue'}`}
                        >
                            Organizer Inbox ({initialOrganizerQueries.length})
                        </button>
                    </div>
                </div>

                <div className="relative min-h-[400px]">
                    {/* ATTENDEE SIDE */}
                    {activeTab === 'attendee' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {initialAttendeeQueries.length === 0 ? (
                                <div className="border-4 border-dashed border-gray-200 bg-white p-20 text-center">
                                    <div className="w-16 h-16 bg-muted-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8 text-muted-teal/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-charcoal-blue mb-2">No active queries</p>
                                    <p className="text-sm text-steel-gray mb-6">Ask event organizers questions before you book.</p>
                                    <Link href="/events" className="inline-block px-6 py-3 bg-muted-teal text-white text-[10px] font-black uppercase tracking-widest border-2 border-charcoal-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Explore Events</Link>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {initialAttendeeQueries.map((q: any) => {
                                        const isOpen = q.status === 'OPEN';
                                        return (
                                            <div key={q.id} className="bg-white border-2 border-charcoal-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col h-full">
                                                {/* Header */}
                                                <div className="px-5 py-4 border-b-2 border-gray-100 flex items-start justify-between bg-gray-50">
                                                    <div>
                                                        <Link href={`/event/${q.event.id}`} className="font-black text-sm text-charcoal-blue hover:text-muted-teal transition-colors line-clamp-1 pr-4 mb-2">
                                                            {q.event.title}
                                                        </Link>
                                                        <span className={`text-[8px] font-black px-2 py-1 tracking-[0.2em] uppercase rounded-full ${isOpen ? 'bg-signal-orange/10 text-signal-orange' : 'bg-muted-teal/10 text-muted-teal'}`}>
                                                            {isOpen ? 'Awaiting Reply' : 'Resolved'}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-steel-gray tabular-nums">{q.messages.length} msgs</span>
                                                </div>

                                                {/* CSR Message Preview - Scrollable */}
                                                <div className="flex-1 px-5 py-5 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                    {q.messages.map((msg: any) => {
                                                        const isMine = msg.senderId === userId;
                                                        return (
                                                            <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                                                {!isMine && <span className="text-[8px] font-black text-muted-teal uppercase tracking-widest mb-1 pl-1">{msg.sender.name || 'Organizer'}</span>}
                                                                <div className={`px-4 py-2.5 max-w-[90%] text-[13px] leading-relaxed border-2 ${isMine ? 'bg-muted-teal text-white border-muted-teal' : 'bg-gray-100 text-charcoal-blue border-gray-200'}`}>
                                                                    {msg.content}
                                                                </div>
                                                                <span className="text-[9px] font-bold text-gray-300 mt-1 uppercase tracking-tighter">
                                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Interaction */}
                                                <div className="mt-auto p-5 border-t-2 border-gray-100 bg-gray-50/50">
                                                    <ContactOrganizerButton
                                                        eventId={q.event.id}
                                                        query={{ ...q, userId }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ORGANIZER SIDE */}
                    {activeTab === 'organizer' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {initialOrganizerQueries.length === 0 ? (
                                <div className="border-4 border-dashed border-gray-200 bg-white p-20 text-center">
                                    <div className="w-16 h-16 bg-signal-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8 text-signal-orange/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-charcoal-blue mb-2">No requests yet</p>
                                    <p className="text-sm text-steel-gray mb-6">When attendees have questions about your events, they'll show up here.</p>
                                    <Link href="/organizer/dashboard" className="inline-block px-6 py-3 bg-charcoal-blue text-white text-[10px] font-black uppercase tracking-widest border-2 border-charcoal-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Go to Dashboard</Link>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {initialOrganizerQueries.map((q: any) => {
                                        const isOpen = q.status === 'OPEN';
                                        return (
                                            <div key={q.id} className="bg-white border-2 border-charcoal-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col h-full">
                                                {/* Header */}
                                                <div className="px-5 py-4 border-b-2 border-gray-100 flex items-start justify-between bg-gray-50">
                                                    <div>
                                                        <Link href={`/organizer/event/${q.event.id}`} className="font-black text-sm text-charcoal-blue hover:text-signal-orange transition-colors line-clamp-1 pr-4 mb-1">
                                                            {q.event.title}
                                                        </Link>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-bold text-steel-gray">From: {q.user.name || q.user.email}</span>
                                                            <span className={`text-[8px] font-black px-2 py-0.5 tracking-widest uppercase border ${isOpen ? 'bg-signal-orange border-signal-orange text-white' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                                                                {isOpen ? 'New' : 'Replied'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* CSR Message Preview - Scrollable */}
                                                <div className="flex-1 px-5 py-5 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                    {q.messages.map((msg: any) => {
                                                        const isOrganizerMsg = msg.senderId === userId;
                                                        return (
                                                            <div key={msg.id} className={`flex flex-col ${isOrganizerMsg ? 'items-end' : 'items-start'}`}>
                                                                <div className={`px-4 py-2.5 max-w-[90%] text-[13px] leading-relaxed border-2 ${isOrganizerMsg ? 'bg-charcoal-blue text-white border-charcoal-blue' : 'bg-gray-50 text-charcoal-blue border-gray-200'}`}>
                                                                    {msg.content}
                                                                </div>
                                                                <span className="text-[9px] font-bold text-gray-300 mt-1 uppercase tracking-tighter">
                                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Interaction */}
                                                <div className="mt-auto p-5 border-t-2 border-gray-100 bg-gray-50/50">
                                                    <Link href={`/organizer/event/${q.event.id}?tab=Queries`} className="block w-full text-center py-2.5 bg-signal-orange/10 border-2 border-signal-orange text-signal-orange text-[10px] font-black uppercase tracking-[0.2em] hover:bg-signal-orange hover:text-white transition-all">
                                                        Go To Reply Portal →
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
