import { useState, useEffect } from 'react';

export interface PinnedLocation {
    name: string;
    lat: number;
    lon: number;
}

const STORAGE_KEY = 'essen45_pinned_locations';

export function usePinnedLocations() {
    const [pinnedLocations, setPinnedLocations] = useState<PinnedLocation[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedLocations));
    }, [pinnedLocations]);

    const addPin = (location: PinnedLocation) => {
        setPinnedLocations((prev) => {
            if (prev.some((p) => p.name === location.name)) return prev;
            return [...prev, location];
        });
    };

    const removePin = (name: string) => {
        setPinnedLocations((prev) => prev.filter((p) => p.name !== name));
    };

    const isPinned = (name: string) => {
        return pinnedLocations.some((p) => p.name === name);
    };

    return { pinnedLocations, addPin, removePin, isPinned };
}
