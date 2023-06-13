import {apiClient} from 'api/client';

export interface ProfileSettings {
  isReceiveEmailNotifications: boolean | undefined;
  isReceiveSiteNotifications: boolean | undefined;
}

class ProfileService {
  getRecoveryCodesCount() {
    return apiClient.get<number>(this.getUrl('recovery-codes-count'));
  }

  putPersonalData(firstName: string, lastName: string) {
    return apiClient.put(this.getUrl('settings/personal-data'), {
      firstName,
      lastName,
    });
  }

  putNotifications(userSettings: ProfileSettings) {
    return apiClient.put(this.getUrl('settings/notification'), {
      receiveSiteNotifications: userSettings.isReceiveSiteNotifications,
      receiveEmailNotifications: userSettings.isReceiveEmailNotifications,
    });
  }

  getSettingsNotification() {
    return apiClient.get(this.getUrl('settings/notification'));
  }
  private getUrl(endPoint: string) {
    return `Profile/${endPoint}`;
  }
}

export const profileService = new ProfileService();
