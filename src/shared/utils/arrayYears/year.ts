import dayjs from 'dayjs';

export const minYear = 2014;
export const getArrayYears = () => {
  const currentYear = dayjs().year();
  const arrayYears = [];
  for (let i = minYear; i <= currentYear; i++) {
    arrayYears.push(i);
  }
  return arrayYears;
};
