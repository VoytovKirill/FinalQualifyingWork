import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';
import logger from 'redux-logger';

import {fundsInstances} from 'store/utils/fundSliceCreator';

import {authReducer} from './auth';
import {dataForCalculationsReducer} from './dataForCalculations';
import {detailsInfoReducer} from './fundDetails';
import {logsReducer} from './logs';
import {notificationsReducer} from './notifications';
import {profileReducer} from './profile';
import {rolesReducer} from './roles';
import {salaryRatesFiltersReducer} from './salaryRatesFilters';
import {userReducer} from './user';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    profile: profileReducer,
    fonds: fundsInstances['fonds'].reducer,
    tracked: fundsInstances['tracked'].reducer,
    salaryRatesFilters: salaryRatesFiltersReducer,
    logs: logsReducer,
    roles: rolesReducer,
    notifications: notificationsReducer,
    detailsInfo: detailsInfoReducer,
    dataForCalculation: dataForCalculationsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();
    if (process.env.NODE_ENV === 'production') {
      return middleware;
    }
    return middleware.concat(logger);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
export type RootThunk<R = unknown> = ThunkAction<R, RootState, unknown, Action>;

export function useRootDispatch() {
  return useDispatch<RootDispatch>();
}
export const useRootSelector: TypedUseSelectorHook<RootState> = (...args) => {
  return useSelector(...args);
};
export default store;
export * from './auth';
export * from './auth/selectors';
export * from './user';
export * from './user/selectors';
export * from './profile';
export * from './profile/selectors';
export * from './salaryRatesFilters';
export * from './salaryRatesFilters/selectors';
export * from './logs';
export * from './logs/selectors';
export * from './notifications';
export * from './notifications/selectors';
export * from './fundDetails';
export * from './fundDetails/selectors';
export * from './dataForCalculations/selectors';
