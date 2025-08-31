'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'doctor' | 'patient';

export type AuthUser = {
  role: UserRole;
  name: string;
  userID: string;
  token: string;
  age: string;
  phone: string;
  address: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null | undefined;
  isHydrated: boolean;
};

const initialState: AuthState = {
  user: undefined,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authHydrate(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isHydrated = true;
    },
    authLogin(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isHydrated = true;
    },
    authLogout(state) {
      state.user = null;
      state.isHydrated = true;
    },
  },
});

export const { authHydrate, authLogin, authLogout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
import { RootState } from '../store';

export const selectAuthUser = (state: RootState) => state.auth.user as AuthUser | null;
export const selectIsAuthenticated = (state: RootState) => state.auth.user === undefined ? null : !!state.auth.user;
export const selectRole = (state: RootState) => state.auth.user?.role as UserRole | undefined;
export const selectIsHydrated = (state: RootState) => state.auth.isHydrated;
