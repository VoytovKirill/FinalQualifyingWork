export interface FundProfitDto {
  fundId: number;
  income: number;
  directCosts: number;
  administrativeCosts: number;
  profit: number;
  profitPercentage: number;
  name: string;
}

export interface FundsProfitTotals {
  income: number;
  directCosts: number;
  administrativeCosts: number;
  profit: number;
  profitPercentage: number;
}
