import { baseApi } from './baseApi';
import { BookEntryResponse , CreateBookEntry} from '@/types';

export const BookEntryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

  createBookEntry: builder.mutation<BookEntryResponse, CreateBookEntry>({
    query: (payload) => ({
      url: '/book-entry',
      method: 'POST',
      body: payload,
    }),
    invalidatesTags: ['bookEntry'],
  }),

  getBookEntriesByBookId: builder.query<BookEntryResponse[], string>({
    query: (bookId) => `/book-entry/book/${bookId}`,
    providesTags: ['bookEntry'],
  }),

  }),
});

export const {
  useCreateBookEntryMutation,
  useGetBookEntriesByBookIdQuery,
} = BookEntryApi;


