import {FC} from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router';

import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {usersSelectors} from 'store';

export const MainPage: FC = () => {
  const role = useSelector(usersSelectors.getRole);
  const isAuth = !!useSelector(usersSelectors.getUserToken);

  return (
    <>
      {!isAuth && <Navigate to={routes.auth} />}
      {role === Roles.user && <Navigate to={routes.authStep3} />}
      {role !== Roles.user && isAuth && <Navigate to={routes.allFunds} />}
    </>
  );
};
