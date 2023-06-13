import {RootState} from 'store';

const getRole = (state: RootState) => state.user.role;
const getUserName = (state: RootState) => state.user.fullName;
const getUserToken = (state: RootState) => state.user.accessToken;
const getIsAuthorizedUser = (state: RootState) => state.user.isAuthorizedUser;

export const usersSelectors = {
  getRole,
  getUserName,
  getUserToken,
  getIsAuthorizedUser,
};
