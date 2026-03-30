import React from 'react';

export function SharpSpinner({ className = "w-4 h-4 text-white" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
        <div className="absolute inset-0 border-[1.5px] border-current opacity-30 border-t-current opacity-100 rounded-none animate-[spin_1s_linear_infinite]" />
        <div className="absolute inset-[3px] border-[1px] border-current opacity-30 border-b-current opacity-100 rounded-none animate-[spin_0.8s_reverse_linear_infinite]" />
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
