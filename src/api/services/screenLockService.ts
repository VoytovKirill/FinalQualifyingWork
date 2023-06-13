import {apiClient} from 'api/client';

class ScreenLockService {
  private getProfileUrl(endPoint: string) {
    return `Profile/screen-lock/${endPoint}`;
  }
  setScreenLockEnabled(pin: string) {
    return apiClient.post(this.getProfileUrl('set'), {
      pin,
    });
  }
  disableScreenLock() {
    return apiClient.post(this.getProfileUrl('disable'));
  }
}

export const screenLockService = new ScreenLockService();
