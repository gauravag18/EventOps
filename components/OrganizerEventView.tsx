"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useOptimistic, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import InviteOrganizerPanel from './InviteOrganizerPanel';
import { addManualAttendee, removeAttendee, markTicketUsed } from '@/app/actions/ticket';
import { useToast } from './ToastProvider';

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticket: string;
  status: string;
  purchaseDate: string;
  checkedIn: boolean;
  qrValue?: string;
}

interface EventStats {
  revenue: number;
  sold: number;
  capacity: number;
}

interface SaleMonth {
  label: string;
  count: number;
}

interface ActivityItem {
  userName: string;
  ticketType: string;
  status: string;
  timeAgo: string;
}

interface OrganizerEventViewProps {
  event: {
    id: string;
    title: string;
    status: string;
    date: string;
    time: string;
    location: string;
    rawDate: string; 
  };
  attendees: Attendee[];
  stats: EventStats;
  salesByMonth: SaleMonth[];
  recentActivity: ActivityItem[];
}

// Dropdown menu for attendee row actions
function AttendeeActionsMenu({
  attendeeId,
  ticketStatus,
  onMarkUsed,
  onRemove,
}: {
  attendeeId: string;
  ticketStatus: string;
  onMarkUsed: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="text-[15px] text-gray-400 hover:text-charcoal-blue transition-colors px-1 leading-none font-bold tracking-widest"
        title="Actions"
      >
        •••
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-30 bg-white border-2 border-soft-slate shadow-lg min-w-45 py-1">
          {ticketStatus !== 'USED' && (
            <button
              onClick={() => { setOpen(false); onMarkUsed(); }}
              className="w-full text-left px-4 py-2.5 text-[12px] font-bold tracking-wider text-charcoal-blue hover:bg-gray-50 hover:text-signal-orange transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark Ticket Used
            </button>
          )}
          <button
            onClick={() => { setOpen(false); onRemove(); }}
            className="w-full text-left px-4 py-2.5 text-[12px] font-bold tracking-wider text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove Attendee
          </button>
        </div>
      )}
    </div>
  );
}

