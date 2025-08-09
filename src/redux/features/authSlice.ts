'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'doctor' | 'user';

export type AuthUser = {
  role: UserRole;
  name: string;
  userID: string;
  token: string;
};

type AuthState = {
  user: AuthUser | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authHydrate(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    authLogin(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    authLogout(state) {
      state.user = null;
    },
  },
});

export const { authHydrate, authLogin, authLogout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuthUser = (state: any) => state.auth.user as AuthUser | null;
export const selectIsAuthenticated = (state: any) => !!state.auth.user;
export const selectRole = (state: any) => state.auth.user?.role as UserRole | undefined;
