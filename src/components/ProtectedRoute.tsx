'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectIsAuthenticated, selectIsHydrated, selectAuthUser } from '@/redux/features/authSlice';
import { isTokenValid } from '@/utils/token-utils';
import { clearUser } from '@/lib/auth-storage';
import Loading from '@/components/ui/loading';
import type { UserRole } from '@/redux/features/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isHydrated = useSelector(selectIsHydrated);
  const user = useSelector(selectAuthUser);
  const router = useRouter();

  useEffect(() => {
    // Don't do anything until auth state is hydrated
    if (!isHydrated) return;

    // Check if authentication is required
    if (requireAuth) {
      // Check if user is not authenticated
      if (!isAuthenticated || !user) {
        router.replace('/login');
        return;
      }

      // Validate token
      if (!isTokenValid(user)) {
        console.warn('Token is invalid, redirecting to login');
        clearUser();
        router.replace('/login');
        return;
      }

      // Check role permissions
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect based on user's actual role
        switch (user.role) {
          case 'admin':
            router.replace('/admin');
            break;
          case 'doctor':
            router.replace('/doctor');
            break;
          case 'patient':
            router.replace('/user');
            break;
          default:
            router.replace('/login');
        }
        return;
      }
    }
  }, [isAuthenticated, isHydrated, user, allowedRoles, requireAuth, router]);

  // Show loading while auth state is being determined
  if (!isHydrated) {
    return <Loading message="Checking authentication..." />;
  }

  // Show loading while redirecting
  if (requireAuth && (!isAuthenticated || !user)) {
    return <Loading message="Redirecting..." />;
  }

  // Check role access after hydration
  if (requireAuth && user && allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Loading message="Redirecting..." />;
  }

  return <>{children}</>;
}
