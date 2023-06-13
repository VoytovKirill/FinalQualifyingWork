import {apiClient} from 'api';
import {FundProfitDto, FundsProfitTotals} from 'api/dto/FundsProfit';
import {ProfitStatsByFundOfPeriodDto} from 'api/dto/Income';

import {GetFundsParams, GetFundsProfitParams} from './fundsService';

export interface FundsProfitResponse {
  items: Array<FundProfitDto>;
  totalSize: number;
  paginationSize: number;
}

class ProfitService {
  private getUrl(endPoint: string) {
    return `Profit/${endPoint}`;
  }
  getFunds(params: GetFundsParams) {
    const {from: fromMonth, to: toMonth, ...rest} = params;
    return apiClient.get<FundsProfitResponse>(this.getUrl('all-funds'), {
      params: {...rest, fromMonth, toMonth},
    });
  }
  getFund(id: number, dateFrom: string | null, dateTo: string | null) {
    return apiClient.get(this.getUrl('single-fund'), {
      params: {
        fundId: id,
        fromMonth: dateFrom,
        toMonth: dateTo,
      },
    });
  }
  getFundProfit(fundId: number, dateFrom: string | null, dateTo: string | null) {
    return apiClient.get(this.getUrl('single-fund/per-month'), {
      params: {fundId, fromMonth: dateFrom, toMonth: dateTo},
    });
  }
  getTotals(params: GetFundsProfitParams) {
    const {from: fromMonth, to: toMonth, ...rest} = params;
    return apiClient.get<FundsProfitTotals>(this.getUrl('all-funds/totals'), {
      params: {...rest, fromMonth, toMonth},
    });
  }

  getGeneralStats(fundId: number) {
    return apiClient.get(this.getUrl('general-for-fund'), {
      params: {fundId},
    });
  }
  async getProfitStatsByFundOfPeriod(fundId: number, dateFrom: string | null, dateTo: string | null) {
    const res = await apiClient.get<ProfitStatsByFundOfPeriodDto>(this.getUrl('detailed-for-fund'), {
      params: {fundId, monthFrom: dateFrom, monthTo: dateTo},
    });
    return res.data;
  }
}

export const profitService = new ProfitService();
