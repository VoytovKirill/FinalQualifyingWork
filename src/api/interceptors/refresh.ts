import axios, {AxiosInstance} from 'axios';
import {NavigateFunction} from 'react-router';

import {routes} from 'shared/constants/routes';
import store, {authAsyncActions} from 'store';


async function requestValidAccessToken() {
  return store.dispatch(authAsyncActions.refreshToken());
}

export function refreshTokenResponseInterceptor(api: AxiosInstance, navigate: NavigateFunction, pathname: string) {
  api.interceptors.response.use(
    (response) => {
      return response;
    },

    async (error) => {
      const originalConfig = error.config;

      if (error.response.status) {
        if (error.response.status === 401 && originalConfig.url === 'Auth/refresh') {
          navigate(routes.auth);
          return Promise.reject(error);
        }

        if (error.response.status === 401 && originalConfig.url === 'Auth/tfa/verify' && originalConfig._retry) {
          return Promise.reject(error);
        }

        if (
          error.response.status === 401 &&
          (pathname.includes(routes.authStep2) || pathname.includes(routes.authSecondary)) &&
          originalConfig._retry
        ) {
          return Promise.reject(error);
        }

        if (error.response.status === 401 && error.config && !originalConfig._retry) {
          originalConfig._retry = true;
          const accessToken = await requestValidAccessToken();

          if (accessToken.payload?.accessToken) {
            const updatedOriginalConfig = {
              ...originalConfig,
              headers: {
                ...originalConfig.headers,
                Authorization: `Bearer ${accessToken.payload.accessToken}`,
              },
            };
            return axios(updatedOriginalConfig);
          }
        }
      }
      return Promise.reject(error);
    },
  );
}
