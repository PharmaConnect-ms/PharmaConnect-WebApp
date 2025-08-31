import { baseApi } from './baseApi';
import { TimeSlotInterface } from '@/types';

export const TimeSlotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllTimeSlotsBySchedulerId: builder.query<TimeSlotInterface[], string>({
      query: (schedulerId) => `/time-slots/scheduler/${schedulerId}`,
      providesTags: ['TimeSlot'],
    }),

  }),
});

export const {
    useGetAllTimeSlotsBySchedulerIdQuery,

} = TimeSlotsApi;

