import { baseApi } from './baseApi';
import { AppointmentResponse , AppointmentPayload } from '@/types';

export const AppointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAppointmentById: builder.query<AppointmentResponse, string>({
      query: (id) => `/appointments/${id}`,
      providesTags: ['Appointments'],
    }),

    createAnAppointment: builder.mutation<AppointmentResponse, AppointmentPayload>({
      query: (payload) => ({
        url: '/appointments',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Appointments'],
    }),

    getAllAppointmentsByUserId: builder.query<AppointmentResponse[], string>({
      query: (userId) => `/appointments/user/${userId}`,
      providesTags: ['Appointments'],
    }),

  }),
});

export const {
    useGetAppointmentByIdQuery,
    useCreateAnAppointmentMutation,
    useGetAllAppointmentsByUserIdQuery
} = AppointmentApi;

