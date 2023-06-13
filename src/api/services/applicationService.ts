import {apiClient} from '../client';

interface RequestCreated {
  isRequestCreated: boolean;
}

class ApplicationService {
  check() {
    return apiClient.get<RequestCreated>(this.getUrl('check'));
  }
  create() {
    return apiClient.post(this.getUrl('create'));
  }

  private getUrl(endPoint: string) {
    return `Auth/request/${endPoint}`;
  }
}

export const applicationService = new ApplicationService();
