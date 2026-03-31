import React from 'react';

export default function MessagesLoading() {
    return (
        <div className="min-h-screen bg-off-white font-sans text-steel-gray pt-16">
            <div className="mx-auto max-w-5xl px-6 py-12">

                {/* Header Skeleton */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="h-4 w-20 bg-muted-teal/10 animate-pulse" />
                        <div className="h-10 w-48 bg-gray-200 animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" />
                        <div className="h-4 w-64 bg-gray-100 animate-pulse" />
                    </div>

                    {/* Tab Switcher Skeleton */}
                    <div className="flex bg-gray-100 p-1 border-2 border-gray-200">
                        <div className="px-10 py-5 bg-white border-2 border-gray-200 animate-pulse" />
                        <div className="px-10 py-5 bg-gray-50 border-2 border-transparent animate-pulse" />
                    </div>
                </div>

                {/* Content Grid Skeleton */}
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white border-2 border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] h-[400px] flex flex-col animate-pulse">
                            {/* Header */}
                            <div className="px-5 py-5 border-b-2 border-gray-50 bg-gray-50 flex flex-col gap-2">
                                <div className="h-5 w-3/4 bg-gray-200" />
                                <div className="h-3 w-1/4 bg-gray-100" />
                            </div>
                            
                            {/* Messages */}
                            <div className="flex-1 p-5 space-y-6">
                                <div className="flex flex-col items-start gap-2">
                                    <div className="h-2 w-12 bg-gray-100" />
                                    <div className="h-12 w-[80%] bg-gray-50" />
                                </div>
                                <div className="flex flex-col items-end gap-2 text-right">
                                    <div className="h-12 w-[70%] bg-gray-100" />
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                    <div className="h-2 w-12 bg-gray-100" />
                                    <div className="h-16 w-[75%] bg-gray-50" />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-5 border-t-2 border-gray-50 bg-gray-50/50">
                                <div className="h-10 w-full bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
