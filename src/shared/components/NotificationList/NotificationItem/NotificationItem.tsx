import classNames from 'classnames';
import dayjs from 'dayjs';
import {ForwardedRef, forwardRef, RefObject} from 'react';

import {notificationsService} from 'api';
import {Button} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {useRootDispatch, notificationsActions} from 'store';

import s from './NotificationItem.module.scss';

interface NotificationItemProps {
  active: boolean;
  description: string;
  createdDateTime: string;
  id: number;
  ref?: RefObject<HTMLDivElement>;
}

export const NotificationItem = forwardRef((props: NotificationItemProps, ref?: ForwardedRef<HTMLDivElement>) => {
  const {active, description, createdDateTime, id} = props;
  const dispatch = useRootDispatch();

  const deleteNotification = async () => {
    try {
      await notificationsService.deleteNotification(id);
      dispatch(notificationsActions.deleteNotification(id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={ref} className={classNames(s.menuNotifications__item, {[`${s.menuNotifications__itemActive}`]: !active})}>
      <span className={s.menuNotifications__text}>{description}</span>
      <span className={s.menuNotifications__date}>{dayjs(createdDateTime).locale('ru').format('DD MMMM в HH:mm')}</span>
      <Button
        className={s.menuNotifications__close}
        icon={<Icon className={s.userBar__notificationIcon} stroke width={12} height={12} name="cross" />}
        onClick={deleteNotification}
      />
    </div>
  );
});
