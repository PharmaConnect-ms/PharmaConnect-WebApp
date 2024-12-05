'use client'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useRole = (requiredRole: 'admin' | 'doctor' | 'user') => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== requiredRole) {
      router.push('/login');
    }
  }, [user, requiredRole, router]);

  return user;
};
