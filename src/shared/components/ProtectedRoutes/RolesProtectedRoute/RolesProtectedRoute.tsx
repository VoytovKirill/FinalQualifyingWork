import {FC, useEffect} from 'react';
import {Navigate, Outlet} from 'react-router';

import {BlockedScreen} from 'shared/components/BlockedScreen';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {useRootDispatch, profileSelectors, usersSelectors, useRootSelector} from 'store';
import {authAsyncActions} from 'store/auth';

interface RolesAuthRouteProps {
  roles: Roles[];
  toPath?: string;
}

export const RolesProtectedRoute: FC<RolesAuthRouteProps> = ({roles, toPath = routes.notFoundPage}) => {
  const dispatch = useRootDispatch();
  const role = useRootSelector(usersSelectors.getRole);
  const isAuth = !!useRootSelector(usersSelectors.getUserToken);
  const isBlocked = useRootSelector(profileSelectors.getIsScreenLock);

  useEffect(() => {
    if (!isAuth) {
      dispatch(authAsyncActions.refreshToken());
    }
  }, []);

  return (
    <>
      {role === Roles.guest && isAuth && !isBlocked && <Navigate to={routes.auth} />}
      {!roles.includes(role) && role !== Roles.guest && isAuth && !isBlocked && <Navigate to={toPath} />}
      {roles.includes(role) && isAuth && !isBlocked && <Outlet />}
      {isBlocked && <BlockedScreen />}
    </>
  );
};
