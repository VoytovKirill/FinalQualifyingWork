import {FondDto, AdditionalStatsDto, FullDetailedStats, DetailedStats} from 'api/dto/Fund';
import {Rename} from 'store';

import {apiClient} from '../client';

export interface GetFundsProfitParams {
  from: string | null;
  to: string | null;
  pageSize: number;
  isActive: boolean | null;
  isCommercial: boolean | null;
}

export interface GetFundsParams extends GetFundsProfitParams {
  pageNumber: number;
  trackedOnly: boolean;
  includeDetailedCosts: boolean;
}

export interface UpdateBudget {
  contractPrice: number | null;
  budget: number | null;
}

export interface IFullStats {
  id: number;
  from: string;
  to: string;
}

export interface FundsResponse {
  items: Array<FondDto>;
  totalSize: number;
  paginationSize: number;
}

class FundsService {
  private getUrl(endPoint: string) {
    return `Funds/${endPoint}`;
  }

  getFullDetailedAdditionalStats(id: number, from: string | null, to: string | null) {
    return apiClient.get<FullDetailedStats>(this.getUrl(`${id}/full-detailed-additional-stats`), {
      params: {id, from, to},
    });
  }

  getDetailedAdditionalStats(id: number, from: string | null, to: string | null) {
    return apiClient.get<DetailedStats>(this.getUrl(`${id}/detailed-additional-stats`), {
      params: {id, from, to},
    });
  }

  getFullAdditionalStats(id: number, dateFrom: string | null, dateTo: string | null) {
    return apiClient.get<AdditionalStatsDto>(this.getUrl(`${id}/full-additional-stats`), {
      params: {id: id, from: dateFrom, to: dateTo},
    });
  }
  getAdditionalStats(id: number, dateFrom: string | null, dateTo: string | null) {
    return apiClient.get<AdditionalStatsDto>(this.getUrl(`${id}/additional-stats`), {
      params: {id: id, from: dateFrom, to: dateTo},
    });
  }
  getDetailStats(id: number) {
    return apiClient.get(this.getUrl(`${id}/details`), {
      params: {id},
    });
  }
  getFunds(params: GetFundsParams) {
    return apiClient.get<FundsResponse>(this.getUrl(''), {params});
  }

  getFundById(id: number, dateFrom: string, dateTo: string, includeDetailedCosts: boolean) {
    return apiClient.get<FondDto>(this.getUrl(String(id)), {
      params: {from: dateFrom, to: dateTo, detailedCosts: includeDetailedCosts},
    });
  }

  getTrackedFunds(params: GetFundsParams) {
    return apiClient.get(this.getUrl('tracked-by-current-user'), {params});
  }

  getShortFunds(isTrackedOnly: boolean) {
    return apiClient.get(this.getUrl('short'), {params: {trackedOnly: isTrackedOnly}});
  }

  trackFund(funds: number[]) {
    return apiClient.put(this.getUrl('track'), funds);
  }

  untrackFund(funds: number[]) {
    return apiClient.put(this.getUrl('untrack'), funds);
  }

  updateBudget(id: number, params: UpdateBudget) {
    return apiClient.put(this.getUrl(`${id}/update-budget`), params);
  }

  updateNameAddCosts(id: number, params: Rename) {
    const actualName = encodeURIComponent(params.oldName);
    const updatedName = encodeURIComponent(params.newName);
    return apiClient.put(this.getUrl(`${id}/additional-costs?actualName=${actualName}&updatedName=${updatedName}`));
  }

  deleteAddCostsByName(id: number, name: string) {
    const encodedName = encodeURIComponent(name);
    return apiClient.delete(this.getUrl(`${id}/additional-costs?name=${encodedName}`));
  }
}

export const fundService = new FundsService();
