import classNames from 'classnames';
import {FC} from 'react';

import {HeaderDropdown} from 'shared/layouts/Base/Header/HeaderDropdown';

import s from './UserBar.module.scss';

import {ButtonLock} from '../ButtonLock';
import {NotificationDropdown} from '../NotificationDropdown';

interface UserBarProps {
  className?: string;
}

const UserBar: FC<UserBarProps> = ({className}) => {
  return (
    <div className={classNames(s.userBar, className)}>
      <div className={s.userBar__group}>
        <ButtonLock />
        <NotificationDropdown />
        <HeaderDropdown className={s.userBar__info} />
      </div>
    </div>
  );
};

export {UserBar};
