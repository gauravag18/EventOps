"use client";

import React, { useState } from 'react';
import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';

// Detailed steps for the form wizard
const STEPS = [
    { number: 1, title: 'Basics', description: 'Title, tagline & category' },
    { number: 2, title: 'When & Where', description: 'Date, time & location' },
    { number: 3, title: 'Details', description: 'Description & capacity' },
    { number: 4, title: 'Ticketing', description: 'Price & final review' },
];

export default function CreateEventForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        tagline: '',
        category: CATEGORIES[0] || 'Technology',
        date: '',
        time: '',
        location: '',
        description: '',
        image: '/placeholder-1.jpg', // Default for now
        capacity: 100,
        price: '',
        isFree: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (field: string) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting Event:", formData);
        alert("Event Created! (Simulation)");
    };

    // Calculate progress percentage
    const progress = (step / STEPS.length) * 100;
    const currentStepInfo = STEPS[step - 1];

    return (
        <div className="flex flex-col h-screen pt-[72px] overflow-hidden bg-gray-50">
            {/* Progress Line - Fixed to top of content area */}
            <div className="w-full bg-gray-200 h-1 shrink-0">
                <div
                    className="h-full bg-blue-900 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SIDE - NAVIGATION & CONTEXT (35%) */}
                <div className="hidden lg:flex w-[35%] flex-col h-full bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-10 flex flex-col min-h-full">

                        {/* Current Step Focus Header */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold text-lg">
                                    {step}
                                </span>
                                <span className="text-sm font-bold tracking-wider text-blue-900 uppercase">Current Step</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {currentStepInfo.title}
                            </h1>
                            <p className="mt-4 text-lg text-gray-500">
                                {currentStepInfo.description}
                            </p>
                        </div>

                        {/* Vertical Stepper Navigation */}
                        <div className="flex-1 space-y-2 mb-10">
                            {STEPS.map((s) => (
                                <div
                                    key={s.number}
                                    className={`flex items-center p-3 border-l-4 transition-all ${s.number === step
                                        ? 'bg-blue-50 border-blue-900'
                                        : s.number < step
                                            ? 'text-green-600 border-green-600'
                                            : 'text-gray-400 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon/Number */}
                                        <div className={`
                                            w-8 h-8 flex items-center justify-center text-sm font-bold border-2 transition-colors
                                            ${s.number === step ? 'border-blue-900 bg-blue-900 text-white' :
                                                s.number < step ? 'border-green-600 bg-green-600 text-white' :
                                                    'border-gray-200 text-gray-400'}
                                        `}>
                                            {s.number < step ? '✓' : s.number}
                                        </div>
                                        {/* Text */}
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${s.number === step ? 'text-gray-900' : ''}`}>
                                                {s.title}
                                            </span>
                                        </div>
                                    </div>
                                    {s.number === step && (
                                        <div className="ml-auto w-2 h-2 bg-blue-900 animate-pulse" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Formatting Tip Box */}
                        <div className="bg-gray-50 p-5 border-2 border-gray-100 mt-auto">
                            <div className="flex gap-3">
                                <span className="text-xl">💡</span>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {step === 1 && "Catchy titles get 40% more clicks. Keep it short!"}
                                    {step === 2 && "70% of attendees check the map first."}
                                    {step === 3 && "High-quality images drive sales."}
                                    {step === 4 && "Early bird pricing boosts signs-ups."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - FORM (65%) */}
                <div className="w-full lg:w-[65%] flex flex-col h-full bg-gray-50/50 relative">

                    {/* Mobile Header */}
                    <div className="lg:hidden p-6 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 uppercase tracking-wide">Step {step} of 4</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{currentStepInfo.title}</h2>
                    </div>

                    {/* SCROLLABLE FORM AREA */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="w-full h-full p-6 lg:p-12">
                            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Form fields rendered here */}
                                {/* STEP 1: BASICS */}
                                {step === 1 && (
                                    <>
                                        <div className="bg-white p-6 lg:p-8 shadow-sm border-2 border-gray-200 space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-900">Event Title</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Global Developer Summit 2026"
                                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300 font-medium bg-white"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-900">Tagline</label>
                                                <input
                                                    type="text"
                                                    name="tagline"
                                                    value={formData.tagline}
                                                    onChange={handleChange}
                                                    placeholder="Short & sweet description"
                                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300 bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 lg:p-8 shadow-sm border-2 border-gray-200 space-y-4">
                                            <label className="block text-sm font-bold text-gray-900">Category</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {CATEGORIES.filter(c => c !== "All Events").map(c => (
                                                    <div
                                                        key={c}
                                                        onClick={() => setFormData(prev => ({ ...prev, category: c }))}
                                                        className={`cursor-pointer px-4 py-3 border-2 text-sm font-bold uppercase tracking-wider transition-all text-center
                                                            ${formData.category === c
                                                                ? 'border-blue-900 bg-blue-900 text-white shadow-sm'
                                                                : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {c}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* STEP 2: TIME & PLACE */}
                                {step === 2 && (
                                    <div className="bg-white p-6 lg:p-8 shadow-sm border-2 border-gray-200 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-900">Date</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all bg-white"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-900">Starts At</label>
                                                <input
                                                    type="text"
                                                    name="time"
                                                    value={formData.time}
                                                    onChange={handleChange}
                                                    placeholder="09:00 AM"
                                                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-900">Location</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="Venue name or address"
                                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all placeholder:text-gray-300 bg-white"
                                                    required
                                                />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">📍</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: DETAILS */}
                                {step === 3 && (
                                    <div className="bg-white p-6 lg:p-8 shadow-sm border-2 border-gray-200 space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-900">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={8}
                                                placeholder="Tell attendees what makes this event unmissable..."
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all resize-none placeholder:text-gray-300 bg-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-900">Cover Image URL</label>
                                            <input
                                                type="text"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                placeholder="https://..."
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-900">Total Capacity</label>
                                            <input
                                                type="number"
                                                name="capacity"
                                                value={formData.capacity}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all bg-white"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: TICKETS */}
                                {step === 4 && (
                                    <>
                                        <div className="bg-white p-6 lg:p-8 shadow-sm border-2 border-gray-200 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="block font-bold text-gray-900 text-lg">Free Event</span>
                                                    <span className="text-gray-500 text-sm">Tickets will be free for everyone</span>
                                                </div>
                                                <div
                                                    onClick={() => handleToggle('isFree')}
                                                    className={`w-14 h-8 flex items-center p-1 cursor-pointer transition-colors border-2 ${formData.isFree ? 'bg-blue-900 border-blue-900' : 'bg-transparent border-gray-300'}`}
                                                >
                                                    <div className={`bg-gray-900 w-5 h-5 shadow-sm transform transition-transform ${formData.isFree ? 'translate-x-6 bg-white' : 'translate-x-0'}`} />
                                                </div>
                                            </div>

                                            {!formData.isFree && (
                                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-6 border-t border-gray-100">
                                                    <label className="block text-sm font-bold text-gray-900 mb-2">Ticket Price</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            value={formData.price}
                                                            onChange={handleChange}
                                                            placeholder="0.00"
                                                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 focus:border-blue-900 focus:ring-0 outline-none transition-all bg-white font-bold text-xl"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-white p-6 lg:p-8 shadow-sm border-2 border-gray-200">
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Event Preview</h3>
                                            <div className="flex gap-5 items-start">
                                                <div className="w-24 h-24 bg-gray-100 shrink-0 overflow-hidden relative border-2 border-gray-200">
                                                    {formData.image && formData.image !== '/placeholder-1.jpg' ? (
                                                        <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold uppercase text-gray-400">No Image</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-xl leading-tight mb-2">{formData.title || 'Untitled Event'}</h4>
                                                    <div className="space-y-1 text-sm text-gray-500">
                                                        <p className="flex items-center gap-2">
                                                            <span>📅</span> {formData.date || 'TBD'} • {formData.time || 'TBD'}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <span>📍</span> {formData.location || 'No location set'}
                                                        </p>
                                                    </div>
                                                    <div className="mt-3 inline-flex px-3 py-1 bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider border-2 border-blue-100">
                                                        {formData.isFree ? 'Free Ticket' : `$${formData.price || '0.00'}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Footer / Controls */}
                    <div className="p-6 lg:px-10 border-t border-gray-200 bg-white shrink-0">
                        <div className="w-full flex items-center justify-between">
                            <button
                                type="button"
                                onClick={step > 1 ? prevStep : undefined}
                                className={`text-gray-500 font-bold uppercase tracking-wider hover:text-gray-900 px-4 py-2 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                Back
                            </button>

                            {step < STEPS.length ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-gray-900 hover:bg-black text-white px-8 py-3 font-bold uppercase tracking-wider transition-all border-2 border-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 font-bold uppercase tracking-wider transition-all border-2 border-orange-600 hover:shadow-[4px_4px_0px_0px_rgba(194,65,12,0.5)]"
                                >
                                    Publish Event
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
