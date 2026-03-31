"use client";
import React, { useState, useEffect } from 'react';

// Global state to track if ANY navigation is happening
let globalIsNavigating = false;
let globalSetters: Set<(val: boolean) => void> = new Set();

const setGlobalNavigating = (val: boolean) => {
    globalIsNavigating = val;
    globalSetters.forEach(setter => setter(val));
};

export function SharpSpinner({ className = "w-4 h-4 text-muted-teal" }) {
  return (
    <div className={`relative flex items-center justify-center ${className} pointer-events-none`}>
        <div className="absolute inset-0 border-[1.5px] border-current opacity-30 border-t-current opacity-100 rounded-none animate-[spin_1s_linear_infinite]" />
        <div className="absolute inset-[3.5px] border-[1px] border-current opacity-30 border-b-current opacity-100 rounded-none animate-[spin_0.8s_reverse_linear_infinite]" />
    </div>
  );
}

export function SharpDots({ className = "text-current" }) {
    return (
        <div className={`flex items-center justify-center gap-1 ${className}`}>
            <div className="w-1.5 h-1.5 bg-current rounded-none animate-[pulse_1s_ease-in-out_infinite_0s]" />
            <div className="w-1.5 h-1.5 bg-current rounded-none animate-[pulse_1s_ease-in-out_infinite_0.2s]" />
            <div className="w-1.5 h-1.5 bg-current rounded-none animate-[pulse_1s_ease-in-out_infinite_0.4s]" />
        </div>
    );
}

import { useRouter, usePathname } from 'next/navigation';

export function LoadingLink({ href, children, className = "", onClick, center = false }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void; center?: boolean }) {
    const [isNavigating, setIsNavigating] = useState(globalIsNavigating);
    const [isSource, setIsSource] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Reset lock when pathname changes (navigation finished)
    useEffect(() => {
        setGlobalNavigating(false);
        setIsSource(false);
    }, [pathname]);

    useEffect(() => {
        const sync = (val: boolean) => setIsNavigating(val);
        globalSetters.add(sync);
        return () => {
            globalSetters.delete(sync);
        };
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        // External or special links
        if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
            if (onClick) onClick();
            return;
        }
        
        e.preventDefault();
        
        // If someone else is already navigating, do nothing
        if (globalIsNavigating) return;

        // Start navigation
        if (onClick) onClick();
        setIsSource(true);
        setGlobalNavigating(true);
        router.push(href);
    };

    // Only show the spinner if WE started the navigation AND the global state is still navigating
    const shouldShow = isSource && isNavigating;

    return (
        <a 
            href={href} 
            onClick={handleClick} 
            className={`relative flex items-center gap-2 ${className} ${shouldShow ? 'pointer-events-none opacity-80' : isNavigating ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
            {shouldShow && (
                <div className={center ? "absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] z-50 pointer-events-none" : "shrink-0"}>
                    <SharpSpinner className={center ? "w-10 h-10 text-charcoal-blue" : "w-3 h-3 text-current"} />
                </div>
            )}
        </a>
    );
}
