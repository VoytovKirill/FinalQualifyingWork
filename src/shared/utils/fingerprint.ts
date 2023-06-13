import {load} from '@fingerprintjs/fingerprintjs';

class FingerprintService {
  private fingerprint: null | string = null;

  private async create() {
    const fgp = await load();
    const {visitorId} = await fgp.get();
    return visitorId;
  }
  public async get() {
    if (!this.fingerprint) {
      const newFingerprint = await this.create();
      this.fingerprint = newFingerprint;
    }
    return this.fingerprint;
  }
}

export const fingerprintService = new FingerprintService();
