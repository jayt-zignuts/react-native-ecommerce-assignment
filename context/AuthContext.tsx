import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type User = {
  email: string;
  name: string;
  token: string;
  profileImage?: string;
  address?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; address?: string }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

const AUTH_KEY = 'AUTH_TOKEN';

// Mock users
const mockUsers = [
  { email: 'test@zignuts.com', password: '123456', name: 'Test User' },
  { email: 'practical@zignuts.com', password: '123456', name: 'Practical User' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem(AUTH_KEY);
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');

    const token = `token-${Date.now()}`;
    const payload: User = {
      ...found,
      token,
      profileImage: `https://i.pravatar.cc/150`,
      address: found.address || '',
    };

    try {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(payload));
      setUser(payload);
    } catch (error) {
      console.error('Failed to save user:', error);
      throw new Error('Login failed, please try again');
    }
  };

const logout = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
  } catch (error) {
    console.error("Failed to logout:", error);
  }
};

  const updateProfile = async (updates: { name?: string; address?: string }) => {
    if (!user) return;
    
    const updatedUser: User = {
      ...user,
      ...(updates.name && { name: updates.name }),
      ...(updates.address !== undefined && { address: updates.address }),
    };

    try {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Failed to update profile, please try again');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
