import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppMode } from '../types';
import { api, ApiStatus } from '../services/api';

interface AppModeContextType {
  mode: AppMode;
  apiStatus: ApiStatus;
  apiUrl: string;
  setMode: (mode: AppMode) => void;
  setApiUrl: (url: string) => void;
  refreshStatus: () => Promise<void>;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const AppModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>(api.getMode());
  const [apiUrl, setApiUrlState] = useState<string>(api.getApiUrl());
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    online: true,
    mode: api.getMode(),
    apiUrl: api.getApiUrl() || 'Sandbox',
  });

  const refreshStatus = async () => {
    const status = await api.checkHealth();
    setApiStatus(status);
  };

  const setMode = (newMode: AppMode) => {
    api.setMode(newMode);
    setModeState(newMode);
    refreshStatus();
  };

  const setApiUrl = (newUrl: string) => {
    api.setApiUrl(newUrl);
    setApiUrlState(newUrl);
    refreshStatus();
  };

  useEffect(() => {
    refreshStatus();
    // Poll API status every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  }, [mode, apiUrl]);

  return (
    <AppModeContext.Provider
      value={{
        mode,
        apiStatus,
        apiUrl,
        setMode,
        setApiUrl,
        refreshStatus,
      }}
    >
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};
