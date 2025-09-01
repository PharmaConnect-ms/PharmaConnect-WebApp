import { baseApi } from './baseApi';
import { ConditionBooksResponse, ConditionBookPayload } from '@/types';

export const ConditionBooksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllConditionBooksByPatientId: builder.query<ConditionBooksResponse[], string>({
      query: (patientId) => `/condition-books/patient/${patientId}`,
      providesTags: ['ConditionBooks'],
    }),

    createConditionBook: builder.mutation<ConditionBooksResponse, ConditionBookPayload>({
      query: (payload) => ({
        url: '/condition-books',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ConditionBooks'],
    }),

    getConditionBookById: builder.query<ConditionBooksResponse, string>({
      query: (id) => `/condition-books/${id}`,
      providesTags: ['ConditionBooks'],
    }),

  }),
});

export const {
    useGetAllConditionBooksByPatientIdQuery,
    useCreateConditionBookMutation,
    useGetConditionBookByIdQuery
} = ConditionBooksApi;

