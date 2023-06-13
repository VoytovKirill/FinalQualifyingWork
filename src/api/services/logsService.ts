import {apiClient} from 'api/client';
import {LogDTO} from 'api/dto/Logs';

interface logsResponse {
  items: LogDTO[];
  totalSize: number;
  paginationSize: number;
}

export type event = {
  type: number;
  title: string;
};

type GetParamsLogs = {
  accountId?: number | null;
  pageNumber?: number;
  pageSize?: number;
  dateFrom?: string | null;
  dateTo?: string | null;
  eventType?: number | null;
};
export type SourceType = {
  type: number;
  title: string;
};

class LogsService {
  getEventList() {
    return apiClient.get<event[]>(this.getUrl('events'));
  }
  async getSourceList() {
    const response = await apiClient.get<SourceType[]>(this.getUrl('sources'));
    return response.data;
  }
  getFilteredLogs(params: GetParamsLogs) {
    return apiClient.get<logsResponse>(this.getUrl('filtered'), {
      params,
    });
  }
  private getUrl(endPoint: string) {
    return `AuditLogs/${endPoint}`;
  }
}

export const logsService = new LogsService();
