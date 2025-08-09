import { baseApi } from './baseApi';

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPatients: builder.query<any[], void>({
      query: () => '/patients',
      providesTags: ['Patient'],
    }),
    getPatientById: builder.query<any, string | number>({
      query: (id) => `/patients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),
    createPatient: builder.mutation<any, { name: string; email: string; phone: string; dob?: string }>({
      query: (data) => ({
        url: '/patients',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Patient'],
    }),
    updatePatient: builder.mutation<any, { id: string | number; data: Partial<{ name: string; email: string; phone: string; dob: string }> }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Patient', id }],
    }),
    deletePatient: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Patient'],
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi;
