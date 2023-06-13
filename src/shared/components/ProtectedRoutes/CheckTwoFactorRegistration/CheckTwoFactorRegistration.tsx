import {FC, useEffect, useState} from 'react';
import {Navigate, Outlet, useNavigate} from 'react-router';

import {authService} from 'api';
import {Loader} from 'shared/components/Loader';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {useRootDispatch, usersSelectors, profileSelectors, profileActions, useRootSelector} from 'store';
import {authAsyncActions} from 'store/auth';

import s from './CheckTwoFactorRegistration.module.scss';

export const CheckTwoFactorRegistration: FC = ({}) => {
  const dispatch = useRootDispatch();
  const navigate = useNavigate();
  const role = useRootSelector(usersSelectors.getRole);
  const isAuth = !!useRootSelector(usersSelectors.getUserToken);
  const isReserveCodeCompiling = useRootSelector(profileSelectors.getIsReserveCodeCompiling);
  const isRestoryTfa = useRootSelector(profileSelectors.getIsRestoryTfa);
  const authorizedUsersRoles = [Roles.admin, Roles.manager, Roles.superAdmin];
  const {showToast} = useToast();
  const [isEnabledTFA, setIsEnabledTFA] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPage, setShowPage] = useState(false);
  const isFirstLogin = useRootSelector(profileSelectors.getIsFirstLogin);

  const check = async () => {
    setIsLoading(true);
    if (role === Roles.guest || role === Roles.user) {
      try {
        const response = await authService.check();
        if (response.data) {
          dispatch(profileActions.setIsFirstLogin(response.data.isFirstLogin!));
        }
        if (response.data.isTfaEnabled) {
          navigate(routes.authSecondary);
        } else {
          setIsEnabledTFA(false);
          setShowPage(true);
        }
      } catch (err: any) {
        showToast({type: toasts.error, description: err.message});
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuth) {
      dispatch(authAsyncActions.refreshToken());
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    check();
    setIsLoading(false);
  }, [isAuth]);

  return (
    <>
      {isLoading && (
        <div className={s.container}>
          <Loader />
        </div>
      )}
      {!isLoading && role === Roles.user && !isReserveCodeCompiling && <Navigate to={routes.authStep3} />}
      {!isLoading && role === Roles.guest && isEnabledTFA && <Navigate to={routes.authSecondary} />}
      {!isLoading && role === Roles.none && <Navigate to={routes.auth} />}
      {authorizedUsersRoles.includes(role) && !isReserveCodeCompiling && !isRestoryTfa && <Navigate to={routes.home} />}
      {authorizedUsersRoles.includes(role) && !isReserveCodeCompiling && isRestoryTfa && !isFirstLogin && (
        <Navigate to={'/profile/safeness'} />
      )}
      {authorizedUsersRoles.includes(role) && !isReserveCodeCompiling && isFirstLogin && (
        <Navigate to={routes.setupAutoLock} />
      )}
      {((showPage && !isLoading && role === Roles.guest && !isEnabledTFA) || isReserveCodeCompiling) && <Outlet />}
    </>
  );
};
