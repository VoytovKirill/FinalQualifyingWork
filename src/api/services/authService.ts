import {apiClient} from 'api/client';

export interface userData {
  password: string;
  username: string;
  fingerprint: string;
}
interface checkingEnable {
  isRequestCreated: boolean;
  isTfaEnabled: boolean;
  isFirstLogin?: boolean;
}

class AuthService {
  private getUrl(endPoint: string) {
    return `Auth/${endPoint}`;
  }

  login(userData: userData) {
    return apiClient.post(this.getUrl('sign-in'), {
      username: userData.username,
      password: userData.password,
      fingerprint: userData.fingerprint,
    });
  }
  logout() {
    return apiClient.post(this.getUrl('sign-out'));
  }
  refreshToken(fingerprint: string) {
    return apiClient.post(this.getUrl('refresh'), {
      withCredentials: true,
      fingerprint: fingerprint,
    });
  }
  check() {
    return apiClient.get<checkingEnable>(this.getUrl('check-status'));
  }
}

export const authService = new AuthService();
