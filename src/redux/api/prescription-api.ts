import { baseApi } from './baseApi';
import { PrescriptionResponse, CreatePrescriptionPayload } from '@/types';

export const PrescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getPrescriptionByUserId: builder.query<PrescriptionResponse[], string>({
      query: (userId) => `/prescriptions/user/${userId}`,
    }),

    addPrescription: builder.mutation<PrescriptionResponse, CreatePrescriptionPayload>({
      query: (newPrescription) => ({
        url: '/prescriptions',
        method: 'POST',
        body: newPrescription,
      }),
    }),

  }),
});

export const {
  useGetPrescriptionByUserIdQuery,
  useAddPrescriptionMutation
} = PrescriptionApi;

