"use client";

// Base pulse shimmer for all skeleton elements
// Sharp geometry — no rounded corners, bold shadows, matching the app's comic/editorial feel

export function SkeletonBox({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div
            style={style}
            className={`relative overflow-hidden bg-gray-100 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent before:animate-[shimmer_1.4s_infinite] ${className}`}
        />
    );
}

export function SkeletonText({ className = "", width = "100%" }: { className?: string; width?: string }) {
    return <SkeletonBox className={`h-4 ${className}`} style={{ width }} />;
}

// A full-page sharp skeleton for the attendee dashboard
export function AttendeeDashboardSkeleton() {
    return (
        <div className="min-h-screen bg-[#E8F8F5] font-sans pt-16">
            <main className="mx-auto max-w-7xl px-6 py-14">
                {/* Header */}
                <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
                    <div className="space-y-3 max-w-md">
                        <SkeletonBox className="h-12 w-80 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)]" />
                        <SkeletonBox className="h-5 w-96" />
                    </div>
                    <SkeletonBox className="h-14 w-44 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.12)] border-2 border-gray-200" />
                </div>

                {/* Stats Grid */}
                <section className="mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                            <SkeletonBox className="h-48 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]" />
                        </div>
                        <SkeletonBox className="h-48 border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)]" />
                        <div className="flex flex-col gap-4">
                            <SkeletonBox className="flex-1 h-[90px] border-2 border-gray-200" />
                            <SkeletonBox className="flex-1 h-[90px] border-2 border-gray-200" />
                        </div>
                    </div>
                </section>

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)]">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100 bg-gray-50">
                                <SkeletonBox className="h-5 w-24" />
                                <SkeletonBox className="h-5 w-16" />
                            </div>
                            {/* Ticket rows */}
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
                                    <SkeletonBox className="w-11 h-11 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <SkeletonBox className="h-3 w-20" />
                                        <SkeletonBox className="h-4 w-64" />
                                        <SkeletonBox className="h-3 w-36" />
                                    </div>
                                    <SkeletonBox className="h-9 w-28 shrink-0 border-2 border-gray-200" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="border-2 border-gray-200">
                            <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50">
                                <SkeletonBox className="h-4 w-28" />
                            </div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3.5 px-5 py-4 border-b border-gray-100">
                                    <SkeletonBox className="w-10 h-12 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <SkeletonBox className="h-4 w-full" />
                                        <SkeletonBox className="h-3 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <SkeletonBox className="h-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]" />
                    </div>
                </div>
            </main>
        </div>
    );
}

// Sharp skeleton for organizer dashboard
export function OrganizerDashboardSkeleton() {
    return (
        <div className="min-h-screen bg-[#FFF4E8] font-sans pt-16">
            <main className="mx-auto max-w-7xl px-6 py-14">
                {/* Header */}
                <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
                    <div className="space-y-3 max-w-md">
                        <SkeletonBox className="h-12 w-72 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)]" />
                        <SkeletonBox className="h-5 w-96" />
                    </div>
                    <SkeletonBox className="h-14 w-52 border-2 border-orange-100 shadow-[4px_4px_0px_0px_rgba(234,88,12,0.15)]" />
                </div>

                {/* Stats */}
                <section className="mb-20">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <SkeletonBox className="h-52 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]" />
                        <SkeletonBox className="h-52 border-2 border-orange-100 shadow-[6px_6px_0px_0px_rgba(234,88,12,0.12)]" />
                        <SkeletonBox className="h-52 border-2 border-gray-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.08)]" />
                    </div>
                </section>

                {/* Events List */}
                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <SkeletonBox className="h-7 w-32" />
                        <SkeletonBox className="h-8 w-28 border-2 border-gray-200" />
                    </div>
                    <div className="border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)]">
                        <div className="h-[3px] bg-orange-100" />
                        {/* Column header */}
                        <div className="hidden sm:flex items-center px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 gap-4">
                            <SkeletonBox className="w-11 h-5" />
                            <SkeletonBox className="flex-1 h-5" />
                            <SkeletonBox className="w-20 h-5" />
                            <SkeletonBox className="w-24 h-5" />
                            <SkeletonBox className="w-28 h-5" />
                        </div>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                                <div className="w-1 h-12 bg-gray-100 shrink-0" />
                                <SkeletonBox className="w-11 h-11 shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <SkeletonBox className="h-3 w-16" />
                                    <SkeletonBox className="h-4 w-56" />
                                    <SkeletonBox className="h-3 w-32" />
                                </div>
                                <SkeletonBox className="w-16 h-8 hidden sm:block" />
                                <SkeletonBox className="w-20 h-8 hidden sm:block" />
                                <SkeletonBox className="w-10 h-8 hidden sm:block" />
                                <div className="flex gap-2">
                                    <SkeletonBox className="h-9 w-20 border-2 border-gray-200" />
                                    <SkeletonBox className="h-9 w-12 border border-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

// Sharp skeleton for profile page
export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-off-white pt-20">
            <div className="mx-auto max-w-5xl px-6 py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border-2 border-soft-slate shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] p-8 space-y-6">
                            <SkeletonBox className="w-24 h-24 mx-auto" />
                            <div className="space-y-3 text-center">
                                <SkeletonBox className="h-6 w-36 mx-auto" />
                                <SkeletonBox className="h-4 w-48 mx-auto" />
                            </div>
                            <div className="pt-4 border-t-2 border-soft-slate space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <SkeletonBox className="h-4 w-24" />
                                        <SkeletonBox className="h-5 w-12" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border-2 border-soft-slate shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)] p-8 space-y-5">
                            <SkeletonBox className="h-6 w-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]" />
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <SkeletonBox className="h-3 w-20" />
                                        <SkeletonBox className="h-10 w-full border-2 border-gray-100" />
                                    </div>
                                ))}
                            </div>
                            <SkeletonBox className="h-12 w-36 border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]" />
                        </div>
                        <div className="bg-white border-2 border-soft-slate shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)] p-8 space-y-4">
                            <SkeletonBox className="h-6 w-44" />
                            <SkeletonBox className="h-4 w-full" />
                            <SkeletonBox className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sharp skeleton for the organizer event detail/management page
export function OrganizerEventSkeleton() {
    return (
        <div className="min-h-screen bg-off-white pt-16">
            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* Back link */}
                <SkeletonBox className="h-4 w-32 mb-8" />

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
                    <div className="space-y-3">
                        <SkeletonBox className="h-10 w-96 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
                        <div className="flex gap-3">
                            <SkeletonBox className="h-6 w-24" />
                            <SkeletonBox className="h-6 w-32" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <SkeletonBox className="h-10 w-24 border-2 border-gray-200" />
                        <SkeletonBox className="h-10 w-28 border-2 border-orange-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 border-b-2 border-soft-slate mb-8">
                    {["Overview", "Attendees", "Marketing", "Queries", "Settings"].map((tab, i) => (
                        <SkeletonBox key={tab} className={`h-10 w-24 mr-1 ${i === 0 ? 'shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.2)]' : ''}`} />
                    ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonBox key={i} className="h-28 border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.07)]" />
                    ))}
                </div>

                {/* Main content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <SkeletonBox className="h-64 border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)]" />
                    </div>
                    <SkeletonBox className="h-64 border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)]" />
                </div>
            </div>
        </div>
    );
}
