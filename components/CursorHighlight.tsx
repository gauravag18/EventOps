'use client';

import React, { useEffect, useState } from 'react';

export default function CursorHighlight() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setOpacity(1);
        };

        const handleMouseLeave = () => {
            setOpacity(0);
        };

        const handleMouseEnter = () => {
            setOpacity(1);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
            style={{
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
                opacity: opacity,
            }}
        />
    );
}
