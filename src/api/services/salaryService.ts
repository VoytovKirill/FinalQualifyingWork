import {apiClient} from 'api';
import {EmployeeDto, EmployeesSalaryRatesDTO} from 'api/dto/SalaryRates';

interface ImportDate {
  date: string;
}
interface SalaryRateType {
  from: string;
  to: string | null;
  rate: number;
  employeeId: number;
}

class SalaryService {
  private getUrl(endPoint: string) {
    return `SalaryRates/${endPoint}`;
  }

  getSalaryRatesByEmployeeId(year: number, employeeId: number) {
    return apiClient.get<EmployeeDto>(this.getUrl('for-year/by-employee-id'), {
      params: {
        year,
        employeeId,
      },
    });
  }
  getSalaryRates(year: number, fired: boolean, pageNumber: number, pageSize: number) {
    return apiClient.get<EmployeesSalaryRatesDTO>(this.getUrl('for-year'), {
      params: {
        year: year,
        fired: fired,
        pageNumber: pageNumber + 1,
        pageSize: pageSize,
      },
    });
  }

  import(data: Blob, setProgress: (percent: number) => void) {
    return apiClient.post(
      this.getUrl('import'),
      {salaryRatesFile: data},
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const percentCompleted = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(percentCompleted);
        },
      },
    );
  }
  updateRateByEmployeeId(data: SalaryRateType) {
    return apiClient.post<SalaryRateType[]>(this.getUrl(''), data);
  }
  getLastImportDate() {
    return apiClient.get<ImportDate>(this.getUrl('last-import-date'));
  }
}

export const salaryService = new SalaryService();
