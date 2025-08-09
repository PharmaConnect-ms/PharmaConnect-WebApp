import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { usernameOrEmail: string; password: string }>({
      query: (payload) => ({
        url: '/auth/login',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<any, { username: string; email: string; password: string }>({
      query: (payload) => ({
        url: '/users/register',
        method: 'POST',
        body: payload,
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getProfile: builder.query<any, void>({
      query: () => '/auth/profile',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApi;
