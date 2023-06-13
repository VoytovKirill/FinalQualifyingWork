import {createAsyncThunk} from '@reduxjs/toolkit';

import {authService, tfaService, profileService} from 'api';
import {userData} from 'api/services/authService';
import {fingerprintService} from 'shared/utils/fingerprint';

const getRecoveryCodesCount = async () => {
  try {
    const response = await profileService.getRecoveryCodesCount();
    return response;
  } catch (err: any) {
    throw err;
  }
};

export const verify = createAsyncThunk('auth/verify', async (code: string) => {
  try {
    const response = await tfaService.verify(code);
    const countOfCodes = await getRecoveryCodesCount();
    return {response: response.data, countOfCodes: countOfCodes.data};
  } catch (err: any) {
    throw err;
  }
});
export const verifyRecovery = createAsyncThunk('auth/verifyRecovery', async (code: string) => {
  const response = await tfaService.verifyRecovery(code);
  return response.data;
});

export const login = createAsyncThunk('auth/login', async (request: Omit<userData, 'fingerprint'>) => {
  const fingerprint = await fingerprintService.get();
  const response = await authService.login({...request, fingerprint});
  return response.data;
});

export const refreshToken = createAsyncThunk('auth/refresh', async () => {
  const fingerprint = await fingerprintService.get();
  const response = await authService.refreshToken(fingerprint);
  return response.data;
});

export const screenLock = createAsyncThunk('auth/screenLock', async (data: {accessToken: string}) => {
  return data;
});

export const unLock = createAsyncThunk(
  'auth/unLock',
  async (data: {accessToken: string; attemptsLeft?: number | null}) => {
    return data;
  },
);
export const enableTfa = createAsyncThunk('auth/enableTfa', async (code: string) => {
  try {
    const response = await tfaService.enable(code);
    return response.data;
  } catch (err: any) {
    throw err;
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await authService.logout();
  return response.data;
});

export const authAsyncActions = {
  verify,
  enableTfa,
  login,
  refreshToken,
  logout,
  screenLock,
  unLock,
  verifyRecovery,
};
