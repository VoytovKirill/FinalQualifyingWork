import classNames from 'classnames';
import {FC} from 'react';

import s from 'shared/components/Funds/Funds.module.scss';

interface OneMonthProps {
  period?: string;
}

export const OneMonth: FC<OneMonthProps> = ({period}) => {
  return (
    <div className={classNames(s.report__item, s.report__itemMonth)}>
      <span className={s.report__text}>{period}</span>
    </div>
  );
};
