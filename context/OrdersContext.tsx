import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type OrderItem = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  userEmail: string;
};

export type OrdersContextType = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<Order>;
  clearOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  loading: boolean;
};

const ORDERS_KEY = 'USER_ORDERS';

export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]); 
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const saved = await AsyncStorage.getItem(ORDERS_KEY);
      if (saved) {
        const parsedOrders: Order[] = JSON.parse(saved);
        const sortedOrders = parsedOrders.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOrders = async (newOrders: Order[]) => {
    try {
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      date: new Date().toISOString(),
      status: 'pending',
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    await saveOrders(updatedOrders);
    return newOrder;
  };

  const clearOrders = async () => {
    setOrders([]);
    await AsyncStorage.removeItem(ORDERS_KEY);
  };

  const getOrderById = (id: string) => orders.find(order => order.id === id);

  const refreshOrders = async () => {
    if (user) {
      await loadOrders();
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, clearOrders, getOrderById, refreshOrders, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};
