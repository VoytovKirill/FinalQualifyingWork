import {useEffect, useState} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {SignalrMessages} from 'shared/constants/signalrMessages';
import {useSignalr} from 'shared/utils/signalr';
import {useRootSelector, profileSelectors} from 'store';

import s from '../UserBar/UserBar.module.scss';

export const ButtonLock = () => {
  const isScreenLockEnabled = useRootSelector(profileSelectors.getIsScreenLockEnabled);
  const [isDisabled, setIsDisabled] = useState(!isScreenLockEnabled);
  const signalr = useSignalr();

  useEffect(() => {
    setIsDisabled(!isScreenLockEnabled);
  }, [isScreenLockEnabled]);

  async function screenLock() {
    if (signalr) await signalr.invoke(SignalrMessages.SET_SCREEN_LOCK);
  }

  return (
    <Button
      disabled={isDisabled}
      onClick={screenLock}
      variants={[ButtonStyleAttributes.icon, ButtonStyleAttributes.lock]}
      icon={<Icon className={s.userBar__notificationIcon} fill width={24} height={24} name="lock" />}
    />
  );
};
