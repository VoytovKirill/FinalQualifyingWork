import {apiClient} from 'api';

class CalculationsService {
  private getUrl(endPoint: string) {
    return `Calculations/${endPoint}`;
  }
  calculateFundCostsByPeriod(from: string, to: string) {
    return apiClient.post(this.getUrl('fund-costs'), {from, to});
  }
  calculateFundCostsAllTime() {
    return apiClient.post(this.getUrl('fund-costs/all-time'));
  }
}

export const calculationsService = new CalculationsService();
