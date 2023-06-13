import classNames from 'classnames';
import {FC} from 'react';

import s from 'shared/components/Funds/Funds.module.scss';
import {ParseMonths} from 'shared/components/Funds/ParseMonths';
import {TotalExpenses} from 'shared/components/Funds/TotalExpenses';
import {UserInFond} from 'shared/components/Funds/userInFond';

interface EmployeeItemProps {
  user: UserInFond;
  offset: number;
}

export const EmployeeItem: FC<EmployeeItemProps> = ({offset, user}) => {
  const {totalStats, monthStats, fullName, missingSalaryRates} = user;
  return (
    <div className={classNames(s.report__line, missingSalaryRates ? s.report__lineWarning : null)}>
      <div className={s.report__group}>
        <div className={classNames(s.report__item, s.report__itemName)}>
          <div className={s.report__subitem}>
            <div className={s.report__project}>
              <span className={s.report__projectName}>{fullName}</span>
              <div className={s.report__projectBuble}>{fullName}</div>
            </div>
          </div>
        </div>
        <ParseMonths months={monthStats} offset={offset} isDetailed={false} />
        <TotalExpenses costs={{workTime: totalStats.workTime, totalCosts: totalStats.totalCosts}} />
      </div>
    </div>
  );
};
