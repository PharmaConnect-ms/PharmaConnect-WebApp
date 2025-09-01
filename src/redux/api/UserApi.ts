import { baseApi } from './baseApi';
import { UserResponse } from '@/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getUserById: builder.query<UserResponse, string | number>({
      query: (id) => `/users/${id}`,
      providesTags: ['User' , 'prescription'],
    }),

    getPatientByUserId: builder.query<UserResponse, string | number>({
      query: (id) => `/users/patient/${id}`,
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<UserResponse, { id: string | number; data: Partial<UserResponse> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
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
