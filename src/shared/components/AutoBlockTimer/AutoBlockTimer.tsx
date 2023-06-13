import {useContext, useEffect} from 'react';
import {useIdleTimer} from 'react-idle-timer';
import {useSelector} from 'react-redux';

import {Roles} from 'shared/constants/roles';
import {SignalrMessages} from 'shared/constants/signalrMessages';
import {SignalrContext} from 'shared/utils/signalr/provider';
import {useRootSelector, profileSelectors, usersSelectors} from 'store';

export const AutoBlockTimer = () => {
  const isScreenLockEnabled = useSelector(profileSelectors.getIsScreenLockEnabled);
  const role = useRootSelector(usersSelectors.getRole);
  const signalr = useContext(SignalrContext);
  const isUser = [Roles.admin, Roles.superAdmin, Roles.manager, Roles.lockedScreenUser].includes(role);

  async function screenLock() {
    if (signalr) {
      await signalr.invoke(SignalrMessages.SET_SCREEN_LOCK);
    }
  }

  const onIdle = () => {
    if (role !== Roles.lockedScreenUser) screenLock();
  };

  const {start} = useIdleTimer({
    crossTab: true,
    onIdle,
    timeout: 5 * 60 * 1000,
    stopOnIdle: true,
    startManually: true,
  });

  useEffect(() => {
    if (isScreenLockEnabled && isUser) {
      start();
    }
  }, [role, isScreenLockEnabled]);

  return null;
};
