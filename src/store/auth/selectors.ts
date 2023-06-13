import {RootState} from 'store';

const getError = (state: RootState) => state.auth.loginError;
const getLoadingAuth = (state: RootState) => state.auth.loginInProgress;
const getAttemptsLeftAutoBlock = (state: RootState) => state.auth.attemptsLeftAutoBlock;

export const authSelectors = {
  getError,
  getLoadingAuth,
  getAttemptsLeftAutoBlock,
};
