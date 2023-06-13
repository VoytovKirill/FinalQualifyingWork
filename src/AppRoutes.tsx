import {Routes, Navigate, Route} from 'react-router';

import {AllFunds} from 'modules/AllFunds';
import {AuthorizationApplication} from 'modules/AuthorizationApplication';
import {AuthorizationTwoFactor} from 'modules/AuthorizationTwoFactor';
import {AuthorizationTwoFactorSecondary} from 'modules/AuthorizationTwoFactorSecondary';
import {Data} from 'modules/Data';
import {DomainAuthorization} from 'modules/DomainAuthorization';
import {FundDetails} from 'modules/FundDetails';
import {Logs} from 'modules/Logs';
import {Profile} from 'modules/Profile';
import {Roles as RolesPage} from 'modules/Roles';
import {SetupScreenLock} from 'modules/SetupScreenLock';
import {TrackedFunds} from 'modules/TrackedFunds';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {BaseLayout} from 'shared/layouts/Base';

import {MainPage} from './shared/components/MainPage';
import {NotFoundPage} from './shared/components/NotFoundPage';
import {
  ApplicationProtectedRoute,
  CheckTwoFactorAuth,
  CheckTwoFactorRegistration,
  DomainProtectedRoute,
  RolesProtectedRoute,
} from './shared/components/ProtectedRoutes';

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<DomainProtectedRoute />}>
          <Route path={routes.auth} element={<DomainAuthorization />} />
        </Route>
        <Route element={<CheckTwoFactorRegistration />}>
          <Route path={routes.authStep2} element={<AuthorizationTwoFactor />} />
        </Route>
        <Route element={<CheckTwoFactorAuth />}>
          <Route path={routes.authSecondary} element={<AuthorizationTwoFactorSecondary />} />
        </Route>
        <Route element={<ApplicationProtectedRoute />}>
          <Route path={routes.authStep3} element={<AuthorizationApplication />} />
        </Route>
        <Route element={<RolesProtectedRoute roles={[Roles.manager, Roles.admin, Roles.superAdmin, Roles.user]} />}>
          <Route path={routes.setupAutoLock} element={<SetupScreenLock />} />
        </Route>

        <Route path={routes.home} element={<BaseLayout />}>
          <Route element={<RolesProtectedRoute roles={[Roles.manager, Roles.admin, Roles.superAdmin, Roles.user]} />}>
            <Route path={`${routes.profile}/*`} element={<Profile />} />
          </Route>
          <Route element={<RolesProtectedRoute roles={[Roles.manager, Roles.admin, Roles.superAdmin, Roles.user]} />}>
            <Route index element={<MainPage />} />
          </Route>
          <Route element={<RolesProtectedRoute roles={[Roles.manager, Roles.admin, Roles.superAdmin]} />}>
            <Route path={`${routes.tracked}/*`} element={<TrackedFunds />} />
            <Route path={routes.fundDetailes} element={<FundDetails />} />
            <Route path={routes.fund} element={<FundDetails />} />
            <Route path={`${routes.allFunds}/*`} element={<AllFunds />} />
          </Route>
          <Route element={<RolesProtectedRoute roles={[Roles.admin, Roles.superAdmin]} />}>
            <Route path={`${routes.data}/*`} element={<Data />} />
          </Route>
          <Route element={<RolesProtectedRoute roles={[Roles.superAdmin]} />}>
            <Route path={routes.roles} element={<RolesPage />} />
            <Route path={routes.events} element={<Logs />} />
          </Route>
        </Route>
        <Route path={routes.empty} element={<Navigate to={routes.allFunds} />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
