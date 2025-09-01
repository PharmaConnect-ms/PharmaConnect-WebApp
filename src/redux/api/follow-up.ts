import { baseApi } from './baseApi';
import { CreateFollowUpRequest , FollowUpResponse } from '@/types';

export const FollowUpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createFollowUp: builder.mutation<FollowUpResponse, CreateFollowUpRequest>({
      query: (body) => ({
        url: '/follow-up',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FollowUps'],
    }),

    getFollowUpsByBookId: builder.query<FollowUpResponse[], string>({
      query: (bookId) => `/follow-up/book/${bookId}`,
      providesTags: ['FollowUps'],
    }),

  }),
});

export const {
  useCreateFollowUpMutation,
  useGetFollowUpsByBookIdQuery,
} = FollowUpApi;
