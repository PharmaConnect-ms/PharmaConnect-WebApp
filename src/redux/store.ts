'use client';

import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './features/authSlice';
import { saveUser } from '@/lib/auth-storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persist auth.user to localStorage on changes (client only)
if (typeof window !== 'undefined') {
  let prev = store.getState().auth.user;
  store.subscribe(() => {
    const next = store.getState().auth.user;
    if (next !== prev) {
      prev = next;
      if (next) saveUser(next);
      else localStorage.removeItem('user');
    }
  });
}
