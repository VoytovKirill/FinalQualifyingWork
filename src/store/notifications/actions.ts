import {createAsyncThunk} from '@reduxjs/toolkit';

import {notificationsService} from 'api';

export const loadNotifications = createAsyncThunk('notifications/getNotifications', async () => {
  const response = await notificationsService.getNotifications();
  return response.data;
});

export const notificationsAsyncActions = {
  loadNotifications,
};
