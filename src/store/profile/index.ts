import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {decodeJWT} from 'shared/utils/decodingJWT/decodingJWT';
import {authAsyncActions} from 'store/auth';

import {profileAsyncActions} from './actions';

export type ProfileSliceState = {
  isRestoryTfa: boolean;
  isFirstLogin: boolean;
  isScreenLockEnabled: boolean;
  isScreenLock: boolean;
  isReserveCodeCompiling: boolean;
  isReceiveSiteNotifications: boolean | undefined;
  isReceiveEmailNotifications: boolean | undefined;
};

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    isRestoryTfa: false,
    isReserveCodeCompiling: false,
    isFirstLogin: false,
    isScreenLockEnabled: false,
    isScreenLock: false,
  } as ProfileSliceState,

  reducers: {
    updatedToken(state, action: any) {
      state.isScreenLockEnabled = decodeJWT(action.payload.accessToken).screen_lock_enabled!;
      state.isScreenLock = decodeJWT(action.payload.accessToken).screen_locked!;
    },
    setIsRestoryTfa(state, action: PayloadAction<boolean>) {
      state.isRestoryTfa = action.payload;
    },
    setIsReserveCodeCompiling(state, action: PayloadAction<boolean>) {
      state.isReserveCodeCompiling = action.payload;
    },

    setIsFirstLogin(state, action: PayloadAction<boolean>) {
      state.isFirstLogin = action.payload;
    },
    setIsScreenLockEnabled(state, action: PayloadAction<boolean>) {
      state.isScreenLockEnabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileAsyncActions.restoreTfaAccess.fulfilled, (state, action: any) => {
        state.isRestoryTfa = true;
      })
      .addCase(profileAsyncActions.enableScreenLock.fulfilled, (state, action: any) => {
        state.isScreenLockEnabled = true;
      })
      .addCase(profileAsyncActions.disableScreenLock.fulfilled, (state, action: any) => {
        state.isScreenLockEnabled = false;
      })
      .addCase(profileAsyncActions.getSettingsNotification.fulfilled, (state, action: any) => {
        state.isReceiveEmailNotifications = action.payload.receiveEmailNotifications;
        state.isReceiveSiteNotifications = action.payload.receiveSiteNotifications;
      })
      .addCase(profileAsyncActions.putSettingsNotification.fulfilled, (state, action: any) => {
        state.isReceiveEmailNotifications = action.payload.receiveEmailNotifications;
        state.isReceiveSiteNotifications = action.payload.receiveSiteNotifications;
      })
      .addCase(authAsyncActions.enableTfa.fulfilled, (state) => {
        state.isReserveCodeCompiling = true;
      })
      .addCase(authAsyncActions.screenLock.fulfilled, (state) => {
        state.isScreenLock = true;
      })
      .addCase(authAsyncActions.screenLock.pending, (state) => {
        state.isScreenLock = true;
      })
      .addCase(authAsyncActions.unLock.fulfilled, (state, action: any) => {
        const token = action.payload.accessToken ?? action.payload.accessToken;
        state.isScreenLock = !token;
        if (!!token) profileSlice.caseReducers.updatedToken(state, action);
      })
      .addCase(authAsyncActions.verify.fulfilled, (state, action: any) => {
        const {response, countOfCodes} = action.payload;
        state.isScreenLockEnabled = decodeJWT(response.accessToken).screen_lock_enabled!;
        state.isScreenLock = decodeJWT(response.accessToken).screen_locked!;
        if (countOfCodes === 0) {
          state.isReserveCodeCompiling = true;
        }
      })
      .addCase(authAsyncActions.login.fulfilled, (state, action: any) => {
        profileSlice.caseReducers.updatedToken(state, action);
      })
      .addCase(authAsyncActions.refreshToken.fulfilled, (state, action: any) => {
        profileSlice.caseReducers.updatedToken(state, action);
      });
  },
});

export const {actions: profileActions, caseReducers: profileCaseReducers, reducer: profileReducer} = profileSlice;
export {profileAsyncActions};
