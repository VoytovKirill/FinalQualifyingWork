import dayjs from 'dayjs';

const offsetCurrentMonth = 1;
export const currentYear = dayjs().year();

export const currentMonth = dayjs().month() - offsetCurrentMonth;
export const months: any = {
  0: 'Январь',
  1: 'Февраль',
  2: 'Март',
  3: 'Апрель',
  4: 'Май',
  5: 'Июнь',
  6: 'Июль',
  7: 'Август',
  8: 'Сентябрь',
  9: 'Октябрь',
  10: 'Ноябрь',
  11: 'Декабрь',
};
