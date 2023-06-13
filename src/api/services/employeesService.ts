import {apiClient} from '../client';

class EmployeesService {
  getEmployeeList(isFired: boolean) {
    return apiClient.get(this.getUrl(''), {
      params: {isFired},
    });
  }
  private getUrl(endPoint: string) {
    return `Employees/${endPoint}`;
  }
}

export const employeesService = new EmployeesService();
