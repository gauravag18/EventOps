'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CATEGORIES, POPULAR_TAGS } from '@/lib/data';
import { LoadingLink } from './Loaders';
import FavoriteButton from './FavoriteButton';

interface EventData {
    id: string; title: string; description: string; category: string; tags: string[]; date: string | Date; image: string;
    price: string | null; isFree: boolean; capacity: number; displayLocation: string; spotsLeft: number; attendeesCount: number; isRemote: boolean;
}
interface TrendingEvent { id: string; title: string; attendees: number; }
interface EventsBrowserProps { initialEvents: EventData[]; trendingEvents: TrendingEvent[]; }

export default function EventsBrowser({ initialEvents, trendingEvents }: EventsBrowserProps) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<string[]>([]);
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState('Any Date');
    const [venueType, setVenueType] = useState('Any Venue');
    const [sort, setSort] = useState('Newest');
    const [priceFilter, setPriceFilter] = useState('Any Price');
    const [visibleCount, setVisibleCount] = useState(5);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const filteredEvents = useMemo(() => {
        let result = initialEvents.filter(event => {
            if (category.length > 0 && !category.includes(event.category)) return false;
            if (activeTags.length > 0 && !activeTags.some(t => (event.tags ?? []).includes(t))) return false;
            const searchLower = search.toLowerCase();
            if (search && !(event.title.toLowerCase().includes(searchLower) || (event.description && event.description.toLowerCase().includes(searchLower)))) return false;
            if (dateFilter !== 'Any Date') {
                const eventDate = new Date(event.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (dateFilter === 'Today') {
                    if (eventDate.toDateString() !== today.toDateString()) return false;
                } else if (dateFilter === 'This Weekend') {
                    const day = eventDate.getDay();
                    const diff = eventDate.getTime() - today.getTime();
                    const daysAhead = Math.ceil(diff / (1000 * 3600 * 24));
                    if (day !== 0 && day !== 6 && day !== 5) return false;
                    if (daysAhead > 7 || daysAhead < 0) return false;
                } else if (dateFilter === 'Next Month') {
                    if (eventDate.getMonth() !== ((today.getMonth() + 1) % 12)) return false;
                }
            }
            if (venueType !== 'Any Venue') {
                if (venueType === 'Remote / Online' && !event.isRemote) return false;
                if (venueType === 'Physical Location' && event.isRemote) return false;
            }
            if (priceFilter === 'Free') {
                if (!event.isFree) return false;
            }
            return true;
        });
        if (sort === 'Most Popular') {
            result.sort((a, b) => b.attendeesCount - a.attendeesCount);
        } else if (sort === 'Soonest') {
            result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        return result;
    }, [initialEvents, search, category, activeTags, dateFilter, sort, venueType, priceFilter]);

    const visibleEvents = filteredEvents.slice(0, visibleCount);

    const lastElementRef = useCallback((node: any) => {
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleCount < filteredEvents.length) {
                setVisibleCount(prev => prev + 5);
            }
        });
        if (node) observerRef.current.observe(node);
    }, [visibleCount, filteredEvents.length]);

    useEffect(() => { setVisibleCount(5); }, [search, category, activeTags, dateFilter, sort, venueType, priceFilter]);

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 items-start">
            <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 border-2 border-gray-200 bg-white relative overflow-y-auto  transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-muted-teal" />
                    <div className="px-5 py-3.5 border-b-2 border-gray-100 bg-gray-50 mt-[3px]">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-charcoal-blue">Filters</p>
                    </div>
                    <div className="p-6 space-y-8">
                        <div>
                            <h3 className="mb-4 font-bold text-charcoal-blue">Search</h3>
                            <div className="relative">
                                <input type="text" placeholder="SEARCH EVENTS..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border-2 border-gray-200 bg-off-white px-4 py-2 text-sm font-bold tracking-wide text-charcoal-blue placeholder-steel-gray/50 focus:border-charcoal-blue focus:outline-none focus:ring-0" />
                                {search && <button onClick={() => setSearch('')} className="absolute top-2.5 right-3 h-4 w-4 text-steel-gray/50 hover:text-charcoal-blue">&times;</button>}
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold text-charcoal-blue">Format</h3>
                            <div className="space-y-2">
                                {CATEGORIES.filter(cat => cat !== 'All Events').map((cat) => (
                                    <label key={cat} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1 -ml-1 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            name="category" 
                                            checked={category.includes(cat)} 
                                            onChange={(e) => {
                                                if (e.target.checked) setCategory(prev => [...prev, cat]);
                                                else setCategory(prev => prev.filter(c => c !== cat));
                                            }} 
                                            className="h-4 w-4 border-2 border-gray-400 text-charcoal-blue focus:ring-0 rounded-none checked:bg-charcoal-blue hover:border-gray-900 transition-colors" 
                                        />
                                        <span className={`text-sm tracking-wide ${category.includes(cat) ? 'font-bold text-charcoal-blue' : 'text-steel-gray font-medium group-hover:text-charcoal-blue'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-charcoal-blue">Tags</h3>
                                {activeTags.length > 0 && <button onClick={() => setActiveTags([])} className="text-xs font-bold text-steel-gray hover:text-signal-orange transition-colors">Clear</button>}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {POPULAR_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            if (activeTags.includes(tag)) setActiveTags(prev => prev.filter(t => t !== tag));
                                            else setActiveTags(prev => [...prev, tag]);
                                        }}
                                        className={`px-2.5 py-1 text-[11px] font-bold tracking-wide border-2 transition-all ${activeTags.includes(tag)
                                            ? 'bg-muted-teal border-muted-teal text-white'
                                            : 'border-gray-200 text-steel-gray hover:border-muted-teal hover:text-muted-teal bg-white'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold text-charcoal-blue">Date</h3>
                            <div className="space-y-2">
                                {['Any Date', 'Today', 'This Weekend', 'Next Month'].map((label) => (
                                    <label key={label} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1 -ml-1 transition-colors">
                                        <input type="radio" name="date" checked={dateFilter === label} onChange={() => setDateFilter(label)} className="h-4 w-4 border-2 border-gray-400 text-charcoal-blue focus:ring-0 rounded-none checked:bg-charcoal-blue hover:border-gray-900 transition-colors" />
                                        <span className={`text-sm tracking-wide ${dateFilter === label ? 'text-charcoal-blue font-bold' : 'text-steel-gray font-medium group-hover:text-charcoal-blue'}`}>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold text-charcoal-blue">Venue</h3>
                            <div className="space-y-2">
                                {['Any Venue', 'Physical Location', 'Remote / Online'].map((label) => (
                                    <label key={label} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1 -ml-1 transition-colors">
                                        <input type="radio" name="venueType" checked={venueType === label} onChange={() => setVenueType(label)} className="h-4 w-4 border-2 border-gray-400 text-charcoal-blue focus:ring-0 rounded-none checked:bg-charcoal-blue hover:border-gray-900 transition-colors" />
                                        <span className={`text-sm tracking-wide ${venueType === label ? 'text-charcoal-blue font-bold' : 'text-steel-gray font-medium group-hover:text-charcoal-blue'}`}>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold text-charcoal-blue">Price</h3>
                            <div className="space-y-2">
                                {['Any Price', 'Free'].map((label) => (
                                    <label key={label} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1 -ml-1 transition-colors">
                                        <input type="radio" name="price" checked={priceFilter === label} onChange={() => setPriceFilter(label)} className="h-4 w-4 border-2 border-gray-400 text-charcoal-blue focus:ring-0 rounded-none checked:bg-charcoal-blue hover:border-gray-900 transition-colors" />
                                        <span className={`text-sm tracking-wide ${priceFilter === label ? 'text-charcoal-blue font-bold' : 'text-steel-gray font-medium group-hover:text-charcoal-blue'}`}>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => { setSearch(''); setCategory([]); setActiveTags([]); setDateFilter('Any Date'); setVenueType('Any Venue'); setPriceFilter('Any Price'); }} className="w-full border-2 border-gray-200 bg-white py-2 text-sm font-bold tracking-wider text-charcoal-blue hover:bg-charcoal-blue hover:text-white hover:border-charcoal-blue transition-all">Reset Filters</button>
                    </div>
                </div>
            </div>

            {/* MOBILE FILTERS - COLLAPSIBLE/DROPDOWN STYLE */}
            <div className="lg:hidden mb-8 space-y-4">
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-charcoal-blue">Find Events</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <select 
                            value={category[0] || ""} 
                            onChange={(e) => setCategory(e.target.value ? [e.target.value] : [])}
                            className="bg-white border-2 border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-blue focus:border-muted-teal focus:outline-none"
                        >
                            <option value="">All Formats</option>
                            {CATEGORIES.filter(cat => cat !== 'All Events').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select 
                            value={dateFilter} 
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-white border-2 border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-blue focus:border-muted-teal focus:outline-none"
                        >
                            <option>Any Date</option>
                            <option>Today</option>
                            <option>This Weekend</option>
                            <option>Next Month</option>
                        </select>
                        <select 
                            value={venueType} 
                            onChange={(e) => setVenueType(e.target.value)}
                            className="bg-white border-2 border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-blue focus:border-muted-teal focus:outline-none"
                        >
                            <option>Any Venue</option>
                            <option>Physical Location</option>
                            <option>Remote / Online</option>
                        </select>
                        <select 
                            value={priceFilter} 
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="bg-white border-2 border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-blue focus:border-muted-teal focus:outline-none"
                        >
                            <option>Any Price</option>
                            <option>Free</option>
                        </select>
                    </div>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="SEARCH BY KEYWORD..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="w-full border-2 border-gray-200 bg-white px-4 py-3 text-xs font-bold tracking-widest text-charcoal-blue focus:border-muted-teal focus:outline-none" 
                        />
                        {search && <button onClick={() => setSearch('')} className="absolute top-1/2 right-4 -translate-y-1/2 text-steel-gray font-black">×</button>}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3 pb-10 order-1 lg:order-none">
                <div className="flex items-center justify-between bg-white border-2 border-gray-200 px-5 py-4 mb-2 relative hover:border-gray-900 transition-colors">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-muted-teal" />
                    <span className="text-sm font-bold text-steel-gray">Showing <strong className="font-extrabold text-charcoal-blue">{filteredEvents.length}</strong> events</span>
                    <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-steel-gray">Sort by:</label>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-sm font-bold text-charcoal-blue border-b-2 border-transparent focus:border-muted-teal focus:outline-none cursor-pointer transition-colors">
                            <option>Newest</option><option>Most Popular</option><option>Soonest</option>
                        </select>
                    </div>
                </div>

                {/* APPLIED FILTERS HEADER */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {category.map(cat => (
                        <button key={cat} onClick={() => setCategory(prev => prev.filter(c => c !== cat))} className="group flex items-center gap-2 border-2 border-charcoal-blue bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-charcoal-blue hover:bg-charcoal-blue hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Format: {cat}
                            <span className="text-steel-gray group-hover:text-white/60">&times;</span>
                        </button>
                    ))}
                    {activeTags.map(tag => (
                        <button key={tag} onClick={() => setActiveTags(prev => prev.filter(t => t !== tag))} className="group flex items-center gap-2 border-2 border-muted-teal bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-teal hover:bg-muted-teal hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(15,118,110,0.5)]">
                            Tag: {tag}
                            <span className="text-steel-gray group-hover:text-white/60">&times;</span>
                        </button>
                    ))}
                    {dateFilter !== 'Any Date' && (
                        <button onClick={() => setDateFilter('Any Date')} className="group flex items-center gap-2 border-2 border-charcoal-blue bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-charcoal-blue hover:bg-charcoal-blue hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Date: {dateFilter}
                            <span className="text-steel-gray group-hover:text-white/60">&times;</span>
                        </button>
                    )}
                    {venueType !== 'Any Venue' && (
                        <button onClick={() => setVenueType('Any Venue')} className="group flex items-center gap-2 border-2 border-charcoal-blue bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-charcoal-blue hover:bg-charcoal-blue hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Venue: {venueType}
                            <span className="text-steel-gray group-hover:text-white/60">&times;</span>
                        </button>
                    )}
                    {priceFilter !== 'Any Price' && (
                        <button onClick={() => setPriceFilter('Any Price')} className="group flex items-center gap-2 border-2 border-signal-orange bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-signal-orange hover:bg-signal-orange hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(234,88,12,0.3)]">
                            Price: {priceFilter}
                            <span className="text-steel-gray group-hover:text-white/60">&times;</span>
                        </button>
                    )}
                </div>

                {filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                        {visibleEvents.map((event, index) => {
                            const isPaid = !event.isFree;
                            const isLastElement = index === visibleEvents.length - 1;
                            return (
                                <div key={event.id} ref={isLastElement ? lastElementRef : null} className="relative">
                                    <LoadingLink center={true} href={`/event/${event.id}`} className="w-full group relative flex flex-col sm:flex-row !items-stretch !gap-0 bg-white border-2 border-gray-200 transition-all duration-300 hover:border-charcoal-blue hover:shadow-[6px_6px_0px_0px_rgba(31,42,55,1)] hover:-translate-y-1 overflow-hidden cursor-pointer no-underline text-inherit">
                                        <div className={`absolute top-0 bottom-0 left-0 w-1.5 z-20 transition-all group-hover:w-2 ${isPaid ? 'bg-signal-orange' : 'bg-muted-teal'}`} />
                                        <div className="h-48 w-full sm:h-auto sm:w-60 shrink-0 relative overflow-hidden bg-gray-100 border-b-2 sm:border-b-0 sm:border-r-2 border-gray-200 group-hover:border-charcoal-blue transition-colors">
                                            <div className="w-full h-full relative overflow-hidden">
                                                {event.image && event.image !== '/placeholder-1.jpg' ? (
                                                    <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] font-bold tracking-widest text-gray-300 uppercase">No Cover</div>
                                                )}
                                                <div className="absolute top-0 left-0 bg-white border-b-2 border-r-2 border-gray-200 px-3 py-1 group-hover:border-charcoal-blue transition-colors">
                                                    <span className="text-[10px] font-bold tracking-widest uppercase text-charcoal-blue">{event.category}</span>
                                                </div>
                                                <div className="absolute top-2 right-2 z-20">
                                                    <FavoriteButton eventId={event.id} className="h-8 w-8 !shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between p-5 sm:pl-5 relative z-10 text-left">
                                            <div>
                                                <div className="flex items-start justify-between gap-3 mb-1">
                                                    <h3 className="text-lg font-extrabold text-charcoal-blue group-hover:text-muted-teal transition-colors line-clamp-2 leading-tight">{event.title}</h3>
                                                    <div className={`shrink-0 flex items-center justify-center px-3 py-1 border-2 ${isPaid ? 'bg-white border-charcoal-blue text-charcoal-blue shadow-[2px_2px_0px_0px_rgba(31,42,55,1)]' : 'bg-muted-teal border-muted-teal text-white shadow-[2px_2px_0px_0px_rgba(15,118,110,0.5)]'}`}>
                                                        <span className="text-xs font-black tracking-wide">{isPaid ? (event.price?.startsWith('$') ? event.price : `$${event.price}`) : 'FREE'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-[12px] text-steel-gray mt-2.5 font-bold tracking-wide">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="h-3.5 w-3.5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        <span className="text-charcoal-blue">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {event.isRemote ? (
                                                            <svg className="h-3.5 w-3.5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                                        ) : (
                                                            <svg className="h-3.5 w-3.5 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        )}
                                                        <span className="text-charcoal-blue">{event.isRemote ? 'Remote / Online' : event.displayLocation}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t-2 border-gray-100 gap-4">
                                                <div className="flex-1 max-w-[180px]">
                                                    {event.capacity > 0 && event.spotsLeft !== undefined ? (
                                                        <div className="space-y-1.5 text-left">
                                                            <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                                                                <span className="text-steel-gray">Availability</span>
                                                                <span className={event.spotsLeft < 20 ? "text-signal-orange" : "text-muted-teal"}>{event.spotsLeft > 0 ? `${event.spotsLeft} left` : 'Sold out'}</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-gray-200 border border-gray-300 relative overflow-hidden">
                                                                <div className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ${event.spotsLeft < 20 ? 'bg-signal-orange' : 'bg-muted-teal'}`} style={{ width: `${Math.max(0, Math.min(100, ((event.capacity - event.spotsLeft) / event.capacity) * 100))}%` }} />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex -space-x-1.5">
                                                                {[...Array(Math.min(3, event.attendeesCount))].map((_, i) => (
                                                                    <div key={i} className="h-6 w-6 border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                                                        <svg className="h-3 w-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                                    </div>
                                                                ))}
                                                                {event.attendeesCount === 0 && (
                                                                    <div className="h-6 w-6 border-2 border-white bg-gray-100 flex items-center justify-center">
                                                                        <span className="text-[8px] font-bold text-gray-400">0</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] font-bold tracking-widest uppercase text-charcoal-blue">{event.attendeesCount} attending</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 border-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isPaid ? 'bg-white border-signal-orange text-signal-orange group-hover:bg-signal-orange group-hover:text-white' : 'bg-charcoal-blue border-charcoal-blue text-white group-hover:bg-white group-hover:text-charcoal-blue'} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                                                    {isPaid ? 'Tickets' : 'Register'}
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </LoadingLink>
                                </div>
                            );
                        })}
                        {visibleCount < filteredEvents.length && (
                            <div className="flex flex-col sm:flex-row bg-white border-2 border-gray-100 animate-pulse overflow-hidden">
                                <div className="h-48 w-full sm:h-auto sm:w-56 shrink-0 bg-gray-100" />
                                <div className="flex-1 p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="h-6 w-2/3 bg-gray-100" />
                                        <div className="h-8 w-16 bg-gray-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-1/3 bg-gray-100" />
                                        <div className="h-4 w-1/2 bg-gray-100" />
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 flex justify-between">
                                        <div className="h-5 w-24 bg-gray-50" />
                                        <div className="h-8 w-20 bg-gray-50" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-gray-200 p-16 text-center">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-muted-teal" />
                        <h3 className="text-lg font-bold text-charcoal-blue">No matching events</h3>
                        <p className="mt-2 text-sm font-medium text-steel-gray">Try adjusting your search or filters.</p>
                        <button onClick={() => { setSearch(''); setCategory([]); setActiveTags([]); setDateFilter('Any Date'); setVenueType('Any Venue'); setPriceFilter('Any Price'); }} className="mt-5 inline-block text-sm font-bold text-muted-teal hover:underline underline-offset-4 pointer-events-auto">Clear all filters</button>
                    </div>
                )}
            </div>

            <div className="lg:col-span-1 order-2 lg:order-none">
                <div className="sticky top-24 space-y-6 pb-8 pr-2 ">
                    <div className="bg-white border-2 border-gray-200 relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-muted-teal" />
                        <div className="px-5 py-4 border-b-2 border-gray-100 bg-gray-50 mt-[3px]">
                            <h3 className="text-[11px] font-bold tracking-widest uppercase text-charcoal-blue flex items-center gap-2">
                                Trending Now
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-orange opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-orange"></span>
                                </span>
                            </h3>
                        </div>
                        <ul className="space-y-0 divide-y-2 divide-gray-100 p-0">
                            {trendingEvents.length > 0 ? trendingEvents.map((item, i) => (
                                <li key={i} className="group flex items-start gap-4 px-5 py-5 hover:bg-muted-teal/[0.05] transition-colors cursor-pointer border-l-2 border-transparent hover:border-muted-teal">
                                    <span className="text-[12px] font-black text-muted-teal mt-0.5 w-3 shrink-0">{i + 1}</span>
                                    <div className="min-w-0">
                                        <div className="text-[14px] font-bold text-charcoal-blue group-hover:text-muted-teal truncate transition-colors leading-snug">
                                            <LoadingLink center={true} href={`/event/${item.id}`} className="block w-full">{item.title}</LoadingLink>
                                        </div>
                                        <div className="text-[11px] font-bold tracking-widest uppercase text-steel-gray mt-2 flex items-center gap-1.5">
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            {item.attendees} attending
                                        </div>
                                    </div>
                                </li>
                            )) : <li className="px-5 py-4 text-xs font-bold text-steel-gray tracking-widest uppercase">No trending events yet.</li>}
                        </ul>
                    </div>

                    {/* Newsletter / Promo */}
                    <div className="bg-charcoal-blue px-6 py-7 text-white border-2 border-charcoal-blue shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                        <h3 className="text-base font-extrabold leading-snug tracking-wide uppercase relative z-10">Weekly Drops</h3>
                        <p className="mt-2 text-[13px] font-medium text-white/70 leading-relaxed relative z-10">Get the best tech & design events delivered to your inbox.</p>
                        <div className="mt-5 space-y-4 relative z-10">
                            <input
                                type="email"
                                placeholder="YOU@EMAIL.COM"
                                className="w-full border-2 border-white/20 bg-white/5 px-4 py-3 text-xs font-bold tracking-widest text-white placeholder-white/30 focus:border-muted-teal focus:outline-none transition-colors"
                            />
                            <button className="w-full bg-muted-teal border-2 border-muted-teal px-4 py-3 text-xs font-bold tracking-widest uppercase text-white transition-all hover:bg-white hover:text-muted-teal hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.35)]">
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Featured Organizer */}
                    <div className="bg-white border-2 border-gray-200 relative overflow-hidden transition hover:border-charcoal-blue hover:shadow-[4px_4px_0px_0px_rgba(31,42,55,1)]">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-muted-teal" />
                        <div className="px-5 py-3 border-b-2 border-gray-100 bg-gray-50 mt-[3px]">
                            <p className="text-[11px] font-bold tracking-widest uppercase text-charcoal-blue">Featured Organizer</p>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-charcoal-blue border-2 border-charcoal-blue shrink-0 flex items-center justify-center text-[13px] font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">SD</div>
                                <div>
                                    <div className="text-[14px] font-black text-charcoal-blue">System Design Co.</div>
                                    <div className="text-[11px] font-bold tracking-widest uppercase text-steel-gray mt-1">12 events hosted</div>
                                </div>
                            </div>
                            <button className="mt-5 w-full border-2 border-gray-200 bg-white py-2.5 text-[12px] font-bold tracking-widest uppercase text-charcoal-blue hover:border-charcoal-blue hover:shadow-[3px_3px_0px_0px_rgba(31,42,55,1)] transition-all">
                                Follow Organizer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
