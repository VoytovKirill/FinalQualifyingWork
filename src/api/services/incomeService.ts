import {apiClient} from 'api/client';
import {CurrencyCodeDto, IncomeByMonthDto, paramsSavesIncomeByMonth} from 'api/dto/Income';
import {DATE_API_FORMAT, prepareDate} from 'shared/utils/prepareDate/prepareDate';

class Income {
  private getUrl(endPoint: string) {
    return `Income/${endPoint}`;
  }
  getCurrencyCodes() {
    return apiClient.get<CurrencyCodeDto[]>(this.getUrl('currency-codes'));
  }
  getIncomeOfOneMonthByFundId(monthDate: Date, fundId: number) {
    return apiClient.get<IncomeByMonthDto>(this.getUrl(''), {
      params: {
        fundId,
        month: prepareDate(monthDate, DATE_API_FORMAT),
      },
    });
  }
  // метод updateIncomeOfOneMonthByFundId кроме обновления используется для создания выручки за определенный месяц
  updateIncomeOfOneMonthByFundId(params: paramsSavesIncomeByMonth) {
    return apiClient.post(this.getUrl(''), params);
  }
  deleteIncomeOfOneMonthByFundId(monthDate: Date, fundId: number) {
    return apiClient.delete(this.getUrl(''), {
      params: {
        fundId,
        month: prepareDate(monthDate, DATE_API_FORMAT),
      },
    });
  }
}

export const incomeService = new Income();
