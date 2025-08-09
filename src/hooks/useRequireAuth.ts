'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectIsAuthenticated, selectRole } from '@/redux/features/authSlice';
import type { UserRole } from '@/redux/features/authSlice';

export function useRequireAuth(roles?: UserRole[]) {
  const isAuthed = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) {
      router.replace('/login');
      return;
    }
    if (roles && role && !roles.includes(role)) {
      router.replace('/'); // or /403
    }
  }, [isAuthed, role, roles, router]);
}
