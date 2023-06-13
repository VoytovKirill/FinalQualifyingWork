import classNames from 'classnames';
import {FC} from 'react';

import s from 'shared/components/Funds/Funds.module.scss';

interface MonthItemProps {
  monthWorkTime?: string | number;
  expenses?: string | number;
  className?: string;
}

export const MonthItem: FC<MonthItemProps> = ({
  monthWorkTime = 'Часы',
  expenses = 'Затраты (₽)',
  className = 'report__itemMonth',
}) => {
  return (
    <div className={classNames(s.report__item, s[className])}>
      <div className={s.report__subitem}>
        <span className={s.report__text}>{monthWorkTime}</span>
      </div>
      <div className={s.report__subitem}>
        <span className={s.report__text}>{expenses}</span>
      </div>
    </div>
  );
};
