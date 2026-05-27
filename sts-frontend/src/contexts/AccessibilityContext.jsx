import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'serviceTicketSystem_AccessibilitySettings';

const DEFAULTS = {
    lightMode: false
};

function loadSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
    const stored = loadSettings() ?? DEFAULTS;

    const [lightMode, setLightMode] = useState(stored.lightMode);

    useEffect(() => {
        saveSettings({ lightMode });
    }, [lightMode]);

    return (
        <AccessibilityContext.Provider value={{
            lightMode, setLightMode
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    return useContext(AccessibilityContext);
}