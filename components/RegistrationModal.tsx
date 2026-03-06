'use client';

import { useSession } from "next-auth/react";
import { useState, useOptimistic, startTransition } from "react";
import { useRouter } from "next/navigation";
import { registerForEvent, RegistrationMeta } from "@/app/actions/event";

interface RegistrationModalProps {
    eventId: string;
    isFull: boolean;
    isRegistered: boolean;
    eventCategory: string;
    eventTitle: string;
    isFree: boolean;
    price?: string | null;
}

// Which formats need extra registration fields
const FORMAT_FIELDS: Record<string, string[]> = {
    Hackathon: ['teamName', 'teamMembers', 'soloEntry'],
    Competition: ['teamName', 'teamMembers', 'soloEntry'],
    Workshop: ['experienceLevel', 'expectations', 'dietaryRestrictions'],
    Bootcamp: ['experienceLevel', 'expectations', 'dietaryRestrictions'],
    Webinar: ['timezone', 'notifyOnRecording'],
    Conference: ['dietaryRestrictions', 'specialRequirements'],
    Meetup: ['heardAboutUs'],
    Expo: ['heardAboutUs', 'specialRequirements'],
};

const TIMEZONES = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
    'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Kolkata',
    'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
];

export default function RegistrationModal({
    eventId, isFull, isRegistered, eventCategory, eventTitle, isFree, price
}: RegistrationModalProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form');

    const [meta, setMeta] = useState<RegistrationMeta>({
        soloEntry: false,
        notifyOnRecording: true,
        experienceLevel: '',
        teamName: '',
        teamMembers: '',
        expectations: '',
        dietaryRestrictions: '',
        timezone: 'UTC',
        heardAboutUs: '',
        specialRequirements: '',
    });

    const [optRegistered, addOptRegistered] = useOptimistic(
        isRegistered,
        (_: boolean, next: boolean) => next
    );

    const fields = FORMAT_FIELDS[eventCategory] ?? [];
    const hasFields = fields.length > 0;

    const setField = (key: keyof RegistrationMeta, value: string | boolean) =>
        setMeta(prev => ({ ...prev, [key]: value }));

    const handleOpen = () => {
        if (!session) {
            router.push(`/login?error=${encodeURIComponent("You must be logged in to register for an event.")}`);
            return;
        }
        setStep(hasFields ? 'form' : 'confirm');
        setOpen(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        startTransition(() => addOptRegistered(true));
        try {
            const res = await registerForEvent(eventId, meta);
            if (res.success) {
                setStep('done');
                router.refresh();
            } else {
                alert(res.message);
                setOpen(false);
            }
        } catch {
            alert("An error occurred. Please try again.");
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    // --- Registered / Full static states ---
    if (optRegistered) {
        return (
            <button disabled className="w-full border-2 border-gray-300 bg-gray-100 px-8 py-4 text-sm font-bold tracking-widest text-gray-500 cursor-not-allowed opacity-75 transition-all">
                ✓ Already Registered
            </button>
        );
    }
    if (isFull) {
        return (
            <button disabled className="w-full border-2 border-gray-300 bg-gray-100 px-8 py-4 text-sm font-bold tracking-widest text-gray-500 cursor-not-allowed opacity-75">
                Sold Out
            </button>
        );
    }

    return (
        <>
            {/* Trigger */}
            <button
                onClick={handleOpen}
                className="w-full border-2 border-muted-teal bg-muted-teal px-8 py-4 text-sm font-bold tracking-widest text-white transition hover:bg-white hover:text-muted-teal"
            >
                Register Now
            </button>

            {/* Modal Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-charcoal-blue/60 backdrop-blur-sm"
                        onClick={() => !loading && setOpen(false)}
                    />

                    {/* Panel */}
                    <div className="relative z-10 w-full max-w-lg bg-white shadow-2xl border-2 border-charcoal-blue mx-4 mb-0 sm:mb-4 animate-in slide-in-from-bottom-4 duration-300">

                        {/* Top accent */}
                        <div className="h-[4px] bg-muted-teal w-full" />

                        {/* Header */}
                        <div className="flex items-start justify-between px-7 py-5 border-b-2 border-soft-slate">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-teal">{eventCategory}</span>
                                <h2 className="text-lg font-bold text-charcoal-blue mt-0.5 leading-tight">{step === 'done' ? "You're in! 🎉" : "Complete Registration"}</h2>
                                <p className="text-xs text-steel-gray mt-1 truncate max-w-[280px]">{eventTitle}</p>
                            </div>
                            <button onClick={() => !loading && setOpen(false)} className="text-steel-gray hover:text-charcoal-blue transition-colors ml-4 p-1 shrink-0">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* --- DONE STATE --- */}
                        {step === 'done' && (
                            <div className="px-7 py-10 text-center">
                                <div className="w-16 h-16 bg-muted-teal/10 border-2 border-muted-teal flex items-center justify-center mx-auto mb-5">
                                    <svg className="h-8 w-8 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-charcoal-blue font-bold text-lg">Registration confirmed!</p>
                                <p className="text-steel-gray text-sm mt-2">Check your dashboard for your ticket.</p>
                                <button onClick={() => { setOpen(false); router.push('/attendee/dashboard'); }}
                                    className="mt-6 w-full bg-muted-teal border-2 border-muted-teal text-white font-bold tracking-widest py-3 text-sm hover:bg-white hover:text-muted-teal transition-all">
                                    View My Ticket
                                </button>
                            </div>
                        )}

                        {/* --- CONFIRM STATE (no extra fields) --- */}
                        {step === 'confirm' && (
                            <div className="px-7 py-6 space-y-5">
                                <div className="bg-soft-slate/30 border-2 border-soft-slate p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-charcoal-blue">Format</span>
                                        <span className="text-steel-gray font-medium">{eventCategory}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-t border-soft-slate pt-2">
                                        <span className="font-bold text-charcoal-blue">Price</span>
                                        <span className="font-black text-charcoal-blue">{isFree ? 'Free' : `$${price}`}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-steel-gray leading-relaxed">By registering, you agree to the event's policies and code of conduct.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setOpen(false)} className="flex-1 border-2 border-soft-slate py-3 text-sm font-bold text-steel-gray hover:border-charcoal-blue hover:text-charcoal-blue transition-all">
                                        Cancel
                                    </button>
                                    <button onClick={handleSubmit} disabled={loading}
                                        className="flex-1 bg-muted-teal border-2 border-muted-teal text-white py-3 text-sm font-bold tracking-wider hover:bg-white hover:text-muted-teal transition-all disabled:opacity-50">
                                        {loading ? 'Confirming...' : 'Confirm →'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- FORM STATE (format-specific fields) --- */}
                        {step === 'form' && (
                            <div className="px-7 py-6 space-y-5 max-h-[70vh] overflow-y-auto">

                                {/* Hackathon / Competition */}
                                {fields.includes('teamName') && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-bold uppercase tracking-widest text-signal-orange bg-signal-orange/10 px-2.5 py-1">Team Info</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-soft-slate/30 border-2 border-soft-slate">
                                            <div>
                                                <span className="text-sm font-bold text-charcoal-blue">Solo Participant</span>
                                                <p className="text-xs text-steel-gray">I'm entering alone, not as a team</p>
                                            </div>
                                            <div onClick={() => setField('soloEntry', !meta.soloEntry)}
                                                className={`w-12 h-7 flex items-center p-1 cursor-pointer border-2 transition-colors ${meta.soloEntry ? 'bg-signal-orange border-signal-orange' : 'bg-white border-soft-slate'}`}>
                                                <div className={`w-4 h-4 transition-transform ${meta.soloEntry ? 'translate-x-5 bg-white' : 'translate-x-0 bg-charcoal-blue'}`} />
                                            </div>
                                        </div>
                                        {!meta.soloEntry && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div>
                                                    <label className="block text-xs font-bold text-charcoal-blue tracking-wider mb-1.5">Team Name <span className="text-signal-orange">*</span></label>
                                                    <input type="text" value={meta.teamName || ''} onChange={e => setField('teamName', e.target.value)}
                                                        placeholder="e.g. Code Wizards" className="w-full px-4 py-3 border-2 border-soft-slate focus:border-charcoal-blue focus:ring-0 outline-none bg-white text-charcoal-blue text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-charcoal-blue tracking-wider mb-1.5">Team Members</label>
                                                    <textarea rows={3} value={meta.teamMembers || ''} onChange={e => setField('teamMembers', e.target.value)}
                                                        placeholder="List your team members' names or emails (comma separated)"
                                                        className="w-full px-4 py-3 border-2 border-soft-slate focus:border-charcoal-blue focus:ring-0 outline-none resize-none bg-white text-charcoal-blue text-sm placeholder:text-steel-gray/50" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Workshop / Bootcamp */}
                                {fields.includes('experienceLevel') && (
                                    <div className="space-y-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-signal-orange bg-signal-orange/10 px-2.5 py-1 inline-block">Skill & Preferences</span>
                                        <div>
                                            <label className="block text-xs font-bold text-charcoal-blue tracking-wider mb-2">Your Experience Level</label>
                                            <div className="flex gap-2">
                                                {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                                                    <button key={level} type="button" onClick={() => setField('experienceLevel', level)}
                                                        className={`flex-1 py-2.5 text-xs font-bold border-2 tracking-wide transition-all ${meta.experienceLevel === level ? 'bg-charcoal-blue border-charcoal-blue text-white' : 'border-soft-slate text-steel-gray hover:border-charcoal-blue'}`}>
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-charcoal-blue tracking-wider mb-1.5">What do you hope to learn?</label>
                                            <textarea rows={2} value={meta.expectations || ''} onChange={e => setField('expectations', e.target.value)}
                                                placeholder="Share your goals or what you're hoping to get out of this..."
                                                className="w-full px-4 py-3 border-2 border-soft-slate focus:border-charcoal-blue focus:ring-0 outline-none resize-none bg-white text-charcoal-blue text-sm placeholder:text-steel-gray/50" />
                                        </div>
                                    </div>
                                )}

                                {/* Webinar */}
                                {fields.includes('timezone') && (
                                    <div className="space-y-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-signal-orange bg-signal-orange/10 px-2.5 py-1 inline-block">Webinar Preferences</span>
                                        <div>
                                            <label className="block text-xs font-bold text-charcoal-blue tracking-wider mb-1.5">Your Timezone</label>
                                            <select value={meta.timezone || 'UTC'} onChange={e => setField('timezone', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-soft-slate focus:border-charcoal-blue focus:ring-0 outline-none bg-white text-charcoal-blue text-sm">
                                                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-soft-slate/30 border-2 border-soft-slate">
                                            <div>
                                                <span className="text-sm font-bold text-charcoal-blue">Notify when recording is available</span>
                                                <p className="text-xs text-steel-gray">Get an email when the recording is posted</p>
                                            </div>
                                            <div onClick={() => setField('notifyOnRecording', !meta.notifyOnRecording)}
                                                className={`w-12 h-7 flex items-center p-1 cursor-pointer border-2 transition-colors ${meta.notifyOnRecording ? 'bg-signal-orange border-signal-orange' : 'bg-white border-soft-slate'}`}>
                                                <div className={`w-4 h-4 transition-transform ${meta.notifyOnRecording ? 'translate-x-5 bg-white' : 'translate-x-0 bg-charcoal-blue'}`} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Dietary (Conference, Workshop, Bootcamp) */}
                                {fields.includes('dietaryRestrictions') && (
                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-blue tracking-wider mb-1.5">Dietary Restrictions / Allergies</label>
                                        <input type="text" value={meta.dietaryRestrictions || ''} onChange={e => setField('dietaryRestrictions', e.target.value)}
                                            placeholder="e.g. Vegetarian, Nut allergy — leave blank if none"
                                            className="w-full px-4 py-3 border-2 border-soft-slate focus:border-charcoal-blue focus:ring-0 outline-none bg-white text-charcoal-blue text-sm placeholder:text-steel-gray/50" />
                                    </div>
                                )}

                                {/* Heard about us (Meetup, Expo) */}
                                {fields.includes('heardAboutUs') && (
                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-blue tracking-wider mb-1.5">How did you hear about this event?</label>
                                        <select value={meta.heardAboutUs || ''} onChange={e => setField('heardAboutUs', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-soft-slate focus:border-charcoal-blue focus:ring-0 outline-none bg-white text-charcoal-blue text-sm">
                                            <option value="">Select one...</option>
                                            <option value="social">Social media</option>
                                            <option value="friend">Friend or colleague</option>
                                            <option value="email">Email newsletter</option>
                                            <option value="search">Search engine</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                )}

                                {/* Special requirements (Conference, Expo) */}
                                {fields.includes('specialRequirements') && (
                                    <div>
                                        <label className="block text-xs font-bold text-charcoal-blue tracking-wider mb-1.5">Special Requirements</label>
                                        <textarea rows={2} value={meta.specialRequirements || ''} onChange={e => setField('specialRequirements', e.target.value)}
                                            placeholder="Accessibility needs, special seating, etc."
                                            className="w-full px-4 py-3 border-2 border-soft-slate focus:border-charcoal-blue focus:ring-0 outline-none resize-none bg-white text-charcoal-blue text-sm placeholder:text-steel-gray/50" />
                                    </div>
                                )}

                                {/* Summary row */}
                                <div className="bg-soft-slate/30 border-2 border-soft-slate p-3 flex justify-between text-sm">
                                    <span className="font-bold text-charcoal-blue">Registration fee</span>
                                    <span className="font-black text-charcoal-blue">{isFree ? 'Free' : `$${price}`}</span>
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button onClick={() => setOpen(false)} className="flex-1 border-2 border-soft-slate py-3 text-sm font-bold text-steel-gray hover:border-charcoal-blue hover:text-charcoal-blue transition-all">
                                        Cancel
                                    </button>
                                    <button onClick={handleSubmit} disabled={loading}
                                        className="flex-1 bg-muted-teal border-2 border-muted-teal text-white py-3 text-sm font-bold tracking-wider hover:bg-white hover:text-muted-teal transition-all disabled:opacity-50">
                                        {loading ? 'Confirming...' : 'Confirm Registration →'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
