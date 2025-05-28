// src/components/ConfettiCannon/ConfettiCannon.js
import React, { useState, useEffect } from 'react';

const ConfettiCannon = ({ active }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (active) {
            const newParticles = Array.from({ length: 60 }, (_, i) => ({
                id: `confetti-${Date.now()}-${i}`,
                x: Math.random() * 100,
                initialY: -10 - Math.random() * 20,
                fallDistance: 100 + Math.random() * 30,
                rotation: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.4,
                duration: Math.random() * 1.5 + 2,
                delay: Math.random() * 0.5,
                color: `hsl(${Math.random() * 360}, 100%, 65%)`,
                opacity: 1,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            }));
            setParticles(newParticles);

            const longestDuration = Math.max(...newParticles.map(p => p.duration)) + 1.5;
            const timer = setTimeout(() => {
                setParticles([]);
            }, longestDuration * 1000);

            return () => clearTimeout(timer);
        }
    }, [active]);

    if (!particles.length && !active) return null;

    return (
        <>
            <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className={`absolute ${p.shape === 'rect' ? 'w-2 h-3' : 'rounded-full w-2 h-2'}`}
                        style={{
                            left: `${p.x}%`,
                            top: `${p.initialY}%`,
                            backgroundColor: p.color,
                            opacity: p.opacity,
                            transform: `translateY(0) rotate(${p.rotation}deg) scale(${p.scale})`,
                            animation: active
                                ? `fall-${p.id} ${p.duration}s ${p.delay}s cubic-bezier(0.32, 0.94, 0.6, 1) forwards, fadeOutConfetti 1s ${p.duration + p.delay}s forwards`
                                : 'none',
                            willChange: 'transform, opacity',
                        }}
                    />
                ))}
            </div>
            {/* Keyframes are dynamically generated based on particles state */}
            <style jsx global>{`
                ${particles.map(p => `
                    @keyframes fall-${p.id} {
                        to {
                            transform: translateY(${p.fallDistance}vh) rotate(${p.rotation + Math.random() * 180 - 90}deg) scale(${p.scale * (Math.random() * 0.3 + 0.85)});
                        }
                    }
                `).join('\n')}
                @keyframes fadeOutConfetti {
                    to {
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};
export default ConfettiCannon;
