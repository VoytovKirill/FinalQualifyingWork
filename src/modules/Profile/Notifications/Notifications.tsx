import {FC} from 'react';
import {useSelector} from 'react-redux';

import {Switch, SwitchStyleAttributes} from 'shared/components/Switch';
import {profileAsyncActions, profileSelectors, useRootDispatch} from 'store';

import s from './Notifications.module.scss';

export const Notifications: FC = () => {
  const emailNotification = useSelector(profileSelectors.getIsReceiveEmailNotifications);
  const siteNotification = useSelector(profileSelectors.getIsReceiveSiteNotifications);
  const dispatch = useRootDispatch();

  const changeSiteNotification = () => {
    const requestOption = {
      isReceiveSiteNotifications: !siteNotification,
      isReceiveEmailNotifications: emailNotification,
    };
    dispatch(profileAsyncActions.putSettingsNotification(requestOption));
  };

  const changeEmailNotification = () => {
    const requestOption = {
      isReceiveSiteNotifications: siteNotification,
      isReceiveEmailNotifications: !emailNotification,
    };
    dispatch(profileAsyncActions.putSettingsNotification(requestOption));
  };
  const renderSwitch = emailNotification !== undefined || siteNotification !== undefined;

  return (
    <div className={s.notifications}>
      <h2>Уведомления</h2>
      {renderSwitch && (
        <>
          <Switch
            leftText="Отображать уведомления на странице"
            initialState={siteNotification}
            styleSwitch={SwitchStyleAttributes.profile}
            onChange={changeSiteNotification}
          />
          <p className={s.notifications__paragraf}>
            Рекомендуем включить уведомления, это позволит вам быть в курсе изменений, внесённых в работу приложения.
          </p>
          <Switch
            styleSwitch={SwitchStyleAttributes.profile}
            leftText="Получать уведомления на электронную почту"
            initialState={emailNotification}
            onChange={changeEmailNotification}
          />
          <p className={s.notifications__paragraf}>
            Все уведомления будут отправлены на вашу корпоративную почту, это позволит отслеживать внесённые изменения
            не находясь в системе.
          </p>
        </>
      )}
    </div>
  );
};
