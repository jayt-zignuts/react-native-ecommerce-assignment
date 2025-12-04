// Hook
import { OrdersContext, OrdersContextType } from '@/context/OrdersContext';
import { useContext } from 'react';

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};