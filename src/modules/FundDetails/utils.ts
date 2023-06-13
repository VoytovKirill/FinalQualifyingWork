import dayjs from 'dayjs';

import {EmployeeStats, FondDto, FullAdditionalStats, FullDetailedStats} from 'api/dto/Fund';
import {currentYear} from 'shared/constants/actualDate';

import {aboutProjectRows, totalCostsRows} from './constants';
import s from './FundDetails.module.scss';

import {prepareDesiredMonths} from '../../shared/utils/prepareDesiredMonths/prepareDesiredMonths';

export type GeneralIncomeInfoType = {
  fundId: number;
  income: number;
  directCosts: number;
  administrativeCosts: number;
  profit: number;
  profitPercentage: number;
  additionalCosts: number;
};

export type AboutProject = {
  startDate: string;
  endDate: string;
  contractPrice: number;
  budget: number;
};

export type CostsRow = {
  lifetimeWorkTime: number;
  lifetimeTotalCosts: number;
  lifetimeAdditionalCosts: number;
  lifetimeDirectCosts: number;
  lifetimeAdministrativeCosts: number;
  budgetDeviation: number;
};

export const mappingAboutProject = (info: AboutProject) => {
  type projectKeyType = keyof AboutProject;
  const aboutProject = Object.keys(info).map((key) => {
    return info[key as projectKeyType];
  });
  const mappedRows = aboutProjectRows.map((item, index) => {
    return {...item, data: aboutProject[index]};
  });
  return mappedRows.filter((item) => {
    return item.data !== '';
  });
};

export const mappingCostsRows = (info: CostsRow) => {
  type costsKeyType = keyof CostsRow;
  const costsRow = Object.keys(info).map((key) => {
    return info[key as costsKeyType];
  });
  const mappedRows = totalCostsRows.map((item, index) => {
    if (costsRow[index] === -1) return {...item, data: -1};
    const cost = costsRow[index] ? costsRow[index] : 0;
    if (item.name === 'Отклонение от бюджета') {
      const isPositive = cost >= 0;
      const className = isPositive ? s.fundCard__detailsLine_info : s.fundCard__detailsLine_warning;
      const prefix = isPositive ? '+' : '-';
      return {...item, data: `${prefix} ${Math.abs(cost).toLocaleString('fullwide', {useGrouping: true})}`, className};
    }
    return {...item, data: cost.toLocaleString('fullwide', {useGrouping: true})};
  });

  return mappedRows.filter((item) => item.data !== -1);
};

export const prepareProjectDate = (date: string | null) => {
  if (!date) return '';
  const toString = new Date(date).toLocaleString('ru-RU', {year: 'numeric', month: 'long', day: 'numeric'});
  return toString.slice(0, toString.length - 1);
};

export const mappingCommonInfo = (info: FondDto) => {
  const {monthStats, totalStats} = info;
  const parsedData = monthStats.map((item) => {
    return {
      dateFrom: dayjs(new Date()).format('YYYY-MM-DD'),
      dateTo: dayjs(new Date()).format('YYYY-MM-DD'),
      monthWorkTime: item?.workTime || '-',
      expenses: item?.totalCosts || '-',
      doubleRateWorkTime: item?.doubleRateWorkTime || 0,
    };
  });
  return {
    type: 'common',
    name: 'Общие',
    expenses: totalStats.totalCosts || 0,
    statisticsDataModels: parsedData,
    totalWorkTime: totalStats.workTime || 0,
    isMissingSalaryRate: false,
  };
};

export const mappingAdditionalCosts = (additionalCosts: FullAdditionalStats[], allDesiredMonths: string[]) => {
  return additionalCosts.map((addCost) => {
    const {name, totalCost, monthAdditionalStatistics} = addCost;
    const addExpense = prepareDesiredMonths(allDesiredMonths, monthAdditionalStatistics).map((monthStat) => {
      if (typeof monthStat !== 'string') {
        return {
          dateFrom: monthStat?.date || '',
          dateTo: '',
          monthWorkTime: '-',
          expenses: monthStat?.cost || '-',
          id: monthStat?.id || -1,
          isChangeable: true,
        };
      } else {
        return {
          dateFrom: monthStat,
          dateTo: '',
          monthWorkTime: '-',
          expenses: '-',
          id: -1,
          isChangeable: true,
        };
      }
    });
    return {
      type: 'additional',
      name,
      expenses: totalCost,
      statisticsDataModels: addExpense,
      totalWorkTime: 0,
      isMissingSalaryRate: false,
      isAdditionalCosts: true,
    };
  });
};

export const mappingEmployeesInfo = (info: FullDetailedStats, allDesiredMonths: string[]) => {
  const {employeeStats, additionalCosts} = info;

  const mappedEmployeeList = employeeStats.map((employeeStat: EmployeeStats) => {
    const {fullName, totalStats, missingSalaryRates, monthStats} = employeeStat;
    const statisticsDataModels = monthStats.map((monthStat) => {
      return {
        dateFrom: '',
        dateTo: '',
        monthWorkTime: monthStat?.workTime || '-',
        expenses: monthStat?.sum || '-',
        doubleRateWorkTime: monthStat?.doubleRateWorkTime || 0,
      };
    });
    return {
      type: 'persone',
      name: fullName,
      expenses: totalStats.sum,
      statisticsDataModels: statisticsDataModels,
      totalWorkTime: totalStats.workTime,
      isMissingSalaryRate: missingSalaryRates,
    };
  });

  const mappedAdditionalCosts = mappingAdditionalCosts(additionalCosts, allDesiredMonths);

  return [...mappedEmployeeList, ...mappedAdditionalCosts];
};
export const getInitialDateInterval = (): Date[] => {
  const year = currentYear;
  const startDate = `${year}-01-01`;
  const endDate = `${year + 1}-01-01`;
  return [new Date(startDate), new Date(endDate)];
};
