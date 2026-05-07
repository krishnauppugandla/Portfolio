import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch once at app load so every component can just call useSettings()
    // instead of each making its own /settings request
    api.get('/settings')
      .then((r) => setSettings(r.data))
      .catch((e) => console.error('Failed to load settings:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

/** Ensure a URL has an https:// prefix */
export function normalizeUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}
