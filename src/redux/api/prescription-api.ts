import { baseApi } from './baseApi';
import { PrescriptionResponse, CreatePrescriptionPayload } from '@/types';

export const PrescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getPrescriptionByUserId: builder.query<PrescriptionResponse[], string>({
      query: (userId) => `/prescription/user/${userId}`,
      providesTags: ['prescription']
    }),

    addPrescription: builder.mutation<PrescriptionResponse, CreatePrescriptionPayload>({
      query: (newPrescription) => {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', newPrescription.file);
        formData.append('patientName', newPrescription.patientName);
        formData.append('doctorId', newPrescription.doctorId.toString());
        formData.append('patientId', newPrescription.patientId.toString());

        // Debug logging
        console.log('FormData contents:');
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value instanceof File ? 
            `File(${value.name}, ${value.size}bytes, ${value.type})` : 
            value
          );
        }

        return {
          url: '/prescription/add-prescription',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['prescription']
    }),

  }),
});

export const {
  useGetPrescriptionByUserIdQuery,
  useAddPrescriptionMutation
} = PrescriptionApi;

