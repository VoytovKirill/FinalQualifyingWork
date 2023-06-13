import axios from 'axios';

import store from 'store';

import {registerAuthInterceptor} from './interceptors/auth';

export const getApiClient = () => axios.create();
export const apiClient = axios.create({baseURL: process.env.REACT_APP_API_URL});

const tokenProvider = {
  getAccessToken() {
    return store.getState().user.accessToken;
  },
};

registerAuthInterceptor(apiClient, tokenProvider);
