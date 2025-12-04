import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
};

export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  totalPrice: 0,
});

const CART_KEY = 'CART_ITEMS';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(CART_KEY);
      if (saved) setItems(JSON.parse(saved));
    })();
  }, []);

  // Save cart to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: CartItem) => {
    setItems(prev => (prev.find(p => p.id === product.id) ? prev : [...prev, product]));
  };

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    AsyncStorage.removeItem(CART_KEY);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
