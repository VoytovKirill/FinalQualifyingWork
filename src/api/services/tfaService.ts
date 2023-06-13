import {apiClient} from '../client';
import {AccessTokenDto} from '../dto/Token';

export interface RecoveryCodes {
  recoveryCodes: string[];
}

class TfaService {
  enable(userCode: string) {
    return apiClient.post<AccessTokenDto>(
      this.getUrl('enable'),
      {},
      {
        params: {code: userCode},
      },
    );
  }
  disable() {
    return apiClient.post<AccessTokenDto>(this.getUrl('disable'));
  }
  verify(userCode: string) {
    return apiClient.post<AccessTokenDto>(
      this.getUrl('verify'),
      {},
      {
        params: {code: userCode},
      },
    );
  }
  createQrCode() {
    return apiClient.get<Blob>(this.getUrl('create/qrcode'), {
      responseType: 'blob',
    });
  }

  createRecoveryCodes() {
    return apiClient.post<RecoveryCodes>(this.getUrl('create/recovery-codes'));
  }

  verifyRecovery(recoveryUserCode: string) {
    return apiClient.post<AccessTokenDto>(
      this.getUrl('verify/recovery'),
      {},
      {
        params: {recoveryCode: recoveryUserCode},
      },
    );
  }
  private getUrl(endPoint: string) {
    return `Auth/tfa/${endPoint}`;
  }
}

export const tfaService = new TfaService();
