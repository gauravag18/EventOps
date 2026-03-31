"use client";
import React, { useState, useOptimistic, startTransition } from 'react';
import { sendMessageToOrganizer } from '@/app/actions/query';
import { useRouter } from 'next/navigation';
import { SharpSpinner } from './Loaders';
import { useToast } from './ToastProvider';

export default function ContactOrganizerButton({ eventId, query }: { eventId: string, query: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { showToast } = useToast();

    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        query?.messages || [],
        (state: any[], newMessage: string) => [
            ...state,
            {
                id: Math.random().toString(),
                content: newMessage,
                createdAt: new Date().toISOString(),
                senderId: query?.userId || 'optimistic',
                isOptimistic: true
            }
        ]
    );

    const isLocked = query?.status === 'OPEN' || optimisticMessages.some((m: any) => m.isOptimistic);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const messageContent = content.trim();
        if (!messageContent) return;

        setContent('');
        startTransition(() => {
            addOptimisticMessage(messageContent);
        });

        setIsSubmitting(true);
        const res = await sendMessageToOrganizer(eventId, messageContent);
        if (res.success) {
            showToast("Message sent!", "success");
            router.refresh();
        } else {
            setError(res.message || 'Failed to send message');
            setContent(messageContent);
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="mt-1.5 block text-sm font-semibold text-muted-teal hover:text-charcoal-blue transition-colors"
            >
                Contact
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div 
                        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b-2 border-soft-slate">
                            <h2 className="text-xl font-bold text-charcoal-blue">Message Organizer</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-charcoal-blue">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 flex flex-col">
                            {optimisticMessages.map((msg: any) => {
                                const isUser = msg.isOptimistic || (query?.userId && msg.senderId === query.userId) || msg.senderId === 'optimistic';
                                return (
                                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
                                        {!isUser && <span className="text-[10px] font-bold text-steel-gray mb-1 uppercase tracking-wider pl-1">{msg.sender.name || 'Organizer'}</span>}
                                        <div className={`px-4 py-2.5 rounded-2xl ${isUser ? (msg.isOptimistic ? 'bg-muted-teal/70 text-white rounded-br-none' : 'bg-muted-teal text-white rounded-br-none') : 'bg-white border-2 border-soft-slate text-charcoal-blue rounded-bl-none'}`}>
                                            <p className="text-[14px] leading-relaxed break-words">{msg.content}</p>
                                        </div>
                                        <span className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'pr-1' : 'pl-1'}`}>
                                            {msg.isOptimistic ? (
                                                <span className="flex items-center justify-end gap-1 font-medium tracking-wider text-muted-teal">
                                                    <SharpSpinner className="h-3 w-3" /> 
                                                    Sending...
                                                </span>
                                            ) : isUser ? (
                                                <span className="flex items-center justify-end gap-1 font-medium">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    <svg className="w-3 h-3 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Delivered
                                                </span>
                                            ) : (
                                                new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            )}
                                        </span>
                                    </div>
                                )
                            })}
                            {!optimisticMessages.length && (
                                <div className="text-center text-sm text-steel-gray py-10 flex flex-col items-center">
                                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Have a question? Send a message to the event organizer!
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white border-t-2 border-soft-slate">
                            {isLocked ? (
                                <div className="text-center p-3 bg-gray-50 border border-gray-200 text-[13px] text-steel-gray">
                                    <span className="font-bold text-signal-orange">Waiting for reply.</span> You can't send another message until the organizer responds.
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-3 p-2.5 bg-signal-orange/10 border border-signal-orange/30 text-[11px] flex items-start gap-2">
                                        <svg className="w-4 h-4 shrink-0 mt-0.5 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="font-medium text-charcoal-blue leading-relaxed text-left">
                                            <span className="font-bold text-signal-orange">Note:</span> Please ask everything in one message. You won't be able to send another until the organizer replies.
                                        </p>
                                    </div>
                                    <form onSubmit={handleSend} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 border-2 border-soft-slate text-sm focus:border-muted-teal focus:outline-none transition rounded-lg"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!content.trim() || isSubmitting}
                                        className="px-5 py-3 bg-muted-teal text-white font-bold tracking-widest text-[12px] uppercase rounded-lg hover:bg-charcoal-blue transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                                    >
                                        {isSubmitting ? <SharpSpinner className="w-4 h-4" /> : "Send"}
                                    </button>
                                    </form>
                                </div>
                            )}
                            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
