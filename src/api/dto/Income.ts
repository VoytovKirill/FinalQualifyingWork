export type CurrencyCodeDto = {
  type: number;
  title: string;
};
export type IncomeByMonthDto = {
  fundId: number;
  month: string;
  sum: number;
  rubSum: number;
  currencyCode: number;
};
export type paramsSavesIncomeByMonth = {
  fundId: number;
  month: string;
  sum: number;
  currencyCode: number;
};
export type oneMonthProfitStatByFund = {
  month: string;
  income: number;
  directCosts: number;
  administrativeCosts: number;
  profit: number;
  profitPercentage: number;
};
export type totalStatType = {
  fundId: number;
  totalIncome: number;
  totalDirectCosts: number;
  totalAdministrativeCosts: number;
  totalProfit: number;
  totalProfitPercentage: number;
};
export type ProfitStatsByFundOfPeriodDto = totalStatType & {items: oneMonthProfitStatByFund[]};
