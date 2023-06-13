import {RootState} from 'store';

const getIsRestoryTfa = (state: RootState) => state.profile.isRestoryTfa;
const getIsFirstLogin = (state: RootState) => state.profile.isFirstLogin;
const getIsScreenLockEnabled = (state: RootState) => state.profile.isScreenLockEnabled;
const getIsScreenLock = (state: RootState) => state.profile.isScreenLock;
const getIsReserveCodeCompiling = (state: RootState) => state.profile.isReserveCodeCompiling;
const getIsReceiveSiteNotifications = (state: RootState) => state.profile.isReceiveSiteNotifications;
const getIsReceiveEmailNotifications = (state: RootState) => state.profile.isReceiveEmailNotifications;

export const profileSelectors = {
  getIsRestoryTfa,
  getIsFirstLogin,
  getIsScreenLockEnabled,
  getIsScreenLock,
  getIsReserveCodeCompiling,
  getIsReceiveSiteNotifications,
  getIsReceiveEmailNotifications,
};
