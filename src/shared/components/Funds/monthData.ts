export interface StatisticsDataModels {
  dateFrom: Date | string;
  dateTo: Date | string;
  monthWorkTime: number | string;
  expenses: number | string;
  id?: number;
  isChangeable?: boolean;
  doubleRateWorkTime?: number;
}
