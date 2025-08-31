'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authHydrate, selectIsHydrated } from '@/redux/features/authSlice';
import { loadUser, clearUser } from '@/lib/auth-storage';
import { isTokenValid } from '@/utils/token-utils';
import Loading from '@/components/ui/loading';
import type { AppDispatch } from '@/redux/store';
import type { AuthUser } from '@/redux/features/authSlice';

export default function InitAuthGate({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const isHydrated = useSelector(selectIsHydrated);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isHydrated) {
      try {
        const saved = loadUser<AuthUser>();
        
        // Validate the token if user exists
        if (saved && !isTokenValid(saved)) {
          console.warn('Invalid or expired token found, clearing auth state');
          clearUser();
          dispatch(authHydrate(null));
        } else {
          dispatch(authHydrate(saved));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        clearUser();
        dispatch(authHydrate(null));
      }
    }
  }, [dispatch, isClient, isHydrated]);

  // Don't render children until we've attempted to hydrate the auth state
  if (!isClient || !isHydrated) {
    return <Loading message="Initializing..." />;
  }

  return <>{children}</>;
}
