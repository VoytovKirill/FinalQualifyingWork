import qs from 'qs';

import {apiClient} from 'api';
import {DateRange, FileFormat, ParamsSerialize} from 'api/dto/Reports';

class ReportsService {
  private getUrl(endPoint: string) {
    return `Reports/${endPoint}`;
  }

  getFundsReport(dateRange: DateRange, fundsIds: number[], fileFormat: FileFormat) {
    return apiClient.get<Blob>(this.getUrl('funds-report'), {
      params: {
        dateRange,
        fundsIds,
        fileFormat,
      },
      paramsSerializer: (params: ParamsSerialize) => {
        return qs.stringify(params, {arrayFormat: 'repeat', allowDots: true});
      },
      responseType: 'arraybuffer',
    });
  }

  exportSalaryRates(fileFormat: FileFormat) {
    return apiClient.get(this.getUrl('salary-rates'), {
      params: {fileFormat},
      responseType: 'arraybuffer',
    });
  }

  getReportByFundId(dateRange: DateRange, fundId: number, fileFormat: FileFormat) {
    return apiClient.get(this.getUrl('fund-detailed-info-report'), {
      params: {
        dateRange,
        fundId,
        fileFormat,
      },
      responseType: 'arraybuffer',
      paramsSerializer: (params: any) => {
        return qs.stringify(params, {allowDots: true});
      },
    });
  }
}

export const reportsService = new ReportsService();
