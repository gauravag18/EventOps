"use client";
import React, { useState } from 'react';
import { replyToUserQuery } from '@/app/actions/query';
import { useRouter } from 'next/navigation';
import { SharpSpinner } from './Loaders';

export default function OrganizerQueriesPanel({ queries }: { queries: any[] }) {
    const [activeQueryId, setActiveQueryId] = useState<string | null>(queries[0]?.id || null);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const activeQuery = queries.find(q => q.id === activeQueryId);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() || !activeQueryId) return;

        setIsSubmitting(true);
        const res = await replyToUserQuery(activeQueryId, replyContent);
        if (res.success) {
            setReplyContent('');
            router.refresh();
        } else {
            alert(res.message);
        }
        setIsSubmitting(false);
    };

    if (queries.length === 0) {
        return (
            <div className="bg-white border-2 border-soft-slate p-10 text-center text-steel-gray">
                No support queries or messages yet.
            </div>
        );
    }

    return (
        <div className="flex bg-white border-2 border-soft-slate h-[600px] overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 border-r-2 border-soft-slate overflow-y-auto bg-gray-50 flex flex-col">
                <div className="p-4 border-b-2 border-soft-slate bg-off-white font-bold text-[11px] tracking-widest uppercase text-charcoal-blue">
                    Inbox ({queries.filter(q => q.status === 'OPEN').length} pending)
                </div>
                {queries.map(q => (
                    <button
                        key={q.id}
                        onClick={() => setActiveQueryId(q.id)}
                        className={`text-left p-4 border-b border-soft-slate hover:bg-white transition-colors flex flex-col gap-1.5 ${activeQueryId === q.id ? 'bg-white border-l-4 border-l-signal-orange' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-sm text-charcoal-blue truncate pr-2">{q.user.name || q.user.email}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase shrink-0 ${q.status === 'OPEN' ? 'bg-signal-orange/10 text-signal-orange' : 'bg-muted-teal/10 text-muted-teal'}`}>
                                {q.status === 'OPEN' ? 'Action Needed' : 'Replied'}
                            </span>
                        </div>
                        <span className="text-xs text-steel-gray truncate w-full">{q.messages[q.messages.length - 1]?.content}</span>
                        <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(q.updatedAt).toLocaleDateString()}
                        </span>
                    </button>
                ))}
            </div>

            {/* Chat Area */}
            {activeQuery ? (
                <div className="w-2/3 flex flex-col bg-white">
                    <div className="p-5 border-b-2 border-soft-slate bg-off-white shrink-0 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-charcoal-blue">{activeQuery.user.name || 'Attendee'}</h3>
                            <p className="text-[11px] text-steel-gray">{activeQuery.user.email}</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {activeQuery.messages.map((msg: any) => {
                            const isOrganizer = msg.senderId !== activeQuery.userId;
                            return (
                                <div key={msg.id} className={`flex flex-col max-w-[85%] ${isOrganizer ? 'self-end items-end' : 'self-start items-start'}`}>
                                    <div className={`px-4 py-2.5 rounded-2xl ${isOrganizer ? 'bg-signal-orange text-white rounded-br-none' : 'bg-white border-2 border-soft-slate text-charcoal-blue rounded-bl-none'}`}>
                                        <p className="text-[14px] leading-relaxed break-words">{msg.content}</p>
                                    </div>
                                    <span className={`text-[10px] text-gray-400 mt-1 ${isOrganizer ? 'pr-1' : 'pl-1'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-4 border-t-2 border-soft-slate bg-white">
                        <form onSubmit={handleReply} className="flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Type a reply..."
                                className="flex-1 px-4 py-3 border-2 border-soft-slate text-sm focus:border-signal-orange focus:outline-none transition rounded-lg"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!replyContent.trim() || isSubmitting}
                                className="px-5 py-3 bg-signal-orange text-white font-bold tracking-widest text-[12px] uppercase rounded-lg hover:bg-charcoal-blue transition-colors disabled:opacity-50 shrink-0 flex items-center justify-center min-w-[90px]"
                            >
                                {isSubmitting ? <SharpSpinner className="w-4 h-4" /> : "Reply"}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="w-2/3 flex items-center justify-center bg-gray-50 text-steel-gray text-sm">
                    Select a conversation to reply
                </div>
            )}
        </div>
    );
}
