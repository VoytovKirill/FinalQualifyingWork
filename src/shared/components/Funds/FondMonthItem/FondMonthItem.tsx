import classNames from 'classnames';
import {FC} from 'react';

import {MonthStats} from 'api/dto/Fund';
import {DoubleRate} from 'shared/components/Funds/DoubleRate';
import s from 'shared/components/Funds/Funds.module.scss';

import {convertToFullWide} from '../utils/utils';

interface FondMonthItem {
  month: MonthStats | null;
  className?: string;
  isDetailed: boolean;
}

export const FondMonthItem: FC<FondMonthItem> = ({month, className = 'report__itemMonth', isDetailed}) => {
  const finalValueTime = typeof month?.workTime === 'number' ? convertToFullWide(month.workTime) : month?.workTime;
  const finalValueExpenses =
    typeof month?.totalCosts === 'number' ? convertToFullWide(month.totalCosts) : month?.totalCosts;
  const finalDoubleRate =
    typeof month?.doubleRateWorkTime === 'number' && month?.doubleRateWorkTime > 0
      ? convertToFullWide(month.doubleRateWorkTime)
      : null;

  return (
    <div className={classNames(s.report__item, s[className])}>
      <div className={s.report__subitem}>
        <span className={s.report__text}>{finalValueTime || '-'}</span>
      </div>
      <div className={s.report__subitem}>
        {isDetailed ? (
          <>
            <span className={s.report__text}>{finalValueExpenses}</span>
            <span className={classNames(s.report__text, s.report__textGreen)}>
              {month?.directCosts || month?.directCosts === 0 ? convertToFullWide(month?.directCosts) : '-'}
            </span>
            <span className={classNames(s.report__text, s.report__textYellow)}>
              {month?.administrativeCosts || month?.administrativeCosts === 0
                ? convertToFullWide(month?.administrativeCosts)
                : '-'}
            </span>
          </>
        ) : (
          <span className={s.report__text}>{finalValueExpenses || '-'}</span>
        )}
      </div>
      {finalDoubleRate && <DoubleRate doubleRate={finalDoubleRate} />}
    </div>
  );
};
