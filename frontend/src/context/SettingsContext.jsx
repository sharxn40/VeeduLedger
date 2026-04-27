import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { settingsService, DEFAULT_SETTINGS } from '../services/settingsService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (currentUser) {
      setLoading(true);
      try {
        const data = await settingsService.get(currentUser.uid);
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [currentUser]);

  const updateSettings = async (newData) => {
    if (currentUser) {
      await settingsService.update(currentUser.uid, newData);
      setSettings(prev => ({ ...prev, ...newData }));
    }
  };

  const value = {
    settings,
    loading,
    refreshSettings: fetchSettings,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
