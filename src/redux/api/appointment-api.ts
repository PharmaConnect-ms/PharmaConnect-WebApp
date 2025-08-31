import { baseApi } from './baseApi';
import { AppointmentResponse } from '@/types';

export const AppointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAppointmentById: builder.query<AppointmentResponse, string>({
      query: (id) => `/appointments/${id}`,
    }),

  }),
});

export const {
    useGetAppointmentByIdQuery
} = AppointmentApi;

