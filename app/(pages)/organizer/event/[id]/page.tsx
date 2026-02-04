"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// MOCK DATA
const EVENT_DATA = {
    id: "e1",
    title: "Global Developer Summit 2026",
    status: "PUBLISHED",
    date: "Oct 15, 2026",
    time: "09:00 AM",
    location: "Moscone Center, San Francisco, CA",
    capacity: 5000,
    sold: 2450,
    revenue: 732550,
    views: 12500,
    conversionRate: "19.6%"
};

const ATTENDEES = [
    { id: "a1", name: "Alex Johnson", email: "alex.j@example.com", ticket: "General Admission", status: "Confirmed", purchaseDate: "Jan 15, 2026", checkedIn: false },
    { id: "a2", name: "Sarah Miller", email: "sarah.m@example.com", ticket: "VIP Pass", status: "Confirmed", purchaseDate: "Jan 16, 2026", checkedIn: true },
    { id: "a3", name: "Michael Chen", email: "m.chen@tech.co", ticket: "General Admission", status: "Confirmed", purchaseDate: "Jan 18, 2026", checkedIn: false },
    { id: "a4", name: "Emily Davis", email: "emily.d@design.studio", ticket: "Early Bird", status: "Confirmed", purchaseDate: "Jan 20, 2026", checkedIn: false },
    { id: "a5", name: "David Wilson", email: "dwilson@corp.inc", ticket: "VIP Pass", status: "Refunded", purchaseDate: "Jan 10, 2026", checkedIn: false },
];

const TABS = ["Overview", "Attendees", "Marketing", "Settings"];

