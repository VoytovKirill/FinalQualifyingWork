import {createSlice} from '@reduxjs/toolkit';

import {profileAsyncActions} from 'store';

import {authAsyncActions} from './actions';

export type AuthSliceState = {
  isLoggedIn: boolean;
  loginInProgress: boolean;
  loginError: string | null;
  isReserveCodeCompiling: boolean;
  isTfaAccessRecovery: boolean;
  attemptsLeftAutoBlock: null | number | undefined;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isReserveCodeCompiling: false,
    isLoggedIn: false,
    loginInProgress: false,
    loginError: null,
  } as AuthSliceState,

  reducers: {
    restoreTfaAccess(state) {
      state.isTfaAccessRecovery = true;
    },
    setLoginUser(state) {
      state.isLoggedIn = true;
      state.loginInProgress = false;
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authAsyncActions.login.fulfilled, (state, action: any) => {
        authSlice.caseReducers.setLoginUser(state);
      })
      .addCase(authAsyncActions.login.pending, (state) => {
        state.isLoggedIn = false;
        state.loginInProgress = true;
        state.loginError = null;
      })
      .addCase(authAsyncActions.login.rejected, (state, action: any) => {
        state.isLoggedIn = false;
        state.loginInProgress = false;
        state.loginError = action.error.message;
      })

      .addCase(authAsyncActions.logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.loginInProgress = false;
      })
      .addCase(authAsyncActions.logout.rejected, (state) => {
        state.isLoggedIn = true;
        state.loginInProgress = false;
      })
      .addCase(authAsyncActions.refreshToken.fulfilled, (state, action: any) => {
        authSlice.caseReducers.setLoginUser(state);
      })
      .addCase(authAsyncActions.unLock.fulfilled, (state, action: any) => {
        let attemptsLeft = null;
        attemptsLeft = action.payload.attemptsLeft ?? action.payload.attemptsLeft;
        state.attemptsLeftAutoBlock = attemptsLeft;
      })
      .addCase(authAsyncActions.screenLock.fulfilled, (state, action: any) => {
        state.attemptsLeftAutoBlock = null;
      })

      .addCase(authAsyncActions.refreshToken.pending, (state) => {
        state.isLoggedIn = false;
        state.loginInProgress = true;
        state.loginError = null;
      })
      .addCase(authAsyncActions.refreshToken.rejected, (state, action: any) => {
        state.isLoggedIn = false;
        state.loginInProgress = false;
      })

      .addCase(profileAsyncActions.restoreTfaAccess.fulfilled, (state, action: any) => {
        state.isLoggedIn = false;
      })

      .addCase(authAsyncActions.verify.fulfilled, (state, action: any) => {
        authSlice.caseReducers.setLoginUser(state);
      })
      .addCase(authAsyncActions.verify.pending, (state) => {
        state.loginInProgress = true;
        state.loginError = null;
      })
      .addCase(authAsyncActions.verify.rejected, (state, action: any) => {
        state.loginInProgress = false;
        state.loginError = action.error.message;
      })
      .addCase(authAsyncActions.verifyRecovery.fulfilled, (state, action: any) => {
        authSlice.caseReducers.setLoginUser(state);
      })
      .addCase(authAsyncActions.verifyRecovery.pending, (state) => {
        state.loginInProgress = true;
        state.loginError = null;
      })
      .addCase(authAsyncActions.verifyRecovery.rejected, (state, action: any) => {
        state.loginInProgress = false;
        state.loginError = action.error.message;
      })
      .addCase(authAsyncActions.enableTfa.fulfilled, (state) => {
        state.loginInProgress = false;
      })
      .addCase(authAsyncActions.enableTfa.pending, (state) => {
        state.loginInProgress = true;
        state.loginError = null;
      })
      .addCase(authAsyncActions.enableTfa.rejected, (state, action: any) => {
        state.loginInProgress = false;
        state.loginError = action.error.message;
      });
  },
});

export const {actions: authActions, caseReducers: authCaseReducers, reducer: authReducer} = authSlice;
export {authAsyncActions};
