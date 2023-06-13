import {Base64} from 'js-base64';

import {Roles} from 'shared/constants/roles';

export interface UserInfo {
  id?: string;
  sid?: string;
  accountId?: string;
  sub?: string;
  role?: Roles;
  name?: string;
  exp?: any;
  screen_locked?: boolean;
  screen_lock_enabled?: boolean;
}

export const decodeJWT = (token: string): UserInfo => {
  if (token) {
    const userDataFromToken = token.match(/(.*)\.(.*)\.(.*)/);
    if (userDataFromToken) {
      const newToken = JSON.parse(Base64.decode(userDataFromToken[2]));
      newToken.isScreenLock = newToken.screen_locked;
      newToken.isScreenLockEnabled = newToken.screen_lock_enabled;
      return newToken;
    }
  }
  return {};
};
