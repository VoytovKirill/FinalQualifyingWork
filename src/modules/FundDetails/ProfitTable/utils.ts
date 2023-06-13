import {oneMonthProfitStatByFund, totalStatType} from 'api/dto/Income';

export const addFirstAnfLastDataColumns = (
  statArray: Array<string | number>[],
  totalStat: totalStatType,
): Array<string | number>[] => {
  const firstColumn = ['Выручка', 'ПЗ', '+АЗ', 'Прибыль', 'Прибыль (%)'];
  const totalStatArray = Object.values(totalStat).slice(1);
  return statArray.map((item, i) => [firstColumn[i], ...item, totalStatArray[i]]);
};
export const getColumnsData = (
  statArray: oneMonthProfitStatByFund[],
  totalStat: totalStatType,
): Array<string | number>[] => {
  const revenueList: Array<string | number> = [
    'Выручка',
    ...statArray.map((item) => item.income || '-'),
    totalStat.totalIncome || '-',
  ];
  const directCostsList: Array<string | number> = [
    'ПЗ',
    ...statArray.map((item) => item.directCosts || '-'),
    totalStat.totalDirectCosts || '-',
  ];
  const administrativeCostsList: Array<string | number> = [
    '+АЗ',
    ...statArray.map((item) => item.administrativeCosts || '-'),
    totalStat.totalAdministrativeCosts || '-',
  ];
  const profitList: Array<string | number> = [
    'Прибыль',
    ...statArray.map((item) => item.profit || '-'),
    totalStat.totalProfit || '-',
  ];
  const percentageProfitList: Array<string | number> = [
    'Прибыль (%)',
    ...statArray.map((item) => item.profitPercentage || '-'),

    totalStat.totalProfitPercentage || '-',
  ];
  return [revenueList, directCostsList, administrativeCostsList, profitList, percentageProfitList];
};

export const getHeaders = (monthWithYearArray: string[]): string[] => {
  const headers: string[] = [...monthWithYearArray];
  headers.push('Итого');
  headers.unshift('Название');
  return headers;
};
