'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authHydrate } from '@/redux/features/authSlice';
import { loadUser } from '@/lib/auth-storage';
import type { AppDispatch } from '@/redux/store';
import type { AuthUser } from '@/redux/features/authSlice';

export default function InitAuthGate({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const saved = loadUser<AuthUser>();
    dispatch(authHydrate(saved));
  }, [dispatch]);

  return <>{children}</>;
}
