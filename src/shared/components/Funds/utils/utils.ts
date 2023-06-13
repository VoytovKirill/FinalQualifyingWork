import {FondDto, EmployeeStats} from 'api/dto/Fund';
import {ShortFundDto} from 'api/dto/ShortFund';
import {fundService} from 'api/services/fundsService';
import {mockStatistics} from 'shared/constants/fundStatisticsData';
import {SearchListItem} from 'typings/global';

import {UserInFond} from '../userInFond';

const transformShortFundDtoList = (shortFundsDtoList: ShortFundDto[]): SearchListItem[] => {
  return shortFundsDtoList.map(({name, id}) => ({text: name, id}));
};

export const getShortFundsList = async (isTrackedOnly: boolean) => {
  try {
    const {data} = await fundService.getShortFunds(isTrackedOnly);
    return transformShortFundDtoList(data);
  } catch (err: any) {
    return [];
  }
};

export const prepareAllFunds = (allFunds: FondDto[], countDesiredMonths: number) => {
  if (!allFunds.length) return allFunds;
  return allFunds.map((fund: FondDto): FondDto => {
    const countMonthsInFund = fund.monthStats.length;
    if (countMonthsInFund === countDesiredMonths) {
      return {
        ...fund,
        monthStats: fund.monthStats.map((month) => {
          if (!month) return mockStatistics;
          return month;
        }),
      };
    } else if (countMonthsInFund < countDesiredMonths) {
      const countMockObj = countDesiredMonths - countMonthsInFund;
      const arrayMockStatics = Array(countMockObj).fill(mockStatistics);
      return {
        ...fund,
        monthStats: [
          ...fund.monthStats.map((month) => {
            if (!month) return mockStatistics;
            return month;
          }),
          ...arrayMockStatics,
        ],
      };
    } else if (countMonthsInFund > countDesiredMonths) {
      return {
        ...fund,
        monthStats: fund.monthStats
          .filter((month, index) => index < countDesiredMonths)
          .map((month) => {
            if (!month) return mockStatistics;
            return month;
          }),
      };
    }
    return fund;
  });
};

export const prepareFundEmployee = (employees: EmployeeStats[], countDesiredMonths: number) => {
  return employees.map((employee: EmployeeStats): UserInFond => {
    const countMonthsEmployee = employee.monthStats.length;
    if (countMonthsEmployee === countDesiredMonths) {
      return {
        ...employee,
        totalStats: {workTime: employee.totalStats.workTime, totalCosts: employee.totalStats.sum},
        monthStats: employee.monthStats.map((month) => {
          if (!month) return mockStatistics;
          return {workTime: month.workTime, totalCosts: month.sum, doubleRateWorkTime: month.doubleRateWorkTime};
        }),
      };
    } else if (countMonthsEmployee < countDesiredMonths) {
      const countMockObj = countDesiredMonths - countMonthsEmployee;
      const arrayMockStatics = Array(countMockObj).fill(mockStatistics);
      return {
        ...employee,
        totalStats: {workTime: employee.totalStats.workTime, totalCosts: employee.totalStats.sum},
        monthStats: [
          ...employee.monthStats.map((month) => {
            if (!month) return mockStatistics;
            return {workTime: month.workTime, totalCosts: month.sum, doubleRateWorkTime: month.doubleRateWorkTime};
          }),
          ...arrayMockStatics,
        ],
      };
    } else if (countMonthsEmployee > countDesiredMonths) {
      return {
        ...employee,
        totalStats: {workTime: employee.totalStats.workTime, totalCosts: employee.totalStats.sum},
        monthStats: employee.monthStats
          .filter((month, index) => index < countDesiredMonths)
          .map((month) => {
            if (!month) return mockStatistics;
            return {workTime: month.workTime, totalCosts: month.sum, doubleRateWorkTime: month.doubleRateWorkTime};
          }),
      };
    }
    return {
      ...employee,
      totalStats: {workTime: employee.totalStats.workTime, totalCosts: employee.totalStats.sum},
      monthStats: employee.monthStats.map((month) => {
        if (!month) return mockStatistics;
        return {workTime: month.workTime, totalCosts: month.sum, doubleRateWorkTime: month.doubleRateWorkTime};
      }),
    };
  });
};

export const prepareAdditionalExpenses = (expenses: number[], countDesiredMonths: number) => {
  if (expenses.length === countDesiredMonths) {
    return expenses.map((expense) => ({workTime: '-', totalCosts: expense}));
  } else if (expenses.length > countDesiredMonths) {
    return expenses
      .filter((item, index) => index < countDesiredMonths)
      .map((expense) => ({workTime: '-', totalCosts: expense}));
  } else {
    const countMockObj = countDesiredMonths - expenses.length;
    const arrayMockStatics = Array(countMockObj).fill(mockStatistics);
    return [...expenses.map((expense) => ({workTime: '-', totalCosts: expense})), ...arrayMockStatics];
  }
};

export const convertToFullWide = (value: number | undefined | null) => {
  if (typeof value !== 'number') return null;
  return value.toLocaleString('fullwide', {
    useGrouping: true,
  });
};

export const saveFile = (file: Blob, name: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.style.display = 'none';
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getUtf8FileName = (disposition: string) => {
  const utf8FilenameRegex = /filename\*?=([^']*'')?([^;]*)/;
  let filename = '';
  const matches = utf8FilenameRegex.exec(disposition);
  if (matches != null && matches[2]) {
    filename = decodeURIComponent(matches[2].replace(/['"]/g, ''));
  }
  return filename;
};

export const mappingTrackedFundsInfo = (funds: string[], shortFundsList: SearchListItem[]) => {
  return funds.map((fundId: string) => {
    const currentFund = shortFundsList.find((fundList) => String(fundList.id) === fundId);
    return currentFund ? currentFund.text : '';
  });
};

export const reorderFunds = (searchFund: any, data: any, setTotalSize: (size: number) => void) => {
  const idToMove = searchFund.id || searchFund.fundId;
  const index = data.items.findIndex((element: any) => element.id === idToMove || element.fundId === idToMove);
  if (index !== -1) {
    const [removedElement] = data.items.splice(index, 1);
    data.items.unshift(removedElement);
    setTotalSize(data.totalSize);
  } else {
    data.items.unshift(searchFund);
    setTotalSize(data.totalSize + 1);
  }
};
