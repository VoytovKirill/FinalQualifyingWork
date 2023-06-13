import {FC, useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router';

import {Loader} from 'shared/components/Loader';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {decodeJWT} from 'shared/utils/decodingJWT/decodingJWT';
import {useRootDispatch, usersSelectors, authAsyncActions, useRootSelector} from 'store';

import s from './DomainProtectedRoute.module.scss';

export const DomainProtectedRoute: FC = () => {
  const dispatch = useRootDispatch();
  const role = useRootSelector(usersSelectors.getRole);
  const isAuth = !!useRootSelector(usersSelectors.getUserToken);
  const [isLoading, setIsLoading] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const authorizedUsersRoles = [Roles.admin, Roles.manager, Roles.superAdmin];

  useEffect(() => {
    if (!isAuth) {
      dispatch(authAsyncActions.refreshToken())
        .then((res) => {
          const token = res.payload?.accessToken;
          const role = decodeJWT(token).role;
          if (token && role != Roles.lockedScreenUser) {
            setShowPage(false);
          } else {
            setShowPage(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <>
      {isLoading && (
        <div className={s.container}>
          <Loader />
        </div>
      )}
      {authorizedUsersRoles.includes(role) && <Navigate to={routes.home} />}
      {(role === Roles.guest || role === Roles.user) && <Navigate to={routes.authSecondary} />}
      {!isLoading && showPage && <Outlet />}
    </>
  );
};