function ShareLinkBox({ eventId }: { eventId: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/event/${eventId}` : `/event/${eventId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 max-w-xl">
      <div className="flex-1 px-4 py-2.5 border-2 border-soft-slate bg-gray-50 text-[13px] text-steel-gray font-mono truncate select-all">
        {url}
      </div>
      <button
        onClick={handleCopy}
        className={`shrink-0 px-5 py-2.5 border-2 text-[12px] font-bold tracking-widest transition ${
          copied
            ? 'border-muted-teal bg-muted-teal/10 text-muted-teal'
            : 'border-charcoal-blue bg-charcoal-blue text-white hover:bg-white hover:text-charcoal-blue'
        }`}
      >
        {copied ? '✓ Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}

export default function OrganizerEventView({
  event,
  attendees: initialAttendees,
  stats,
  salesByMonth,
  recentActivity,
}: OrganizerEventViewProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("Overview");

  // Check-in state (client-side)
  const [checkInMap, setCheckInMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initialAttendees.forEach(a => map[a.id] = a.checkedIn);
    return map;
  });

  // Ticket status map (for used state)
  const [ticketStatusMap, setTicketStatusMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialAttendees.forEach(a => map[a.id] = a.status === 'Confirmed' ? 'VALID' : a.status.toUpperCase());
    return map;
  });

  // Add attendee modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ email: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  const [optimisticAttendees, addOptimisticAttendee] = useOptimistic(
    initialAttendees,
    (state: Attendee[], newAttendee: Attendee) => [newAttendee, ...state]
  );

  const TABS = ["Overview", "Attendees", "Marketing", "Settings"];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const isPublished = event.status === "PUBLISHED";
  const percentSold = stats.capacity > 0 ? Math.round((stats.sold / stats.capacity) * 100) : 0;

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitMessage(null);

    const email = formData.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    startTransition(() => {
      addOptimisticAttendee({
        id: `temp-${Date.now()}`,
        name: "Processing...",
        email,
        ticket: "Manual Entry",
        status: "Confirmed",
        purchaseDate: new Date().toLocaleDateString(),
        checkedIn: false
      });
    });

    try {
      const res = await addManualAttendee({ eventId: event.id, email });
      if (res.success) {
        setSubmitMessage(res.message || "Attendee added successfully!");
        setFormData({ email: "" });
        router.refresh();
        setTimeout(() => setShowAddModal(false), 1800);
      } else {
        if (res.noAccount) {
          showToast(res.message || "User does not have an account", "error");
          setFormError("User does not have an account. Please ask them to register.");
        } else {
          setFormError(res.message || "Failed to add attendee");
        }
      }
    } catch (err) {
      setFormError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkUsed = async (ticketId: string) => {
    setActionLoading(ticketId);
    try {
      const res = await markTicketUsed({ eventId: event.id, ticketId });
      if (res.success) {
        setTicketStatusMap(prev => ({ ...prev, [ticketId]: 'USED' }));
        showToast("Ticket marked as used", "success");
        router.refresh();
      } else {
        showToast(res.message || "Failed to update ticket", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveAttendee = async (ticketId: string, name: string) => {
    if (!confirm(`Remove ${name} from this event? This will delete their ticket.`)) return;
    setActionLoading(ticketId);
    try {
      const res = await removeAttendee({ eventId: event.id, ticketId });
      if (res.success) {
        showToast("Attendee removed", "success");
        router.refresh();
      } else {
        showToast(res.message || "Failed to remove attendee", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] font-sans text-steel-gray pt-16">

      {/* PAGE HEADER */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-[#f5dcbf]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3 mb-5">
            <Link
              href="/organizer/dashboard"
              className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-steel-gray hover:text-signal-orange transition-colors"
            >
              <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <span className="text-gray-200">·</span>
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 border ${isPublished ? 'border-signal-orange/30 bg-signal-orange/10 text-signal-orange' : 'border-gray-200 bg-gray-100 text-gray-400'}`}>
              {event.status}
            </span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-signal-orange mb-1.5">Managing Event</p>
              <h1 className="text-2xl font-extrabold tracking-tight text-charcoal-blue leading-snug">
                {event.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-steel-gray">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-signal-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {event.date}{event.time ? ` · ${event.time}` : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-signal-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href={`/organizer/event/${event.id}/edit`}
                className="px-5 py-2.5 border-2 border-soft-slate bg-white text-[12px] font-bold tracking-widest text-charcoal-blue hover:border-signal-orange hover:text-signal-orange transition"
              >
                Edit Event
              </Link>
              <Link
                href={`/event/${event.id}`}
                className="px-5 py-2.5 border-2 border-signal-orange bg-signal-orange text-[12px] font-bold tracking-widest text-white hover:bg-white hover:text-signal-orange transition"
              >
                View Public Page
              </Link>
            </div>
          </div>

          <nav className="flex gap-0 mt-8 border-b-2 border-soft-slate -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-1 mr-8 pb-3.5 text-xs font-bold tracking-widest uppercase border-b-2 transition-colors ${activeTab === tab ? 'border-signal-orange text-signal-orange' : 'border-transparent text-steel-gray hover:text-charcoal-blue'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Revenue */}
              <div className="bg-charcoal-blue relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`, backgroundSize: '20px 20px' }} />
                <div className="relative z-10 px-8 py-7">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-2">Total Revenue</p>
                  <p className="text-5xl font-black tracking-tight text-white">{formatCurrency(stats.revenue)}</p>
                  <div className="mt-3 h-0.5 w-10 bg-signal-orange" />
                  <p className="mt-2 text-[12px] text-white/40">Gross from ticket sales</p>
                </div>
              </div>

              {/* Tickets sold */}
              <div className="bg-white border-2 border-soft-slate relative overflow-hidden px-7 py-6">
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-signal-orange" />
                <p className="text-[11px] font-bold tracking-widest uppercase text-signal-orange mb-2">Tickets Sold</p>
                <p className="text-4xl font-black text-charcoal-blue">
                  {stats.sold}
                  <span className="text-lg font-medium text-gray-300 ml-1">/ {stats.capacity}</span>
                </p>
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-gray-100 overflow-hidden">
                    <div className={`h-full transition-all ${percentSold >= 90 ? 'bg-signal-orange' : 'bg-muted-teal'}`} style={{ width: `${percentSold}%` }} />
                  </div>
                  <p className="text-[11px] text-steel-gray mt-1">{percentSold}% capacity filled</p>
                </div>
              </div>

              {/* Days Until Event */}
              {(() => {
                const eventDate = new Date(event.rawDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                eventDate.setHours(0, 0, 0, 0);
                const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isEnded = diff < 0;
                const isToday = diff === 0;
                return (
                  <div className="bg-white border-2 border-soft-slate relative overflow-hidden px-7 py-6">
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isEnded ? 'bg-gray-200' : isToday ? 'bg-signal-orange' : 'bg-muted-teal'}`} />
                    <p className="text-[11px] font-bold tracking-widest uppercase text-steel-gray mb-2">
                      {isEnded ? 'Event Ended' : isToday ? 'Event Day' : 'Days Until Event'}
                    </p>
                    <p className={`text-4xl font-black ${isEnded ? 'text-gray-300' : isToday ? 'text-signal-orange' : 'text-charcoal-blue'}`}>
                      {isEnded ? '—' : isToday ? '🎉' : diff}
                    </p>
                    <p className="text-[11px] text-steel-gray mt-3">
                      {isEnded ? `Ended ${Math.abs(diff)} day${Math.abs(diff) !== 1 ? 's' : ''} ago` : isToday ? 'Happening today!' : `on ${event.date}`}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Chart + Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Sales chart */}
              <div className="lg:col-span-2 bg-white border-2 border-soft-slate">
                <div className="flex items-center justify-between px-7 py-5 border-b-2 border-soft-slate">
                  <h3 className="text-sm font-bold tracking-tight text-charcoal-blue">Ticket Sales by Month</h3>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-steel-gray">
                    {salesByMonth.reduce((s, m) => s + m.count, 0)} total
                  </span>
                </div>
                <div className="p-7">
                  {salesByMonth.length > 0 ? (
                    <>
                      <div className="h-52 flex items-end gap-1.5">
                        {salesByMonth.map((m, i) => {
                          const max = Math.max(...salesByMonth.map(x => x.count), 1);
                          const pct = Math.round((m.count / max) * 100);
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div
                                className="w-full bg-signal-orange/20 hover:bg-signal-orange transition-colors duration-200 cursor-pointer group relative"
                                style={{ height: `${Math.max(pct, m.count > 0 ? 4 : 0)}%` }}
                              >
                                {m.count > 0 && (
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-charcoal-blue opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {m.count}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-3 text-[10px] font-medium text-gray-300">
                        {salesByMonth.map((m, i) => <span key={i}>{m.label}</span>)}
                      </div>
                    </>
                  ) : (
                    <div className="h-52 flex items-center justify-center text-[13px] text-steel-gray">
                      No sales data yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Activity feed */}
              <div className="bg-white border-2 border-soft-slate">
                <div className="px-6 py-5 border-b-2 border-soft-slate">
                  <h3 className="text-sm font-bold tracking-tight text-charcoal-blue">Recent Activity</h3>
                </div>
                {recentActivity.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-3.5 px-6 py-4">
                        <div className={`mt-1.5 w-1.5 h-1.5 shrink-0 ${item.status === 'VALID' ? 'bg-muted-teal' : item.status === 'USED' ? 'bg-signal-orange' : 'bg-gray-300'}`} />
                        <div className="min-w-0">
                          <p className="text-[13px] text-charcoal-blue">
                            <span className="font-bold">{item.userName}</span>
                            {' '}<span className="text-steel-gray">
                              {item.status === 'USED' ? 'used their ticket' : item.status === 'CANCELLED' ? 'cancelled their ticket' : `registered · ${item.ticketType}`}
                            </span>
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{item.timeAgo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-10 text-center text-[13px] text-steel-gray">
                    No activity yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ATTENDEES TAB */}
        {activeTab === "Attendees" && (
          <div className="bg-white border-2 border-soft-slate">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b-2 border-soft-slate">
              <div className="relative max-w-sm w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search attendees..."
                  className="w-full pl-9 pr-4 py-2 border-2 border-soft-slate bg-off-white text-sm focus:border-signal-orange focus:outline-none transition"
                />
              </div>
              <div className="flex gap-2.5">
                <button className="inline-flex items-center gap-2 px-4 py-2 border-2 border-soft-slate bg-white text-[12px] font-bold tracking-widest text-steel-gray hover:border-signal-orange hover:text-signal-orange transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
                <button
                  onClick={() => {
                    setFormData({ email: '' });
                    setFormError(null);
                    setSubmitMessage(null);
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 border-2 border-charcoal-blue bg-charcoal-blue text-[12px] font-bold tracking-widest text-white hover:bg-white hover:text-charcoal-blue transition"
                >
                  + Add Attendee
                </button>
              </div>
            </div>

            {/* Summary bar */}
            <div className="flex items-center gap-6 px-6 py-3 bg-gray-50/60 border-b border-soft-slate/60">
              <span className="text-[11px] font-bold text-steel-gray">
                {optimisticAttendees.length} attendees
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-muted-teal" />
                <span className="text-[11px] text-steel-gray">
                  {optimisticAttendees.filter(a => a.status === 'Confirmed').length} confirmed
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-300" />
                <span className="text-[11px] text-steel-gray">
                  {optimisticAttendees.filter(a => a.status !== 'Confirmed').length} other
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-soft-slate bg-off-white">
                    {["Name", "Ticket Type", "Purchase Date", "Status", "QR", "Check-in", ""].map((h, i) => (
                      <th key={i} className="px-6 py-3.5 text-[10px] font-bold tracking-widest uppercase text-steel-gray">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {optimisticAttendees.length > 0 ? optimisticAttendees.map((attendee) => {
                    const isCheckedIn = checkInMap[attendee.id] ?? attendee.checkedIn;
                    const tStatus = ticketStatusMap[attendee.id] ?? 'VALID';
                    const isLoading = actionLoading === attendee.id;

                    return (
                      <tr key={attendee.id} className={`hover:bg-gray-50/60 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <td className="px-6 py-4">
                          <p className="text-[14px] font-semibold text-charcoal-blue">{attendee.name}</p>
                          <p className="text-[12px] text-steel-gray mt-0.5">{attendee.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-semibold text-steel-gray bg-gray-100 px-2.5 py-1">
                            {attendee.ticket}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-steel-gray">
                          {attendee.purchaseDate}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 ${
                            tStatus === 'USED'
                              ? 'bg-gray-100 text-gray-400'
                              : attendee.status === 'Confirmed'
                              ? 'bg-muted-teal/10 text-muted-teal'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 ${tStatus === 'USED' ? 'bg-gray-300' : attendee.status === 'Confirmed' ? 'bg-muted-teal' : 'bg-gray-300'}`} />
                            {tStatus === 'USED' ? 'Used' : attendee.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {attendee.qrValue ? (
                            <div className="inline-block bg-white p-1.5 border border-gray-200 rounded mx-auto">
                              <QRCodeSVG value={attendee.qrValue} size={60} level="M" />
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400">—</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {isCheckedIn || tStatus === 'USED' ? (
                            <span className="text-[12px] font-bold tracking-wider text-muted-teal">✓ Checked In</span>
                          ) : (
                            <button
                              onClick={() => setCheckInMap(prev => ({ ...prev, [attendee.id]: true }))}
                              className="text-[12px] font-bold tracking-wider text-signal-orange hover:text-charcoal-blue transition-colors"
                            >
                              Check In
                            </button>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <AttendeeActionsMenu
                            attendeeId={attendee.id}
                            ticketStatus={tStatus}
                            onMarkUsed={() => handleMarkUsed(attendee.id)}
                            onRemove={() => handleRemoveAttendee(attendee.id, attendee.name)}
                          />
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-steel-gray text-sm">
                        No attendees yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {optimisticAttendees.length > 5 && (
              <div className="flex items-center justify-between px-6 py-4 border-t-2 border-soft-slate bg-gray-50/40">
                <span className="text-[11px] font-bold tracking-wider text-steel-gray">
                  Showing {optimisticAttendees.length} attendees
                </span>
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center border-2 border-soft-slate text-[12px] font-bold text-steel-gray hover:border-charcoal-blue hover:text-charcoal-blue transition">‹</button>
                  <button className="w-8 h-8 flex items-center justify-center border-2 border-charcoal-blue bg-charcoal-blue text-[12px] font-bold text-white">1</button>
                  <button className="w-8 h-8 flex items-center justify-center border-2 border-soft-slate text-[12px] font-bold text-steel-gray hover:border-charcoal-blue hover:text-charcoal-blue transition">›</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MARKETING TAB */}
        {activeTab === "Marketing" && (
          <div className="space-y-4">
            {/* Shareable Link */}
            <div className="bg-white border-2 border-soft-slate">
              <div className="px-7 py-5 border-b-2 border-soft-slate">
                <p className="text-[11px] font-bold tracking-widest uppercase text-steel-gray mb-0.5">Shareable Link</p>
                <h3 className="text-base font-bold text-charcoal-blue">Share your event page</h3>
              </div>
              <div className="px-7 py-6">
                <p className="text-[13px] text-steel-gray mb-4">Copy and share this link anywhere — social media, email, or messages.</p>
                <ShareLinkBox eventId={event.id} />
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white border-2 border-soft-slate">
              <div className="px-7 py-5 border-b-2 border-soft-slate">
                <p className="text-[11px] font-bold tracking-widest uppercase text-steel-gray mb-0.5">QR Code</p>
                <h3 className="text-base font-bold text-charcoal-blue">Printable event QR code</h3>
              </div>
              <div className="px-7 py-6 flex flex-col sm:flex-row items-start gap-8">
                <div className="bg-white p-4 border-2 border-soft-slate inline-block shrink-0">
                  <QRCodeSVG
                    id="event-qr-code"
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/event/${event.id}`}
                    size={160}
                    level="M"
                  />
                </div>
                <div className="flex flex-col gap-3 justify-center">
                  <p className="text-[13px] text-steel-gray">Print or display this QR code at your venue, on flyers, or in presentations. Scanning it takes people directly to your event page.</p>
                  <button
                    onClick={() => {
                      const svg = document.getElementById('event-qr-code');
                      if (!svg) return;
                      const svgData = new XMLSerializer().serializeToString(svg);
                      const canvas = document.createElement('canvas');
                      canvas.width = 160; canvas.height = 160;
                      const ctx = canvas.getContext('2d');
                      const img = new Image();
                      img.onload = () => {
                        ctx?.drawImage(img, 0, 0);
                        const a = document.createElement('a');
                        a.download = `event-${event.id}-qr.png`;
                        a.href = canvas.toDataURL('image/png');
                        a.click();
                      };
                      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-charcoal-blue bg-charcoal-blue text-[12px] font-bold tracking-widest text-white hover:bg-white hover:text-charcoal-blue transition w-fit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "Settings" && (
          <div className="space-y-4">
            <div className="bg-white border-2 border-soft-slate p-7">
              <p className="text-[11px] font-bold tracking-widest uppercase text-steel-gray mb-1.5">Event Settings</p>
              <h3 className="text-base font-bold text-charcoal-blue mb-1">General</h3>
              <p className="text-[13px] text-steel-gray">
                Manage event details, visibility, and configuration from the{' '}
                <Link href={`/organizer/event/${event.id}/edit`} className="font-semibold text-signal-orange hover:underline underline-offset-2">
                  edit page
                </Link>.
              </p>
            </div>

            <InviteOrganizerPanel eventId={event.id} />

            <div className="bg-white border-2 border-red-200">
              <div className="px-7 py-4 border-b-2 border-red-100">
                <p className="text-[11px] font-bold tracking-widest uppercase text-red-400">Danger Zone</p>
              </div>
              <div className="px-7 py-6">
                <h4 className="text-sm font-bold text-charcoal-blue mb-1">Delete this Event</h4>
                <p className="text-[13px] text-steel-gray mb-5">
                  This will permanently remove the event and cancel all tickets. This action cannot be undone.
                </p>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
                      setIsDeleting(true);
                      try {
                        const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
                        if (res.ok) {
                          window.location.href = "/organizer/dashboard";
                        } else {
                          setIsDeleting(false);
                          alert("Failed to delete event");
                        }
                      } catch (e) {
                        console.error(e);
                        setIsDeleting(false);
                        alert("An error occurred");
                      }
                    }
                  }}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 border-2 border-red-500 bg-red-500 px-5 py-2.5 text-[12px] font-bold tracking-widest text-white hover:bg-white hover:text-red-500 transition disabled:opacity-50"
                >
                  {isDeleting ? "Deleted! Redirecting..." : "Delete Event"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-soft-slate">
            <div className="px-6 py-5 border-b-2 border-soft-slate bg-gray-50/60">
              <h3 className="text-lg font-bold tracking-tight text-charcoal-blue">
                Add Manual Attendee
              </h3>
              <p className="text-[13px] text-steel-gray mt-1">
                Create a complimentary ticket for this event.
              </p>
            </div>

            <form onSubmit={handleAddAttendee} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-charcoal-blue mb-1.5">
                  Email Address <span className="text-signal-orange">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 border-2 border-soft-slate rounded-lg focus:border-signal-orange focus:outline-none transition text-[14px]"
                />
              </div>

              {formError && (
                <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  {formError}
                </div>
              )}
              {submitMessage && (
                <div className="text-[13px] text-muted-teal bg-muted-teal/10 border border-muted-teal/30 rounded-lg px-4 py-2.5">
                  {submitMessage}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 border-2 border-soft-slate text-steel-gray text-[13px] font-bold tracking-wider hover:border-charcoal-blue hover:text-charcoal-blue transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-charcoal-blue text-white text-[13px] font-bold tracking-wider hover:bg-charcoal-blue/90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="30 60" />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add Attendee"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}