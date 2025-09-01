import { baseApi } from './baseApi';
import { DoctorScheduleType } from '@/types';

export const DoctorScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createDoctorSchedule: builder.mutation({
      query: (scheduleData) => ({
        url: '/doctor-schedules',
        method: 'POST',
        body: scheduleData,
      }),
      invalidatesTags: ['DoctorSchedule'],
    }),

    getAllDoctorSchedules: builder.query<DoctorScheduleType[], void>({
      query: () => '/doctor-schedules',
      providesTags: ['DoctorSchedule'],
    }),

    getAllSchedulesByDoctorId: builder.query<DoctorScheduleType[], string>({
      query: (doctorId) => `/doctor-schedules/doctor/${doctorId}`,
      providesTags: ['DoctorSchedule' , 'Appointments'],
    }),

  }),
});

export const {
  useCreateDoctorScheduleMutation,
  useGetAllDoctorSchedulesQuery,
  useGetAllSchedulesByDoctorIdQuery
} = DoctorScheduleApi;

