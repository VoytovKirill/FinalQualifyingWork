import classNames from 'classnames';
import {FC} from 'react';
import {useSelector} from 'react-redux';
import {NavLink, useLocation} from 'react-router-dom';

import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {usersSelectors} from 'store';

import s from './Navigation.module.scss';

interface NavigationProps {
  className?: string;
}

const Navigation: FC<NavigationProps> = ({className}) => {
  const role = useSelector(usersSelectors.getRole);
  const isAdmin = role === Roles.admin;
  const isSuperAdmin = role === Roles.superAdmin;
  const isManager = role === Roles.manager;
  const location = useLocation();
  const isAllFundsActive = location?.state?.pageName === 'fonds';
  const isTrackedFundsActive = location?.state?.pageName === 'tracked';

  return (
    <nav className={classNames(s.nav, className)}>
      <ul className={s.nav__list}>
        {(isAdmin || isSuperAdmin || isManager) && (
          <li className={s.nav__item}>
            <NavLink
              className={({isActive}) =>
                classNames(s.nav__link, {[s.nav__link_active]: !isTrackedFundsActive && (isActive || isAllFundsActive)})
              }
              to={routes.allFunds}
            >
              Все фонды
            </NavLink>
          </li>
        )}
        {(isAdmin || isSuperAdmin || isManager) && (
          <li className={s.nav__item}>
            <NavLink
              className={({isActive}) =>
                classNames(s.nav__link, {[s.nav__link_active]: isActive || isTrackedFundsActive})
              }
              to={routes.tracked}
            >
              Отслеживаемые
            </NavLink>
          </li>
        )}
        {(isAdmin || isSuperAdmin) && (
          <li className={s.nav__item}>
            <NavLink
              className={({isActive}) => classNames(s.nav__link, {[s.nav__link_active]: isActive})}
              to={routes.data}
            >
              Данные
            </NavLink>
          </li>
        )}
        {isSuperAdmin && (
          <li className={s.nav__item}>
            <NavLink
              className={({isActive}) => classNames(s.nav__link, {[s.nav__link_active]: isActive})}
              to={routes.roles}
            >
              Роли
            </NavLink>
          </li>
        )}
        {isSuperAdmin && (
          <li className={s.nav__item}>
            <NavLink
              className={({isActive}) => classNames(s.nav__link, {[s.nav__link_active]: isActive})}
              to={routes.events}
            >
              События
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export {Navigation};
