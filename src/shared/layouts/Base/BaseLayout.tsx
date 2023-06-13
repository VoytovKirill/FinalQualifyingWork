import classNames from 'classnames';
import {Outlet} from 'react-router';

import s from './BaseLayout.module.scss';
import {Header} from './Header';

export const BaseLayout = () => {
  return (
    <div className={classNames(s.screen, 'box')}>
      <Header />
      <Outlet />
    </div>
  );
};
