import { baseApi } from './baseApi';
import { UserResponse } from '@/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getUserById: builder.query<UserResponse, string | number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    getPatientByUserId: builder.query<UserResponse, string | number>({
      query: (id) => `/users/patient/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

  }),
});

export const {
    useGetUserByIdQuery,
    useGetPatientByUserIdQuery
} = userApi;
