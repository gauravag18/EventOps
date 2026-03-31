import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SettingsPage() {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) {
        redirect(`/login?error=${encodeURIComponent("You must be logged in to view settings.")}`);
    }
    const user = session.user;

    const settingsSections = [
        {
            label: "Notifications",
            color: "muted-teal",
            items: [
                { title: "Email reminders for upcoming events", desc: "Get notified 24h before an event you registered for.", enabled: true },
                { title: "New event recommendations", desc: "Weekly digest of events matching your interests.", enabled: false },
                { title: "Message reply alerts", desc: "Get notified when an organizer replies to your query.", enabled: true },
            ]
        },
        {
            label: "Privacy",
            color: "steel-gray",
            items: [
                { title: "Show profile to other attendees", desc: "Other registered attendees can see your name on shared events.", enabled: false },
                { title: "Allow event recommendations", desc: "We use your ticket history to suggest relevant events.", enabled: true },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#E8F8F5] font-sans text-steel-gray pt-16 transition-colors duration-500">
            <main className="mx-auto max-w-[1880px] px-6 md:px-10 py-16">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-0.5 w-8 bg-charcoal-blue" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-charcoal-blue/60 uppercase">Config</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-charcoal-blue">Settings</h1>
                    <p className="mt-3 text-lg text-steel-gray">Manage your account preferences.</p>
                </div>

                {/* Account Section */}
                <div className="bg-white border-2 border-gray-200 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-charcoal-blue" />
                    <div className="px-6 py-4 border-b-2 border-gray-100 bg-gray-50 mt-[3px] flex items-center gap-2">
                        <div className="h-4 w-1 bg-charcoal-blue" />
                        <h2 className="text-xs font-black tracking-widest uppercase text-charcoal-blue">Account</h2>
                    </div>
                    <div className="px-6 py-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center shrink-0">
                                {user.image ? (
                                    <img src={user.image} alt={user.name || ""} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-xl font-black text-charcoal-blue">{user.name?.[0] || "U"}</span>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-charcoal-blue">{user.name || "No name set"}</p>
                                <p className="text-sm text-steel-gray">{user.email}</p>
                            </div>
                        </div>
                        <Link
                            href="/profile"
                            className="shrink-0 inline-flex items-center gap-1.5 border-2 border-gray-200 px-4 py-2 text-xs font-bold text-steel-gray hover:border-charcoal-blue hover:text-charcoal-blue transition-all"
                        >
                            Edit Profile
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Dynamic Sections */}
                {settingsSections.map((section) => (
                    <div key={section.label} className="bg-white border-2 border-gray-200 mb-6 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-${section.color}`} />
                        <div className="px-6 py-4 border-b-2 border-gray-100 bg-gray-50 mt-[3px] flex items-center gap-2">
                            <div className={`h-4 w-1 bg-${section.color}`} />
                            <h2 className="text-xs font-black tracking-widest uppercase text-charcoal-blue">{section.label}</h2>
                            <span className="ml-2 text-[10px] font-bold text-steel-gray bg-gray-100 px-2 py-0.5">Coming Soon</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-4 gap-4">
                                    <div>
                                        <p className="font-semibold text-sm text-charcoal-blue">{item.title}</p>
                                        <p className="text-xs text-steel-gray mt-0.5">{item.desc}</p>
                                    </div>
                                    {/* Visual toggle — cosmetic only */}
                                    <div className={`relative shrink-0 w-10 h-5 rounded-full transition-colors ${item.enabled ? 'bg-muted-teal' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${item.enabled ? 'left-5' : 'left-0.5'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Danger Zone */}
                <div className="bg-white border-2 border-red-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-400" />
                    <div className="px-6 py-4 border-b-2 border-red-100 bg-red-50 mt-[3px] flex items-center gap-2">
                        <div className="h-4 w-1 bg-red-400" />
                        <h2 className="text-xs font-black tracking-widest uppercase text-red-600">Danger Zone</h2>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-sm text-charcoal-blue">Delete Account</p>
                            <p className="text-xs text-steel-gray mt-0.5">Permanently removes your account, tickets, and all data.</p>
                        </div>
                        <button
                            disabled
                            className="shrink-0 px-4 py-2 text-xs font-bold border-2 border-red-300 text-red-400 cursor-not-allowed opacity-60"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
