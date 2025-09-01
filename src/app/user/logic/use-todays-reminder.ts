'use client';
import { selectAuthUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import { useGetAllNotificationsByUserIdQuery , useUpdateNotificationMutation } from "@/redux/api/notification-api";

export const useTodaysReminder = () => {
  const user = useSelector(selectAuthUser);
  const { data: notifications , isLoading: loadingNotifications , isError: errorLoadingNotifications } = useGetAllNotificationsByUserIdQuery(user?.userID ?? "");
  const [updateNotification , { isLoading: isUpdatingNotification }] = useUpdateNotificationMutation();

  return {
    notifications,
    loadingNotifications,
    errorLoadingNotifications,
    isUpdatingNotification,
    updateNotification
  };
};
