import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  addPoints: (points: number) => void;
  deductPoints: (points: number) => boolean;
}

const PRESET_USERS: Record<UserRole, User> = {
  resident: {
    id: 'user-01',
    name: 'Kowshik V.',
    email: 'kowshik@urbanloop.eco',
    role: 'resident',
    points: 240,
    address: 'Apt 4B, 128 Green Valley Blvd, Eco District',
    phone: '+1 (555) 234-5678',
    createdAt: '2026-09-15T00:00:00Z'
  },
  collector: {
    id: 'col-102',
    name: 'Rajesh K. (Apex Recyclers)',
    email: 'rajesh@apexrecyclers.org',
    role: 'collector',
    points: 860,
    address: 'Depot 3, Circular Hub, Ward 4',
    phone: '+1 (555) 889-1122',
    createdAt: '2026-08-01T00:00:00Z'
  },
  admin: {
    id: 'adm-001',
    name: 'Chief Sustainability Officer Sarah',
    email: 'admin@citysustainability.gov',
    role: 'admin',
    points: 1500,
    address: 'City Hall, Department of Environment',
    phone: '+1 (555) 999-0000',
    createdAt: '2026-01-01T00:00:00Z'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('urbanloop_auth_user');
    return saved ? JSON.parse(saved) : PRESET_USERS.resident;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('urbanloop_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('urbanloop_auth_user');
    }
  }, [user]);

  const login = async (email: string, role: UserRole = 'resident') => {
    // Check if preset matches or create dynamic user
    const foundPreset = Object.values(PRESET_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundPreset) {
      setUser(foundPreset);
    } else {
      setUser({
        id: `user-${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email,
        role,
        points: 50,
        createdAt: new Date().toISOString()
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(PRESET_USERS[role]);
  };

  const addPoints = (amount: number) => {
    if (user) {
      setUser(prev => prev ? { ...prev, points: prev.points + amount } : null);
    }
  };

  const deductPoints = (amount: number): boolean => {
    if (!user || user.points < amount) {
      return false;
    }
    setUser(prev => prev ? { ...prev, points: prev.points - amount } : null);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        addPoints,
        deductPoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
