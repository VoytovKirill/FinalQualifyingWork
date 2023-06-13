import {apiClient} from 'api';

interface NormsDTO {
  descriptionForMonthNorm: string | null;
  descriptionForMonthNormPersonal: string[];
}

class NormsService {
  private getUrl() {
    return 'Norms/';
  }
  synchronization() {
    return apiClient.put<NormsDTO>(this.getUrl());
  }
}

export const normsService = new NormsService();
