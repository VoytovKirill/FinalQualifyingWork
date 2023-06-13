import {RootState} from 'store';

const getNotifications = (state: RootState) => state.notifications.notifications;
const getHasUnreadNotifications = (state: RootState) => state.notifications.hasUnread;

export const notificationsSelectors = {
  getNotifications,
  getHasUnreadNotifications,
};
