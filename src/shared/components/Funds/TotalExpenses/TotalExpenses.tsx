import classNames from 'classnames';
import {FC, ReactNode} from 'react';

import s from 'shared/components/Funds/Funds.module.scss';

import {convertToFullWide} from '../utils/utils';

interface TotalExpensesProps {
  isDetailed?: boolean;
  children?: ReactNode;
  costs: Costs;
}

type Costs = {
  budgetDifference?: number | null;
  workTime?: number | string;
  totalCosts?: number | string;
  directCosts?: number | null;
  administrativeCosts?: number | null;
};

export const TotalExpenses: FC<TotalExpensesProps> = ({isDetailed, children, costs}) => {
  return (
    <div className={classNames(s.report__item, s.report__itemTotal)}>
      <div className={s.report__subitem}>
        <span className={s.report__text}>
          {costs.workTime || costs.workTime === 0
            ? costs.workTime.toLocaleString('fullwide', {useGrouping: true})
            : '-'}
        </span>
      </div>
      <div className={s.report__subitem}>
        <div className={s.expenses}>
          <div className={s.expenses__group}>
            <div className={s.expenses__item}>
              <span className={classNames(s.expenses__data, s.expenses__dataTotal)}>
                {costs.totalCosts || costs.totalCosts === 0
                  ? costs.totalCosts.toLocaleString('fullwide', {useGrouping: true})
                  : '-'}
              </span>
              {isDetailed && (
                <>
                  <span className={classNames(s.expenses__data, s.expenses__dataDirect)}>
                    {costs?.directCosts || costs?.directCosts === 0 ? convertToFullWide(costs?.directCosts) : '-'}
                  </span>
                  <span className={classNames(s.expenses__data, s.expenses__dataAp)}>
                    {costs?.administrativeCosts || costs?.administrativeCosts === 0
                      ? convertToFullWide(costs?.administrativeCosts)
                      : '-'}
                  </span>
                </>
              )}
              {(costs?.budgetDifference || costs?.budgetDifference === 0) && (
                <span
                  className={classNames(s.expenses__data, {
                    [s.expenses__dataLoss]: costs.budgetDifference < 0,
                    [s.expenses__dataIncome]: costs.budgetDifference >= 0,
                  })}
                >
                  {costs.budgetDifference > 0
                    ? `+${convertToFullWide(costs.budgetDifference)}`
                    : convertToFullWide(costs.budgetDifference)}
                </span>
              )}
            </div>
            <div className={s.expenses__item}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
