import {FC, useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router';

import {Loader} from 'shared/components/Loader';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {useRootDispatch, useRootSelector, usersSelectors} from 'store';
import {authAsyncActions} from 'store/auth';

import s from './ApplicationProtectedRoute.module.scss';

export const ApplicationProtectedRoute: FC = () => {
  const dispatch = useRootDispatch();
  const role = useRootSelector(usersSelectors.getRole);
  const isAuth = !!useRootSelector(usersSelectors.getUserToken);
  const [isLoading, setIsLoading] = useState(false);
  const [showPage, setShowPage] = useState(true);

  useEffect(() => {
    if (!isAuth) {
      setIsLoading(true);
      dispatch(authAsyncActions.refreshToken())
        .then((res) => {
          if (res.payload?.accessToken) {
            setShowPage(true);
            setIsLoading(false);
          } else {
            setShowPage(false);
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
      {role === Roles.guest && isAuth && <Navigate to={routes.auth} />}
      {![Roles.user].includes(role) && role !== Roles.guest && isAuth && <Navigate to={routes.allFunds} />}
      {showPage && !isLoading && [Roles.user].includes(role) && <Outlet />}
      {!isLoading && role === Roles.none && <Navigate to={routes.auth} />}
    </>
  );
};
