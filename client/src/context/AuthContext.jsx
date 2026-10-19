import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('transitops-user');
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { localStorage.removeItem('transitops-user'); return null; }
  });

  const login = (name, email, password) => {
    // Demo authentication: keep the name and email entered on the login screen.
    const displayName = name.trim() || email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
    const mockUser = {
      id: 1,
      name: displayName,
      email,
      role: 'Fleet Manager',
      avatar: null,
    };
    setUser(mockUser);
    localStorage.setItem('transitops-user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('transitops-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
