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

    updateUser: builder.mutation<UserResponse, { id: string | number; data: Partial<UserResponse> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    getAllDoctors: builder.query<UserResponse[], void>({
      query: () => `/users/get-all-doctors`,
      providesTags: () => [{ type: 'User', id: 'LIST' }],
    }),

  }),
});

export const {
    useGetUserByIdQuery,
    useGetPatientByUserIdQuery,
    useUpdateUserMutation,
    useGetAllDoctorsQuery
} = userApi;
