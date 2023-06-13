import {apiClient} from 'api/client';

interface AdditionalCosts {
  name: string;
  date: string;
  sum?: number;
  fundId: number;
}

class AdditionalCostService {
  postAdditionalCosts(additionalCostsList: AdditionalCosts[]) {
    return apiClient.post(this.getUrl(''), {
      additionalCostsList,
    });
  }

  updateAdditionalCosts(id: number, sum: number) {
    return apiClient.put(this.getUrl(`${id}?sum=${sum}`));
  }

  private getUrl(endPoint: string) {
    return `AdditionalCosts/${endPoint}`;
  }
}

export const additionalCostService = new AdditionalCostService();
