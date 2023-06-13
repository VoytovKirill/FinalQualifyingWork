import {Axios} from 'axios';

export interface TokenProvider {
  getAccessToken(): string;
}

export function registerAuthInterceptor(api: Axios, tokenProvider: TokenProvider) {
  api.interceptors.request.use((req) => {
    const token = tokenProvider.getAccessToken();

    if (!!token && req.headers && !req.headers?.Authorization) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });
}
