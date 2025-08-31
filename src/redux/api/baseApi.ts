'use client';

import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { authLogout } from '../features/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.user?.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
    
    // Don't set Content-Type for file uploads, let browser set it with boundary
    // RTK Query will handle FormData automatically
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token is expired or invalid, logout the user
    api.dispatch(authLogout());
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Patient', 'Auth', 'User', 'DoctorSchedule', 'TimeSlot', 'prescription'],
  endpoints: () => ({}),
});
