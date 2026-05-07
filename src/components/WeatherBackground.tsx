import React, { useEffect, useState, useRef } from 'react';

interface WeatherBackgroundProps {
    weatherCode: number;
    isDay: number; // 0 or 1
}

// Particle Helper Types
interface Particle {
    x: number;
    y: number;
    speed: number;
    length: number;
    opacity: number;
    size: number;
    drift: number; // For snow
}

// Helper to determine background style based on WMO code and time
const getBackgroundStyle = (code: number, isDay: boolean): string => {
    // Night fallback for most
    if (!isDay) {
        if (code <= 1) return 'linear-gradient(to bottom, #0B1026, #2B32B2)';
        if (code <= 48) return 'linear-gradient(to bottom, #1F2937, #4B5563)';
        if (code <= 67 || (code >= 80 && code <= 82)) return 'linear-gradient(to bottom, #111827, #374151)';
        if (code >= 71) return 'linear-gradient(to bottom, #1e1e2e, #2a2a40)';
        return 'linear-gradient(to bottom, #0F172A, #1E293B)';
    }

    // Day
    if (code <= 1) return 'linear-gradient(to bottom, #2980B9, #6DD5FA)';
    if (code === 2) return 'linear-gradient(to bottom, #50C9C3, #96DEDA)';
    if (code === 3 || code === 45 || code === 48) return 'linear-gradient(to bottom, #757F9A, #D7DDE8)';
    if (code >= 51 && code <= 67) return 'linear-gradient(to bottom, #3a4b61, #627285)';
    if (code >= 71 && code <= 77) return 'linear-gradient(to bottom, #83a4d4, #b6fbff)';
    if (code >= 80 && code <= 82) return 'linear-gradient(to bottom, #4CA1AF, #2C3E50)';
    if (code >= 95) return 'linear-gradient(to bottom, #232526, #414345)';

    return 'linear-gradient(to bottom, #2980B9, #6DD5FA)'; // Default Blue
};

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherCode, isDay }) => {
    const [background, setBackground] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Derive simple weather state
    const isCloudy = weatherCode >= 2 && weatherCode <= 48;
    const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || weatherCode >= 95; // 95 is thunderstorm, usually rain
    const isSnowy = weatherCode >= 71 && weatherCode <= 77;
    const isClear = weatherCode <= 1;

    useEffect(() => {
        const bg = getBackgroundStyle(weatherCode, isDay === 1);
        setBackground(bg);
    }, [weatherCode, isDay]);

    // Canvas Animation Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || (!isRainy && !isSnowy)) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Init Particles
        const particleCount = isRainy ? 150 : 100; // Less snow than rain usually
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: isRainy ? Math.random() * 15 + 10 : Math.random() * 2 + 1, // Rain fast, Snow slow
                length: isRainy ? Math.random() * 20 + 10 : Math.random() * 3 + 2, // Rain long, Snow small circles
                opacity: Math.random() * 0.5 + 0.1,
                size: isSnowy ? Math.random() * 3 + 1 : 1, // Radius for snow
                drift: Math.random() * 1 - 0.5 // Horizontal drift
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = isDay ? 'rgba(255, 255, 255, 0.6)' : 'rgba(173, 216, 230, 0.3)';
            ctx.strokeStyle = isDay ? 'rgba(255, 255, 255, 0.4)' : 'rgba(173, 216, 230, 0.3)';
            ctx.lineWidth = 1; // Thin rain

            particles.forEach(p => {
                if (isRainy) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + p.length);
                    ctx.stroke();

                    p.y += p.speed;
                    if (p.y > canvas.height) {
                        p.y = -p.length;
                        p.x = Math.random() * canvas.width;
                    }
                } else if (isSnowy) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();

                    p.y += p.speed;
                    p.x += p.drift;

                    if (p.y > canvas.height) {
                        p.y = -5;
                        p.x = Math.random() * canvas.width;
                    }
                    if (p.x > canvas.width) p.x = 0;
                    if (p.x < 0) p.x = canvas.width;
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isRainy, isSnowy, isDay]); // Restart loop if condition changes

    return (
        <div
            className="weather-background"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                background: background,
                transition: 'background 1s ease-in-out',
                overflow: 'hidden'
            }}
        >
            {/* Sun / Moon Orb (Only clear days/nights) */}
            {isClear && isDay === 1 && <div className="celestial-body sun" />}
            {isClear && isDay === 0 && <div className="celestial-body moon" />}

            {/* Stars (Clear Night only) */}
            {isClear && isDay === 0 && (
                <>
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="star"
                            style={{
                                top: `${Math.random() * 50}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 3}px`,
                                height: `${Math.random() * 3}px`,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        />
                    ))}
                </>
            )}

            {/* Clouds Layer */}
            {isCloudy && (
                <div className="cloud-container">
                    {/* Generate a few random clouds */}
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="cloud"
                            style={{
                                width: `${Math.random() * 300 + 200}px`,
                                height: `${Math.random() * 200 + 100}px`,
                                top: `${Math.random() * 60 - 20}%`, // Mostly top but interactive
                                left: `${Math.random() * -20}%`,
                                animationDuration: `${Math.random() * 20 + 30}s`, // 30-50s drift
                                animationDelay: `${Math.random() * -20}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Canvas for Rain/Snow */}
            {(isRainy || isSnowy) && (
                <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                />
            )}
        </div>
    );
};
