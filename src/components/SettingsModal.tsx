import React from 'react';
import { X, Moon, Sun, Thermometer } from 'lucide-react';
import type { Settings } from '../hooks/useSettings';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    toggleTheme: () => void;
    toggleUnit: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    settings,
    toggleTheme,
    toggleUnit
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Einstellungen</h2>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="settings-section">
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Erscheinungsbild</span>
                            <span className="setting-desc">Wähle zwischen Hell- und Dunkelmodus</span>
                        </div>
                        <button
                            className={`toggle-button ${settings.theme}`}
                            onClick={toggleTheme}
                        >
                            {settings.theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                            {settings.theme === 'light' ? 'Hell, Statisch' : 'Dunkel, Dynamisch'}
                        </button>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Einheit</span>
                            <span className="setting-desc">Temperatur in Celsius oder Fahrenheit</span>
                        </div>
                        <button
                            className="toggle-button"
                            onClick={toggleUnit}
                        >
                            <Thermometer size={20} />
                            {settings.unit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