export default function OrganizerEventPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState("Overview");

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">

            {/* EVENT HEADER */}
            <div className="bg-white border-b-2 border-soft-slate">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/organizer/dashboard" className="text-xs font-bold uppercase tracking-widest text-steel-gray hover:text-signal-orange transition flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Dashboard
                                </Link>
                                <span className="w-1 h-1 rounded-full bg-soft-slate"></span>
                                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${EVENT_DATA.status === 'PUBLISHED' ? 'border-signal-orange bg-signal-orange/10 text-signal-orange' : 'border-gray-300 text-gray-500'}`}>
                                    {EVENT_DATA.status}
                                </span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-charcoal-blue uppercase tracking-tight">
                                {EVENT_DATA.title}
                            </h1>
                            <div className="mt-2 flex items-center gap-4 text-sm font-medium text-steel-gray">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {EVENT_DATA.date}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {EVENT_DATA.location}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={`/organizer/event/${EVENT_DATA.id}/edit`} className="px-5 py-2.5 bg-white border-2 border-soft-slate text-charcoal-blue font-bold uppercase tracking-widest text-xs hover:border-signal-orange hover:text-signal-orange transition">
                                Edit Event
                            </Link>
                            <button className="px-5 py-2.5 bg-signal-orange border-2 border-signal-orange text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-signal-orange transition shadow-md">
                                View Public Page
                            </button>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="flex items-center gap-8 mt-10 border-b border-gray-100">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab
                                    ? 'border-signal-orange text-signal-orange'
                                    : 'border-transparent text-steel-gray hover:text-charcoal-blue'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* OVERVIEW CONTENT */}
                {activeTab === "Overview" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Total Revenue", value: formatCurrency(EVENT_DATA.revenue), trend: "+12%" },
                                { label: "Tickets Sold", value: EVENT_DATA.sold, sub: `/ ${EVENT_DATA.capacity}`, trend: "+5%" },
                                { label: "Page Views", value: EVENT_DATA.views.toLocaleString(), trend: "+24%" },
                                { label: "Conversion", value: EVENT_DATA.conversionRate, trend: "-2%" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 border-2 border-soft-slate transition hover:border-signal-orange group">
                                    <div className="text-xs font-bold uppercase tracking-widest text-steel-gray mb-2">{stat.label}</div>
                                    <div className="text-3xl font-extrabold text-charcoal-blue mb-2">{stat.value} <span className="text-sm text-steel-gray font-medium">{stat.sub}</span></div>
                                    <div className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                        {stat.trend} <span className="text-steel-gray font-medium">vs last week</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart & Recent Activity Grid */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Chart Area */}
                            <div className="lg:col-span-2 bg-white border-2 border-soft-slate p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-bold uppercase tracking-tight text-charcoal-blue">Sales Over Time</h3>
                                    <select className="text-xs font-bold uppercase tracking-wider border-none bg-gray-100 px-3 py-1 rounded text-steel-gray focus:ring-0 cursor-pointer">
                                        <option>Last 30 Days</option>
                                        <option>Last 7 Days</option>
                                        <option>All Time</option>
                                    </select>
                                </div>
                                <div className="h-64 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-end gap-2 px-4 pb-0">
                                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-signal-orange/80 hover:bg-signal-orange transition-all duration-300" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                    <span className="relative z-10 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-steel-gray border border-gray-200 shadow-sm">
                                        Chart Visualization
                                    </span>
                                </div>
                            </div>

                            {/* Activity Feed */}
                            <div className="bg-white border-2 border-soft-slate p-8">
                                <h3 className="text-lg font-bold uppercase tracking-tight text-charcoal-blue mb-6">Recent Activity</h3>
                                <div className="space-y-6">
                                    {[
                                        { user: "Sarah M.", action: "bought 1 VIP Ticket", time: "2 mins ago" },
                                        { user: "John D.", action: "bought 2 General Tickets", time: "15 mins ago" },
                                        { user: "System", action: "Capacity alert: 80% full", time: "1 hour ago" },
                                        { user: "Mike R.", action: "requested a refund", time: "2 hours ago" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-signal-orange shrink-0"></div>
                                            <div>
                                                <p className="text-sm font-bold text-charcoal-blue">{item.user} <span className="font-medium text-steel-gray">{item.action}</span></p>
                                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 py-2 border border-soft-slate text-xs font-bold uppercase tracking-widest text-steel-gray hover:bg-off-white transition">
                                    View All
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ATTENDEES TAB */}
                {activeTab === "Attendees" && (
                    <div className="bg-white border-2 border-soft-slate animate-in fade-in slide-in-from-bottom-2 duration-500">

                        {/* Toolbar */}
                        <div className="p-6 border-b border-soft-slate flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative max-w-sm w-full">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search attendees..."
                                    className="w-full pl-10 pr-4 py-2 border border-soft-slate bg-off-white text-sm focus:border-signal-orange focus:ring-0 outline-none transition"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 border border-soft-slate text-xs font-bold uppercase tracking-widest text-steel-gray hover:text-signal-orange hover:border-signal-orange transition flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Export CSV
                                </button>
                                <button className="px-4 py-2 bg-charcoal-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-charcoal-blue/90 transition shadow-md">
                                    + Add Attendee
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-off-white border-b border-soft-slate">
                                    <tr>
                                        {["Name", "Ticket Type", "Purchase Date", "Status", "Actions"].map((h) => (
                                            <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-steel-gray">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {ATTENDEES.map((attendee) => (
                                        <tr key={attendee.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-charcoal-blue">{attendee.name}</div>
                                                <div className="text-xs text-steel-gray">{attendee.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-steel-gray border border-gray-200">
                                                    {attendee.ticket}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-steel-gray font-medium">
                                                {attendee.purchaseDate}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${attendee.status === 'Confirmed' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${attendee.status === 'Confirmed' ? 'bg-green-600' : 'bg-red-500'
                                                        }`} />
                                                    {attendee.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {!attendee.checkedIn ? (
                                                        <button className="text-xs font-bold uppercase tracking-wider text-signal-orange hover:underline">
                                                            Check In
                                                        </button>
                                                    ) : (
                                                        <button className="text-xs font-bold uppercase tracking-wider text-green-600 cursor-default">
                                                            ✓ Checked In
                                                        </button>
                                                    )}
                                                    <button className="text-gray-400 hover:text-charcoal-blue">
                                                        •••
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-soft-slate flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-steel-gray">Showing 5 of 2450</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-soft-slate text-xs font-bold text-steel-gray hover:bg-gray-50 disabled:opacity-50">Prev</button>
                                <button className="px-3 py-1 border border-soft-slate text-xs font-bold text-steel-gray hover:bg-gray-50">Next</button>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
