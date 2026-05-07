import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type Unit = 'celsius' | 'fahrenheit';

export interface Settings {
    theme: Theme;
    unit: Unit;
}

const STORAGE_KEY = 'essen45_settings';

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored
            ? JSON.parse(stored)
            : { theme: 'light', unit: 'celsius' };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

        // Apply theme
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings]);

    const toggleTheme = () => {
        setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
    };

    const toggleUnit = () => {
        setSettings(prev => ({ ...prev, unit: prev.unit === 'celsius' ? 'fahrenheit' : 'celsius' }));
    };

    return { settings, toggleTheme, toggleUnit };
}
