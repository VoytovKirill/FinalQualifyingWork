import {apiClient} from 'api/client';
import {RateType, RateInfo} from 'api/dto/Rate';

class Rates {
  private getUrl(endPoint: string) {
    return `Rates/${endPoint}`;
  }
  update(type: RateType, from: string | null, to: string | null, ratio: number) {
    const data = to ? {type, from, to, ratio} : {type, from, ratio};
    return apiClient.post<RateInfo[]>(this.getUrl(''), data);
  }

  getRateHistory(type: RateType) {
    return apiClient.get<RateInfo[]>(this.getUrl(`rate-history/${type}`));
  }
}

export const ratesService = new Rates();
