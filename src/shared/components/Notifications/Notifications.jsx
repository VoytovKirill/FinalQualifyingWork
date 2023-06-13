import {useEffect} from 'react';

import {
  useRootSelector,
  useRootDispatch,
  profileAsyncActions,
  profileSelectors,
  notificationsAsyncActions,
  usersSelectors,
} from 'store';

export const Notifications = () => {
  const isReceiveSiteNotifications = useRootSelector(profileSelectors.getIsReceiveSiteNotifications);
  const isAuthorizedUser = useRootSelector(usersSelectors.getIsAuthorizedUser);
  const dispatch = useRootDispatch();

  useEffect(() => {
    if (isAuthorizedUser) dispatch(profileAsyncActions.getSettingsNotification());
  }, [isAuthorizedUser]);

  useEffect(() => {
    if (isReceiveSiteNotifications) {
      dispatch(notificationsAsyncActions.loadNotifications());
    }
  }, [isReceiveSiteNotifications]);

  return null;
};
