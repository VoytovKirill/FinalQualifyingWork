import classNames from 'classnames';
import {useState, useRef} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {NotificationList} from 'shared/components/NotificationList';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';
import {notificationsSelectors, profileSelectors, useRootSelector} from 'store';

import s from '../UserBar/UserBar.module.scss';

const NotificationDropdown = () => {
  const isReceiveSiteNotifications = useRootSelector(profileSelectors.getIsReceiveSiteNotifications);
  const notifications = useRootSelector(notificationsSelectors.getNotifications);
  const hasUnreadNotifications = useRootSelector(notificationsSelectors.getHasUnreadNotifications);
  const [isShowNotifications, setIsShowNotifications] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(notificationDropdownRef, () => setIsShowNotifications(false));

  const handleClick = () => {
    setIsShowNotifications((prev) => !prev);
  };

  return (
    <div ref={notificationDropdownRef} className={s.userBar}>
      <div
        className={classNames(s.userBar__notification, {
          [s.userBar__notificationDisabled]: !isReceiveSiteNotifications,
        })}
      >
        <Button
          disabled={!isReceiveSiteNotifications}
          variants={[ButtonStyleAttributes.icon]}
          icon={<Icon className={s.userBar__notificationIcon} fill width={24} height={24} name="notification" />}
          onClick={handleClick}
        />
        {isReceiveSiteNotifications && hasUnreadNotifications && <span className={s.userBar__notificationSign} />}
      </div>
      {isShowNotifications && <NotificationList notifications={notifications ?? []} />}
    </div>
  );
};

export {NotificationDropdown};
