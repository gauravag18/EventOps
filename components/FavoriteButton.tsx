'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';

interface FavoriteButtonProps {
    eventId: string;
    className?: string;
}

export default function FavoriteButton({ eventId, className = "" }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('eventops_favorites') || '[]');
        setIsFavorite(favorites.includes(eventId));
    }, [eventId]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const favorites = JSON.parse(localStorage.getItem('eventops_favorites') || '[]');
        let newFavorites;
        
        if (favorites.includes(eventId)) {
            newFavorites = favorites.filter((id: string) => id !== eventId);
            setIsFavorite(false);
            showToast("Removed from Favorites", "info");
        } else {
            newFavorites = [...favorites, eventId];
            setIsFavorite(true);
            showToast("Added to Favorites", "success");
        }
        
        localStorage.setItem('eventops_favorites', JSON.stringify(newFavorites));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('favoritesChanged'));
    };

    return (
        <button 
            onClick={toggleFavorite}
            className={`group/fav relative h-9 w-9 flex items-center justify-center bg-white border-2 border-charcoal-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all ${className}`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
            <svg 
                className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-signal-orange text-signal-orange' : 'fill-none text-charcoal-blue group-hover/fav:text-signal-orange'}`} 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2.5}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
}
