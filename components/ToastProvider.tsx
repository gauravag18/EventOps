'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

function ToastURLListener({ showToast }: { showToast: (msg: string, type: ToastType) => void }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const error = searchParams.get('error');
        const message = searchParams.get('message');
        const success = searchParams.get('success');

        if (error) {
            showToast(error, 'error');
            cleanUrl();
        } else if (success) {
            showToast(success, 'success');
            cleanUrl();
        } else if (message) {
            showToast(message, 'info');
            cleanUrl();
        }

        function cleanUrl() {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('error');
            params.delete('message');
            params.delete('success');
            window.history.replaceState(null, '', `${pathname}${params.toString() ? '?' + params.toString() : ''}`);
        }
    }, [searchParams, showToast, pathname]);

    return null;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            <Suspense fallback={null}>
                <ToastURLListener showToast={showToast} />
            </Suspense>
            {children}
            <div className="fixed top-24 right-6 z-50 flex flex-col gap-4 w-full max-w-sm pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto transform transition-all duration-300 ease-in-out
                            translate-x-0 opacity-100 flex items-start gap-3 p-4 border-l-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]
                            ${toast.type === 'error' ? 'bg-white border-red-500 text-charcoal-blue' : ''}
                            ${toast.type === 'success' ? 'bg-white border-signal-orange text-charcoal-blue' : ''}
                            ${toast.type === 'info' ? 'bg-white border-charcoal-blue text-charcoal-blue' : ''}
                        `}
                        role="alert"
                    >
                        <div className={`shrink-0 mt-0.5
                             ${toast.type === 'error' ? 'text-red-500' : ''}
                             ${toast.type === 'success' ? 'text-signal-orange' : ''}
                             ${toast.type === 'info' ? 'text-charcoal-blue' : ''}
                        `}>
                            {toast.type === 'error' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {toast.type === 'success' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {toast.type === 'info' && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold  tracking-wider">
                                {toast.type === 'error' ? 'Error' : toast.type === 'success' ? 'Success' : 'Notice'}
                            </h3>
                            <p className="text-sm font-medium text-steel-gray mt-1 leading-snug">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-charcoal-blue transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
