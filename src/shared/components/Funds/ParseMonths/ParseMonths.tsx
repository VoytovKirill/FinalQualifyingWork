import {FC} from 'react';

import {MonthStats} from 'api/dto/Fund';

import {FondMonthItem} from '../FondMonthItem';

interface ParseMonthsProps {
  fondItem?: boolean;
  months: (MonthStats | null)[];
  offset: number;
  isDetailed: boolean;
}

export const ParseMonths: FC<ParseMonthsProps> = ({months, offset, isDetailed}) => {
  if (!months) return null;
  const parseMonths = () => {
    return months
      .filter((month, index) => index >= offset && index < offset + 4)
      .map((month, index) => <FondMonthItem key={index} month={month} isDetailed={isDetailed} />);
  };
  return <>{parseMonths()}</>;
};
