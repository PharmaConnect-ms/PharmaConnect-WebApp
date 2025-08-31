import { baseApi } from './baseApi';
import { ConditionBooksResponse, ConditionBookPayload } from '@/types';

export const ConditionBooksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllConditionBooksByPatientId: builder.query<ConditionBooksResponse[], string>({
      query: (patientId) => `/condition-books/patient/${patientId}`,
    }),

    createConditionBook: builder.mutation<ConditionBooksResponse, ConditionBookPayload>({
      query: (payload) => ({
        url: '/condition-books',
        method: 'POST',
        body: payload,
      }),
    }),

  }),
});

export const {
    useGetAllConditionBooksByPatientIdQuery,
    useCreateConditionBookMutation
} = ConditionBooksApi;

