import dayjs from 'dayjs';

import {currentYear} from 'shared/constants/actualDate';

export const DATE_API_FORMAT = 'YYYY-MM-DD';

export const prepareDate = (date: Date | null, format: string) => {
  if (!date) return null;
  return dayjs(date).format(format);
};
export const initialStartDate = () => {
  const monthIndex = dayjs().month();
  const januaryIndex = 0;
  if (monthIndex === januaryIndex) {
    return dayjs(new Date(currentYear - 1, 0, 1)).format('YYYY-MM-DD');
  }
  return dayjs(new Date(currentYear, 0, 1)).format('YYYY-MM-DD');
};

export const startDateTimeZone = (date: string | null) => {
  if (!date) return null;
  const actualDate = new Date(`${date}T21:00:13.088Z`);
  return new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() - 1).toISOString();
};

export const endDateTimeZone = (date: string | null) => {
  if (!date) return null;
  return new Date(`${date}T21:00:13.088Z`).toISOString();
};
