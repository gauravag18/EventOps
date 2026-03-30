import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import ContactOrganizerButton from "@/components/ContactOrganizerButton";

export default async function MessagesPage() {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) redirect("/login");

    const userId = session.user.id;

    // Queries where the user is the attendee
    const myQueries = await prisma.eventQuery.findMany({
        where: { userId },
        include: {
            event: { select: { id: true, title: true } },
            messages: {
                orderBy: { createdAt: 'asc' },
                include: { sender: { select: { name: true, id: true, image: true } } }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    // Queries where the user is an organizer
    const organizerQueries = await prisma.eventQuery.findMany({
        where: {
            event: { organizers: { some: { id: userId } } }
        },
        include: {
            event: { select: { id: true, title: true } },
            user: { select: { name: true, email: true } },
            messages: {
                orderBy: { createdAt: 'asc' },
                include: { sender: { select: { name: true, id: true, image: true } } }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">
            <div className="mx-auto max-w-5xl px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-muted-teal mb-2">Inbox</p>
                    <h1 className="text-4xl font-black text-charcoal-blue tracking-tight">Messages</h1>
                    <p className="text-steel-gray mt-2 text-sm">All your event queries and organizer responses in one place.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">

                    {/* ATTENDEE SIDE */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-6 w-1 bg-muted-teal" />
                            <h2 className="text-xs font-bold tracking-widest uppercase text-charcoal-blue">My Queries</h2>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-muted-teal/10 text-muted-teal">{myQueries.length}</span>
                        </div>

                        {myQueries.length === 0 ? (
                            <div className="border-2 border-soft-slate bg-white p-8 text-center">
                                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-sm text-steel-gray">You haven't messaged any organizers yet.</p>
                                <Link href="/events" className="mt-3 inline-block text-xs font-bold text-muted-teal hover:underline">Explore events →</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myQueries.map((q: any) => {
                                    const lastMsg = q.messages[q.messages.length - 1];
                                    const isOpen = q.status === 'OPEN';
                                    return (
                                        <div key={q.id} className="bg-white border-2 border-soft-slate shadow-[3px_3px_0px_0px_rgba(0,0,0,0.06)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all">
                                            <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-soft-slate bg-gray-50">
                                                <Link href={`/event/${q.event.id}`} className="font-bold text-sm text-charcoal-blue hover:text-muted-teal transition-colors truncate pr-4">
                                                    {q.event.title}
                                                </Link>
                                                <span className={`text-[9px] font-bold px-2 py-1 tracking-widest uppercase shrink-0 ${isOpen ? 'bg-signal-orange/10 text-signal-orange border border-signal-orange/30' : 'bg-muted-teal/10 text-muted-teal border border-muted-teal/30'}`}>
                                                    {isOpen ? 'Awaiting Reply' : 'Replied'}
                                                </span>
                                            </div>
                                            <div className="px-5 py-4">
                                                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                                    {q.messages.map((msg: any) => {
                                                        const isMine = msg.senderId === userId;
                                                        return (
                                                            <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                                                {!isMine && <span className="text-[9px] font-bold text-steel-gray uppercase tracking-wider mb-0.5 pl-1">{msg.sender.name || 'Organizer'}</span>}
                                                                <div className={`px-3 py-2 max-w-[85%] text-[13px] leading-relaxed ${isMine ? 'bg-muted-teal text-white' : 'bg-gray-100 text-charcoal-blue border border-gray-200'}`}>
                                                                    {msg.content}
                                                                </div>
                                                                <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-soft-slate">
                                                    <ContactOrganizerButton
                                                        eventId={q.event.id}
                                                        query={{ ...q, userId }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ORGANIZER SIDE */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-6 w-1 bg-signal-orange" />
                            <h2 className="text-xs font-bold tracking-widest uppercase text-charcoal-blue">Organizer Inbox</h2>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-signal-orange/10 text-signal-orange">{organizerQueries.length}</span>
                        </div>

                        {organizerQueries.length === 0 ? (
                            <div className="border-2 border-soft-slate bg-white p-8 text-center">
                                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-sm text-steel-gray">No messages from attendees yet.</p>
                                <Link href="/organizer/dashboard" className="mt-3 inline-block text-xs font-bold text-signal-orange hover:underline">Go to dashboard →</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {organizerQueries.map((q: any) => {
                                    const isOpen = q.status === 'OPEN';
                                    return (
                                        <div key={q.id} className="bg-white border-2 border-soft-slate shadow-[3px_3px_0px_0px_rgba(0,0,0,0.06)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all">
                                            <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-soft-slate bg-gray-50">
                                                <div className="min-w-0">
                                                    <Link href={`/organizer/event/${q.event.id}`} className="font-bold text-sm text-charcoal-blue hover:text-signal-orange transition-colors block truncate pr-4">
                                                        {q.event.title}
                                                    </Link>
                                                    <p className="text-[10px] text-steel-gray mt-0.5">From: {q.user.name || q.user.email}</p>
                                                </div>
                                                <span className={`text-[9px] font-bold px-2 py-1 tracking-widest uppercase shrink-0 ml-2 ${isOpen ? 'bg-signal-orange/10 text-signal-orange border border-signal-orange/30' : 'bg-gray-100 text-steel-gray border border-gray-200'}`}>
                                                    {isOpen ? 'Action Needed' : 'Replied'}
                                                </span>
                                            </div>
                                            <div className="px-5 py-4">
                                                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                                    {q.messages.map((msg: any) => {
                                                        const isOrganizerMsg = msg.senderId !== q.userId;
                                                        return (
                                                            <div key={msg.id} className={`flex flex-col ${isOrganizerMsg ? 'items-end' : 'items-start'}`}>
                                                                <div className={`px-3 py-2 max-w-[85%] text-[13px] leading-relaxed ${isOrganizerMsg ? 'bg-signal-orange text-white' : 'bg-gray-100 text-charcoal-blue border border-gray-200'}`}>
                                                                    {msg.content}
                                                                </div>
                                                                <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {isOpen && (
                                                    <div className="mt-4 pt-4 border-t border-soft-slate">
                                                        <Link href={`/organizer/event/${q.event.id}?tab=Queries`} className="inline-flex items-center gap-1.5 text-xs font-bold text-signal-orange hover:text-charcoal-blue transition-colors">
                                                            Reply in Event Dashboard →
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
