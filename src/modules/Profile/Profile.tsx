import {FC} from 'react';

import {Tabs, TabsStyleAttributes} from 'shared/components/Tabs';

import {Notifications} from './Notifications';
import {PersonalData} from './PersonalData';
import s from './Profile.module.scss';
import {Safeness} from './Safeness';

export const Profile: FC = () => {
  return (
    <>
      <div className={s.profile}>
        <h1 className={s.profile__heading}>Настройка профиля</h1>
        <Tabs
          className={s.profile__tabs}
          tabsStyle={TabsStyleAttributes.profile}
          tabs={[
            {
              name: 'Личные данные',
              content: <PersonalData />,
              pathRoute: '',
            },
            {
              name: 'Уведомления',
              content: <Notifications />,
              pathRoute: 'notifications',
            },
            {
              name: 'Безопасность',
              content: <Safeness />,
              pathRoute: 'safeness',
            },
          ]}
        />
      </div>
    </>
  );
};
