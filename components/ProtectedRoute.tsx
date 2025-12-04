import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login'); 
    }
  }, [user, loading]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
