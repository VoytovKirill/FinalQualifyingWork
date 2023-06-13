import {prepareDate} from './prepareDate';

export const convertDefaultDate = (endDate: string | null, offset = 0) => {
  if (endDate) {
    const date = new Date(endDate);
    return prepareDate(new Date(date.getFullYear(), date.getMonth() + offset, 1), 'YYYY-MM-DD');
  }
  return endDate;
};
