import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

type User = {
  email: string;
  name: string;
  token: string;
  profileImage?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

const AUTH_KEY = 'AUTH_TOKEN';

const mockUsers = [
  { email: 'test@zignuts.com', password: '123456', name: 'Test User' },
  { email: 'practical@zignuts.com', password: '123456', name: 'Practical User' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedUser = await AsyncStorage.getItem(AUTH_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');

    const token = `token-${Date.now()}`;
    const payload: User = { ...found, token, profileImage: `https://i.pravatar.cc/150` };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(payload));
    setUser(payload);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
