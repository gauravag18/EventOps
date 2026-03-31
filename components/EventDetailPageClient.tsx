"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import RegistrationModal from './RegistrationModal';
import ContactOrganizerButton from './ContactOrganizerButton';
import TeamCodeDisplay from './TeamCodeDisplay';

interface Props {
    eventId: string;
    isFull: boolean;
    eventCategory: string;
    eventTitle: string;
    isFree: boolean;
    price: string;
    teamSizeMax: number | null;
    allowSolo: boolean;
    initialUserState?: {
        isRegistered: boolean;
        userTeam: any;
        userQuery: any;
    };
}

export default function EventDetailPageClient({
    eventId, isFull, eventCategory, eventTitle, isFree, price, teamSizeMax, allowSolo, initialUserState
}: Props) {
    const { data: session, status } = useSession();
    const [isRegistered, setIsRegistered] = useState(initialUserState?.isRegistered ?? false);
    const [userTeam, setUserTeam] = useState<any>(initialUserState?.userTeam ?? null);
    const [userQuery, setUserQuery] = useState<any>(initialUserState?.userQuery ?? null);
    const [loading, setLoading] = useState(!initialUserState);

    useEffect(() => {
        // Only fetch if we don't have initial state from the server
        if (!initialUserState && status === 'authenticated' && session?.user?.id) {
            async function fetchUserState() {
                try {
                    const res = await fetch(`/api/event/${eventId}/user-state`);
                    if (res.ok) {
                        const data = await res.json();
                        setIsRegistered(data.isRegistered);
                        setUserTeam(data.userTeam);
                        setUserQuery(data.userQuery);
                    }
                } catch (e) {
                    console.error("Error fetching user state:", e);
                } finally {
                    setLoading(false);
                }
            }
            fetchUserState();
        } else if (status === 'unauthenticated' || initialUserState) {
            setLoading(false);
        }
    }, [status, eventId, session?.user?.id, initialUserState]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-14 w-full bg-gray-100 animate-pulse border-2 border-gray-100" />
                <div className="h-10 w-32 bg-gray-50 animate-pulse border border-gray-100" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Action Section */}
            <div className="space-y-4">
                <RegistrationModal
                    eventId={eventId}
                    isFull={isFull}
                    isRegistered={isRegistered}
                    hasTeam={!!userTeam}
                    eventCategory={eventCategory}
                    eventTitle={eventTitle}
                    isFree={isFree}
                    price={price}
                    teamSizeMax={teamSizeMax}
                    allowSolo={allowSolo}
                />

                {status === 'authenticated' && (
                    <div className="pt-2">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-[#8896AD] mb-3">Communication</p>
                        <ContactOrganizerButton eventId={eventId} query={userQuery} />
                    </div>
                )}
            </div>

            {/* Team DashboardSurfaces immediately if registered */}
            {userTeam && (
                <div className="border-2 border-charcoal-blue bg-charcoal-blue relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] mt-8">
                    <div className="absolute top-0 left-0 right-0 h-0.75 bg-signal-orange" />
                    <div className="px-5 py-3.5 border-b-2 border-white/10 flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/70">Your Team</h4>
                        <span className="text-[10px] font-bold text-signal-orange bg-signal-orange/10 px-2 py-0.5 border border-signal-orange/30 uppercase tracking-wider">
                            {userTeam.members.length}{teamSizeMax ? `/${teamSizeMax}` : ''} Members
                        </span>
                    </div>
                    <div className="px-5 py-4 space-y-4">
                        <div>
                            <p className="text-[11px] text-white/50 mb-0.5 uppercase tracking-widest font-bold">Team Name</p>
                            <p className="text-xl font-black text-white italic">{userTeam.name}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            {userTeam.members.map((m: any) => (
                                <div key={m.user.id} className={`flex items-center gap-2 text-xs px-3 py-2 border ${m.user.id === userTeam.leaderId ? 'border-signal-orange/30 bg-signal-orange/10 text-white' : 'border-white/10 bg-white/5 text-white/60'}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${m.user.id === userTeam.leaderId ? 'bg-signal-orange' : 'bg-muted-teal'}`} />
                                    <span className="truncate font-medium">{m.user.name || 'User'}</span>
                                    {m.user.id === userTeam.leaderId && <span className="text-[8px] font-bold text-signal-orange ml-auto">LEADER</span>}
                                </div>
                            ))}
                        </div>

                        {session?.user?.id === userTeam.leaderId && (
                            <div className="bg-white/5 border-2 border-white/10 px-4 py-4 mt-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Team Invite Code</p>
                                <TeamCodeDisplay code={userTeam.code} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {status === 'unauthenticated' && (
                <div className="p-6 bg-muted-teal/5 border-2 border-dashed border-muted-teal/20 text-center">
                    <p className="text-xs font-bold text-muted-teal uppercase tracking-widest mb-3">Sign in Required</p>
                    <p className="text-sm text-[#64748B] mb-4">You need to be logged in to register for events or message organizers.</p>
                    <a href="/login" className="inline-block px-6 py-2 bg-muted-teal text-white text-xs font-bold uppercase tracking-widest hover:bg-muted-teal/80 transition-colors">
                        Log In Now
                    </a>
                </div>
            )}
        </div>
    );
}
