import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {MonthAdditionalStatistics} from 'api/dto/Fund';

export const prepareDesiredMonths = (allDesiredMonths: string[], additionalExpenses: MonthAdditionalStatistics[]) => {
  const tempAddExp = [...additionalExpenses];
  dayjs.extend(customParseFormat);
  const convertMonth = allDesiredMonths.map((stringMonth) => {
    return dayjs(stringMonth.toLowerCase(), 'MMMM YYYY', 'ru');
  });
  const convertToString = convertMonth.map((month) => {
    return dayjs(month).format('YYYY-MM-DD');
  });
  additionalExpenses.forEach((monthItem) => {
    convertToString.push(monthItem.date);
  });
  const allMonths = convertToString.sort().map((month) => {
    return new Date(month);
  });

  const currentMonths = allMonths
    .map((month, index) => {
      if (month.getMonth() === allMonths[index + 1]?.getMonth()) return undefined;
      if (month.getDate() === 1) return dayjs(month).format('YYYY-MM-DD');
      return month;
    })
    .filter((month) => month !== undefined);

  return currentMonths.map((month) => {
    if (typeof month !== 'string') return tempAddExp.shift();
    return month;
  });
};
