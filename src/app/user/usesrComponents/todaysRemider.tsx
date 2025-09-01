'use client';

import React, { useMemo } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationImportant as ImportantIcon,
  Today as TodayIcon,
  Schedule as UpcomingIcon,
  History as PastIcon
} from '@mui/icons-material';
import { useTodaysReminder } from "../logic/use-todays-reminder";
import { NotificationInterface, NotificationStatus, } from "@/types/notification-types";
import NotificationCard from "@/components/NotificationCard";
import EmptyReminderState from "@/components/EmptyReminderState";
import EmptyPastReminders from "@/components/EmptyPastReminders";

const TodaysReminder = () => {
  const {
    notifications,
    loadingNotifications,
    errorLoadingNotifications,
    updateNotification,
    isUpdatingNotification
  } = useTodaysReminder();

  const [activeTab, setActiveTab] = React.useState(0);

  // Filter and categorize notifications
  const { todaysNotifications, upcomingNotifications, pastNotifications, allActiveCount } = useMemo(() => {
    if (!notifications?.length) {
      return { todaysNotifications: [], upcomingNotifications: [], pastNotifications: [], allActiveCount: 0 };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const activeNotifications = notifications.filter(
      (notification: NotificationInterface) => notification.status === NotificationStatus.ACTIVE
    );

    const pastNotifications = notifications.filter((notification: NotificationInterface) => {
      return notification.status === NotificationStatus.FIRED ||
             notification.status === NotificationStatus.EXPIRED ||
             notification.status === NotificationStatus.CANCELLED;
    });

    const todaysReminders = activeNotifications.filter((notification: NotificationInterface) => {
      const reminderDate = new Date(notification.reminderTime);
      const reminderDay = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
      return reminderDay.getTime() === today.getTime();
    });

    const upcomingReminders = activeNotifications.filter((notification: NotificationInterface) => {
      const reminderDate = new Date(notification.reminderTime);
      const reminderDay = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
      return reminderDay.getTime() >= tomorrow.getTime();
    });

    return {
      todaysNotifications: todaysReminders,
      upcomingNotifications: upcomingReminders,
      pastNotifications: pastNotifications,
      allActiveCount: activeNotifications.length
    };
  }, [notifications]);

  const handleMarkAsCompleted = async (notificationId: number) => {
    try {
      await updateNotification({
        id: notificationId,
        status: NotificationStatus.FIRED
      }).unwrap();
    } catch (error) {
      console.error('Failed to update notification:', error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getCurrentTabNotifications = () => {
    switch (activeTab) {
      case 0:
        return todaysNotifications;
      case 1:
        return upcomingNotifications;
      case 2:
        return pastNotifications;
      default:
        return [];
    }
  };

  const renderNotificationsList = (notificationsList: NotificationInterface[]) => {
    if (notificationsList.length === 0) {
      // Show different empty states based on the active tab
      const tabTypes = ['today', 'upcoming', 'past'] as const;
      const currentTabType = tabTypes[activeTab] || 'today';
      
      if (currentTabType === 'past') {
        return <EmptyPastReminders tabType="past" />;
      } else if (currentTabType === 'upcoming') {
        return <EmptyPastReminders tabType="upcoming" />;
      }
      return <EmptyReminderState />;
    }

    // Sort notifications by reminder time (most recent first for past notifications)
    const sortedNotifications = [...notificationsList].sort((a, b) => {
      if (activeTab === 2) { // Past notifications - most recent first
        return new Date(b.reminderTime).getTime() - new Date(a.reminderTime).getTime();
      }
      // Active notifications - earliest first
      return new Date(a.reminderTime).getTime() - new Date(b.reminderTime).getTime();
    });

    return (
      <Box sx={{ mt: 2 }}>
        {sortedNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsCompleted}
            isUpdating={isUpdatingNotification}
          />
        ))}
      </Box>
    );
  };

  return (
    <div className="flex flex-col gap-6 mt-8 bg-white shadow-lg rounded-xl p-8 pt-3 w-full max-h-[450px] overflow-y-auto">

      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <NotificationsIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" component="h2" fontWeight="600">
            Reminders
          </Typography>
        </Box>

        {allActiveCount > 0 && (
          <Badge
            badgeContent={allActiveCount}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                minWidth: '20px',
                height: '20px'
              }
            }}
          >
            <ImportantIcon color="action" />
          </Badge>
        )}
      </Box>

      {/* Loading State */}
      {loadingNotifications && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Error State */}
      {errorLoadingNotifications && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          Failed to load reminders. Please try refreshing the page.
        </Alert>
      )}

      {/* Content */}
      {!loadingNotifications && !errorLoadingNotifications && (
        <>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48
                }
              }}
            >
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <TodayIcon sx={{ fontSize: 18 }} />
                    Today
                    {todaysNotifications.length > 0 && (
                      <Badge
                        badgeContent={todaysNotifications.length}
                        color="error"
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <UpcomingIcon sx={{ fontSize: 18 }} />
                    Upcoming
                    {upcomingNotifications.length > 0 && (
                      <Badge
                        badgeContent={upcomingNotifications.length}
                        color="info"
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <PastIcon sx={{ fontSize: 18 }} />
                    Past
                    {pastNotifications.length > 0 && (
                      <Badge
                        badgeContent={pastNotifications.length}
                        color="default"
                      />
                    )}
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {/* Notifications List */}
          <Box
            flex={1}
            sx={{
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'grey.100',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.400',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'grey.500',
                },
              },
            }}
          >
            {renderNotificationsList(getCurrentTabNotifications())}
          </Box>
        </>
      )}
    </div>
  );
};

export default TodaysReminder;

