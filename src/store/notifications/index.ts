import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {NotificationDto} from 'api/dto/Notification';

import {notificationsAsyncActions} from './actions';

type NotificationsSliceState = {
  notifications: NotificationDto[] | null;
  hasUnread: boolean;
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {notifications: null, hasUnread: false} as NotificationsSliceState,
  reducers: {
    readNotification(state, action: PayloadAction<number>) {
      if (!state.notifications) return;
      const index = state.notifications.findIndex((notification) => notification.id === action.payload);
      if (index >= 0) {
        const updatedNotifications = [...state.notifications];
        updatedNotifications[index].isRead = true;
        state.notifications = updatedNotifications;
      }
    },
    deleteNotification(state, action: PayloadAction<number>) {
      if (!state.notifications) return;
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
    markAsRead(state) {
      state.hasUnread = false;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(notificationsAsyncActions.loadNotifications.fulfilled, (state, action: any) => {
      state.notifications = action.payload;
      if (action.payload.every((notification: NotificationDto) => notification.isRead)) {
        state.hasUnread = false;
      } else {
        state.hasUnread = true;
      }
    }),
});

export const {
  actions: notificationsActions,
  caseReducers: notificationsCaseReducer,
  reducer: notificationsReducer,
} = notificationsSlice;

export {notificationsAsyncActions};
