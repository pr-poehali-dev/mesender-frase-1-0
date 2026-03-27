import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  phone: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const KEY = 'frase_user';

function loadUser(): UserProfile | null {
  try {
    const v = localStorage.getItem(KEY);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(loadUser);

  const login = (profile: UserProfile) => {
    localStorage.setItem(KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    localStorage.setItem(KEY, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
