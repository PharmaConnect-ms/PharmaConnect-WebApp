'use client'
import { createContext, useContext, useState, ReactNode } from 'react';


type UserRole = 'admin' | 'doctor' | 'user';

interface AuthContextType {
  user: { role: UserRole; name: string ; userID : string } | null;
  login: (role: UserRole, name: string , userID : string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ role: UserRole; name: string ; userID: string } | null>(null);

  const login = (role: UserRole, name: string , userID: string) => {
    setUser({ role, name , userID });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
