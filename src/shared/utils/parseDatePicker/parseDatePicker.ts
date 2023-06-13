import {months} from 'shared/constants/actualDate';

export const parseDatePicker = (start: Date | string | null, end: Date | string | null) => {
  const iterationDate = start ? new Date(start) : new Date();
  const tempEndDate = end ? new Date(end) : new Date();
  tempEndDate.setDate(28);
  const monthsArray: string[] = [];

  while (iterationDate <= tempEndDate) {
    monthsArray.push(`${months[iterationDate.getMonth()]} ${iterationDate.getFullYear()}`);
    iterationDate.setMonth(iterationDate.getMonth() + 1);
  }

  return monthsArray;
};
