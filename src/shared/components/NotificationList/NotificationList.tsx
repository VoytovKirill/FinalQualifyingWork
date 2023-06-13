import classNames from 'classnames';
import {createRef, FC, useRef, useEffect, useState} from 'react';

import {notificationsService} from 'api';
import {NotificationDto} from 'api/dto/Notification';
import {useRootDispatch, notificationsActions} from 'store';

import {NotificationItem} from './NotificationItem';
import s from './NotificationList.module.scss';

interface NotificationProps {
  notifications: NotificationDto[];
}

export const NotificationList: FC<NotificationProps> = ({notifications}) => {
  const notificationListRef = useRef<HTMLDivElement>(null);
  const [unreadNotificationsId, setUnreadNotificationsId] = useState<number[]>([]);
  const [idSentRequests, setIdSentRequests] = useState<number[]>([]);
  const dispatch = useRootDispatch();
  const notificationItemsRef = notifications.map(() => createRef<HTMLDivElement>());

  useEffect(() => {
    handleScroll();
  }, [notifications]);

  useEffect(() => {
    if (unreadNotificationsId.length) readNotifications();
    if (notifications.every((notification) => notification.isRead)) {
      dispatch(notificationsActions.markAsRead());
    }
  }, [unreadNotificationsId]);

  const readNotifications = async () => {
    for (const id of unreadNotificationsId) {
      if (!idSentRequests.includes(id)) {
        setIdSentRequests((prev) => [...prev, id]);
        try {
          await notificationsService.readNotification(id);
          await dispatch(notificationsActions.readNotification(id));
        } catch (err) {
          console.error(err);
        }
      }
    }
    setUnreadNotificationsId([]);
    setIdSentRequests([]);
  };

  const handleScroll = () => {
    const notificationsList = notificationListRef.current;
    if (!notificationsList) return;

    const listScrollTop = notificationsList.scrollTop;
    const visibleHeight = notificationsList.offsetHeight;
    let startIndex = 0;
    let endIndex = notifications.length - 1;

    for (let i = 0; i < notifications.length; i++) {
      const notification = notificationItemsRef[i].current;
      if (!notification) return;

      const notificationBottom = notification.offsetTop + notification.offsetHeight;
      const currentVisibleHeight = listScrollTop + visibleHeight;

      const isNotificationInView = notificationBottom <= currentVisibleHeight;
      const isNotificationAbove = notification.offsetTop >= listScrollTop;

      if (isNotificationAbove && isNotificationInView) {
        startIndex = i;
        break;
      }
    }

    for (let i = startIndex; i < notifications.length; i++) {
      const notification = notificationItemsRef[i].current;
      if (!notification) return;

      const notificationBottom = notification.offsetTop + notification.offsetHeight;
      const currentVisibleHeight = listScrollTop + visibleHeight;

      if (notificationBottom > currentVisibleHeight) {
        endIndex = i - 1;
        break;
      }
      if (i === notifications.length - 1) {
        endIndex = i;
      }
    }

    for (let i = startIndex; i <= endIndex; i++) {
      if (!unreadNotificationsId.includes(notifications[i].id) && !notifications[i].isRead) {
        setUnreadNotificationsId((prev) => [...prev, notifications[i].id]);
      }
    }
  };

  return (
    <div className={classNames(s.menuNotifications)}>
      <div className={s.menuNotifications__box}>
        <h6 className={s.menuNotifications__title}>Уведомления</h6>
        <div ref={notificationListRef} onScroll={handleScroll} className={s.menuNotifications__list}>
          {notifications.map((item, index) => (
            <NotificationItem
              key={item.id}
              active={item.isRead}
              description={item.description}
              createdDateTime={item.createdDateTime}
              id={item.id}
              ref={notificationItemsRef[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
