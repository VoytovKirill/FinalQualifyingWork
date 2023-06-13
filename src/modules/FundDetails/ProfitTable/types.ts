export interface MonthFundStat {
  id: number;
  revenue: number | string;
  directCosts: number | string;
  administrativeCosts: number | string;
  profit: number | string;
  percentageProfit: number | string;
  period: string | null;
}
