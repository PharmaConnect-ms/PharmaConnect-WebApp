import { baseApi } from './baseApi';
import { NotificationInterface } from '@/types';

export const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllNotificationsByUserId: builder.query<NotificationInterface[], string>({
      query: (userId) => `/notifications/user/${userId}`,
      providesTags: ['Notifications'],
    }),

    getNotificationById: builder.query<NotificationInterface, string>({
      query: (id) => `/notifications/${id}`,
      providesTags: ['Notifications'],
    }),

    updateNotification: builder.mutation<NotificationInterface, Partial<NotificationInterface> & Pick<NotificationInterface, 'id'>>({
      query: (notification) => ({
        url: `/notifications/${notification.id}`,
        method: 'PUT',
        body: notification,
      }),
      invalidatesTags: ['Notifications'],
    }),

  }),
});

export const {
  useGetAllNotificationsByUserIdQuery,
  useGetNotificationByIdQuery,
  useUpdateNotificationMutation
} = NotificationApi;
