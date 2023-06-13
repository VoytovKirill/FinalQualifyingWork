import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Navigate, Outlet, useNavigate} from 'react-router';

import {authService} from 'api';
import {Loader} from 'shared/components/Loader';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {
  authAsyncActions,
  profileActions,
  profileSelectors,
  useRootDispatch,
  useRootSelector,
  usersSelectors,
} from 'store';

import s from './CheckTwoFactorAuth.module.scss';

export const CheckTwoFactorAuth = () => {
  const dispatch = useRootDispatch();
  const navigate = useNavigate();
  const role = useSelector(usersSelectors.getRole);
  const isAuth = useSelector(usersSelectors.getUserToken);
  const authorizedUsersRoles = [Roles.admin, Roles.manager, Roles.superAdmin];
  const {showToast} = useToast();
  const [isEnabledTFA, setIsEnabledTFA] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPage, setShowPage] = useState(false);
  const isFirstLogin = useSelector(profileSelectors.getIsFirstLogin);
  const isRecoveryCodesCompilling = useRootSelector(profileSelectors.getIsReserveCodeCompiling);

  const check = async () => {
    if (role === Roles.user) navigate(routes.authStep3);
    if (role === Roles.guest) {
      setIsLoading(true);
      try {
        const response = await authService.check();
        if (response.data.isFirstLogin) {
          dispatch(profileActions.setIsFirstLogin(true));
        }
        if (response.data.isTfaEnabled) {
          setIsEnabledTFA(true);
          setShowPage(true);
        } else {
          navigate(routes.authStep2);
        }
      } catch (err: any) {
        showToast({type: toasts.error, description: err.message});
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuth) dispatch(authAsyncActions.refreshToken());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuth) check();
  }, [isAuth]);

  return (
    <>
      {isLoading && (
        <div className={s.container}>
          <Loader />
        </div>
      )}
      {!isLoading && role === Roles.guest && !isEnabledTFA && <Navigate to={routes.authStep2} />}
      {!isLoading && role === Roles.none && <Navigate to={routes.auth} />}
      {authorizedUsersRoles.includes(role) && !isFirstLogin && !isRecoveryCodesCompilling && (
        <Navigate to={routes.home} />
      )}
      {authorizedUsersRoles.includes(role) && isFirstLogin && !isRecoveryCodesCompilling && (
        <Navigate to={routes.setupAutoLock} />
      )}
      {showPage && !isLoading && role === Roles.guest && isEnabledTFA && <Outlet />}
      {isRecoveryCodesCompilling && <Outlet />}
    </>
  );
};
