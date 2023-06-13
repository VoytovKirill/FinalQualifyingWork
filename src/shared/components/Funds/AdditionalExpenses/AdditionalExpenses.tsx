import classNames from 'classnames';
import {FC} from 'react';

import {MonthStats} from 'api/dto/Fund';
import s from 'shared/components/Funds/Funds.module.scss';
import {TotalExpenses} from 'shared/components/Funds/TotalExpenses';

import {ParseMonths} from '../ParseMonths';

interface AdditionalExpensesProps {
  header?: string;
  addExpenses?: string;
  costs: MonthStats[];
  totalCosts?: number;
  offset: number;
}

export const AdditionalExpenses: FC<AdditionalExpensesProps> = ({
  addExpenses = 'Доп. Расходы',
  header = 'Дополнительные расходы',
  costs,
  totalCosts,
  offset,
}) => {
  return (
    <div className={s.report__additional}>
      <div className={s.report__additionalTitle}>{header}</div>
      <div className={s.report__line}>
        <div className={s.report__group}>
          <div className={classNames(s.report__item, s.report__itemName)}>
            <div className={s.report__subitem}>
              <div className={s.report__project}>
                <span className={s.report__projectName}>{addExpenses}</span>
                <div className={s.report__projectBuble}>{addExpenses}</div>
              </div>
            </div>
          </div>
          <ParseMonths months={costs} offset={offset} isDetailed={false} />
          <TotalExpenses costs={{totalCosts}} />
        </div>
      </div>
    </div>
  );
};
