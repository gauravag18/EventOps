import React from 'react';

export default function HomeLoading() {
    return (
        <div className="bg-white min-h-screen">
            {/* Navbar Skeleton */}
            <div className="h-16 bg-[#0D0F14] border-b border-white/5 animate-pulse" />

            {/* Hero Skeleton (Manga Split) */}
            <div className="relative h-[100dvh] overflow-hidden border-b-4 border-black">
                {/* Diagonal Panels Simulation */}
                <div className="absolute inset-0 flex bg-gray-50/50">
                    <div className="w-[65%] bg-teal-100/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-shimmer animate-shimmer" />
                    </div>
                    <div className="w-[35%] bg-orange-100/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-shimmer animate-shimmer" style={{ animationDelay: '0.2s' }} />
                    </div>
                </div>

                {/* The Slash Skeleton */}
                <div className="absolute inset-0 z-20 pointer-events-none" 
                     style={{ background: '#0D0F14', clipPath: 'polygon(62% 0, 65% 0, 56% 100%, 53% 100%)' }} />

                {/* Content Skeleton */}
                <div className="relative z-30 grid lg:grid-cols-[65fr_35fr] h-full pt-16">
                    {/* Left Center Content */}
                    <div className="flex flex-col items-center justify-center p-8 lg:pr-48">
                        {/* Shimmer items */}
                        <div className="h-4 w-32 bg-teal-200/20 rounded-none mb-8 animate-pulse" />
                        <div className="h-16 w-80 bg-teal-300/10 rounded-none mb-6 animate-pulse" />
                        <div className="h-20 w-64 bg-teal-300/5 rounded-none mb-10 animate-pulse" />
                        <div className="h-16 w-56 bg-charcoal-blue/5 rounded-none animate-pulse" />
                    </div>

                    {/* Right Center Content */}
                    <div className="flex flex-col items-center justify-center p-8 lg:pl-48">
                        <div className="h-4 w-32 bg-orange-200/20 rounded-none mb-8 animate-pulse" />
                        <div className="h-16 w-64 bg-orange-300/10 rounded-none mb-6 animate-pulse" />
                        <div className="h-4 w-48 bg-orange-300/5 rounded-none mb-10 animate-pulse" />
                        <div className="h-14 w-48 bg-charcoal-blue/5 rounded-none animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
