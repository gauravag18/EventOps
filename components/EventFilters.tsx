'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/data';
import { useCallback, useTransition } from 'react';

export default function EventFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Get current values
    const currentCategory = searchParams.get('category') || 'All Events';
    const currentSearch = searchParams.get('q') || '';
    const currentDate = searchParams.get('date') || '';

    // Helper to update URL
    const updateFilter = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== 'All Events') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset page on filter change
        params.delete('page');

        startTransition(() => {
            router.push(`/events?${params.toString()}`);
        });
    }, [searchParams, router]);

    const handleReset = () => {
        startTransition(() => {
            router.push('/events');
        });
    };

    return (
        <div className="sticky top-24 space-y-8 border-2 border-gray-200 bg-white p-6 shadow-sm">
            {/* Search */}
            <div>
                <h3 className="mb-4 font-bold text-charcoal-blue">Search</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="SEARCH EVENTS..."
                        defaultValue={currentSearch}
                        onChange={(e) => updateFilter('q', e.target.value)}
                        className="w-full border-2 border-gray-200 bg-off-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-charcoal-blue placeholder-steel-gray/50 focus:border-charcoal-blue focus:outline-none focus:ring-0 disabled:opacity-50"
                        disabled={isPending}
                    />
                    <svg className="absolute top-2.5 right-3 h-4 w-4 text-steel-gray/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="mb-4 font-bold text-charcoal-blue">Categories</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1 -ml-1 transition-colors">
                            <input
                                type="radio"
                                name="category"
                                checked={currentCategory === cat}
                                onChange={() => updateFilter('category', cat)}
                                className="h-4 w-4 border-2 border-gray-400 text-charcoal-blue focus:ring-0 rounded-none checked:bg-charcoal-blue hover:border-gray-900 transition-colors"
                            />
                            <span className={`text-sm tracking-wide uppercase ${currentCategory === cat ? 'font-bold text-charcoal-blue' : 'text-steel-gray font-medium group-hover:text-charcoal-blue'}`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Date */}
            <div>
                <h3 className="mb-4 font-bold text-charcoal-blue">Date</h3>
                <div className="space-y-2">
                    {['Any Date', 'Today', 'This Weekend', 'Next Month'].map((label) => (
                        <label key={label} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1 -ml-1 transition-colors">
                            <input
                                type="radio"
                                name="date"
                                checked={(currentDate === label) || (label === 'Any Date' && !currentDate)}
                                onChange={() => updateFilter('date', label === 'Any Date' ? '' : label)}
                                className="h-4 w-4 border-2 border-gray-400 text-charcoal-blue focus:ring-0 rounded-none checked:bg-charcoal-blue hover:border-gray-900 transition-colors"
                            />
                            <span className={`text-sm tracking-wide uppercase ${((currentDate === label) || (label === 'Any Date' && !currentDate)) ? 'text-charcoal-blue font-bold' : 'text-steel-gray font-medium group-hover:text-charcoal-blue'}`}>
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={handleReset}
                className="w-full border-2 border-gray-200 bg-white py-2 text-sm font-bold uppercase tracking-wider text-charcoal-blue hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
            >
                Reset Filters
            </button>
        </div>
    );
}
