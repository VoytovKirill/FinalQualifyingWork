import {createAsyncThunk} from '@reduxjs/toolkit';

import {profileService, ProfileSettings, screenLockService, tfaService} from 'api';

export const restoreTfaAccess = createAsyncThunk('profile/restoreTfaAccess', async () => {
  const response = await tfaService.disable();
  return response.data;
});

export const disableScreenLock = createAsyncThunk('profile/disableScreenLock', async () => {
  const response = await screenLockService.disableScreenLock();
  return response.data;
});
export const enableScreenLock = createAsyncThunk('profile/enableScreenLock', async (code: string) => {
  const response = await screenLockService.setScreenLockEnabled(code);
  return response.data;
});
export const getSettingsNotification = createAsyncThunk('getProfile/settings/notification', async () => {
  const response = await profileService.getSettingsNotification();
  return response.data;
});
export const putSettingsNotification = createAsyncThunk(
  'putProfile/settings/notification',
  async (request: ProfileSettings) => {
    const response = await profileService.putNotifications(request);
    return response.data;
  },
);
export const profileAsyncActions = {
  restoreTfaAccess,
  enableScreenLock,
  disableScreenLock,
  getSettingsNotification,
  putSettingsNotification,
};
