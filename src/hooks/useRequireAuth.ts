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
    if (isAuthed === null) return;

    if (isAuthed === false) {
      router.replace('/login');
      return;
    }

    if (roles?.length && role && !roles.includes(role)) {
      router.replace('/'); // need to redirect to 403
    }
  }, [isAuthed, role, roles, router]);
}
