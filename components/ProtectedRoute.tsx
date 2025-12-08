import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { ReactNode, useEffect, useState } from 'react';
import LoginModal from './LoginModal';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  useEffect(() => {
    if (!loading && !user && !hasClosed) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [user, loading, hasClosed]);

  const handleClose = () => {
    setHasClosed(true); 
    setShowModal(false);
    router.push('/');
  };

  if (loading) return null;
  if (user) return <>{children}</>;

  return (
    <LoginModal
      visible={showModal}
      onClose={handleClose}
    />
  );
};


export default ProtectedRoute;