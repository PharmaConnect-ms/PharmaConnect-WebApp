import { baseApi } from './baseApi';
import { CreateFamilyMember , CreateCareProfile , CareProfile, FamilyMember } from '@/types';

export const FamilyProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({ 

    createFamilyMember: builder.mutation<FamilyMember, CreateFamilyMember>({
      query: (newMember) => ({
        url: '/family-profile/members',
        method: 'POST',
        body: newMember,
      }),
        invalidatesTags: ['FamilyProfile'],
    }),

    createCareProfile: builder.mutation<CareProfile, CreateCareProfile>({
      query: (newProfile) => ({
        url: '/family-profile/care-profiles',
        method: 'POST',
        body: newProfile,
      }),
      invalidatesTags: ['FamilyProfile'],
    }),

    getAllFamilyMembers: builder.query<FamilyMember[], string>({
      query: (userId) => ({
        url: `/family-profile/members/list/${userId}`,
        method: 'GET',
      }),
      providesTags: ['FamilyProfile'],
    }),

    getFamilyMemberById: builder.query<FamilyMember, string>({
      query: (memberId) => ({
        url: `/family-profile/members/${memberId}/details`,
        method: 'GET',
      }),
      providesTags: ['FamilyProfile'],
    }),

    getCareProfileById: builder.query<CareProfile, string>({
      query: (memberId) => ({
        url: `/family-profile/members/${memberId}/care-profiles`,
        method: 'GET',
      }),
      providesTags: ['FamilyProfile'],
    }),

    updateFamilyMember: builder.mutation<FamilyMember, { memberId: string; updatedData: Partial<CreateFamilyMember> }>({
      query: ({ memberId, updatedData }) => ({
        url: `/family-profile/members/${memberId}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['FamilyProfile'],
    }),

    }),
});

export const {
    useCreateFamilyMemberMutation,
    useCreateCareProfileMutation,
    useGetAllFamilyMembersQuery,
    useGetFamilyMemberByIdQuery,
    useGetCareProfileByIdQuery,
    useUpdateFamilyMemberMutation,
} = FamilyProfileApi;

