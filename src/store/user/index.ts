import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Roles} from 'shared/constants/roles';
import {User} from 'shared/models';
import {decodeJWT} from 'shared/utils/decodingJWT/decodingJWT';
import {authAsyncActions} from 'store/auth';
import {profileAsyncActions} from 'store/profile';

import {userAsyncActions} from './actions';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    fullName: '',
    role: Roles.none,
    isAuthorizedUser: false,
    accessToken: '',
  } as User,

  reducers: {
    updateAccessToken(state, action: PayloadAction<any>) {
      state.accessToken = action.payload.accessToken;
      state.role = decodeJWT(state.accessToken).role! || Roles.none;
      state.isAuthorizedUser = [Roles.manager, Roles.admin, Roles.superAdmin, Roles.lockedScreenUser].includes(
        state.role,
      );
      state.fullName = decodeJWT(state.accessToken).name!;
    },
    deleteUser(state) {
      state.fullName = null;
      state.role = Roles.none;
      state.isAuthorizedUser = false;
      state.accessToken = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authAsyncActions.refreshToken.fulfilled, (state, action: any) => {
        userSlice.caseReducers.updateAccessToken(state, action);
      })
      .addCase(authAsyncActions.refreshToken.rejected, (state) => {
        userSlice.caseReducers.deleteUser(state);
      })
      .addCase(authAsyncActions.screenLock.fulfilled, (state, action: any) => {
        userSlice.caseReducers.updateAccessToken(state, action);
      })
      .addCase(authAsyncActions.logout.fulfilled, (state) => {
        userSlice.caseReducers.deleteUser(state);
      })
      .addCase(profileAsyncActions.restoreTfaAccess.fulfilled, (state, action: any) => {
        state.accessToken = '';
        state.role = Roles.none;
      })
      .addCase(authAsyncActions.verify.fulfilled, (state, action: any) => {
        userSlice.caseReducers.updateAccessToken(state, action);
      })
      .addCase(authAsyncActions.verifyRecovery.fulfilled, (state, action: any) => {
        userSlice.caseReducers.updateAccessToken(state, action);
      })
      .addCase(authAsyncActions.login.fulfilled, (state, action: any) => {
        userSlice.caseReducers.updateAccessToken(state, action);
      })
      .addCase(authAsyncActions.enableTfa.fulfilled, (state, action: any) => {
        userSlice.caseReducers.updateAccessToken(state, action);
      })
      .addCase(authAsyncActions.unLock.fulfilled, (state, action: any) => {
        const token = action.payload.accessToken;
        if (token) userSlice.caseReducers.updateAccessToken(state, action);
      });
  },
});

export const {actions: userActions, caseReducers: userCaseReducers, reducer: userReducer} = userSlice;
export {userAsyncActions};
