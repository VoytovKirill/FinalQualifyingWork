import classNames from 'classnames';
import {FC, ReactNode, useEffect, useState} from 'react';

import s from 'shared/components/Funds/Funds.module.scss';
import {MonthItem} from 'shared/components/Funds/MontsItem';
import {RadioButton} from 'shared/components/RadioButton';

interface TableHeaderLineProps {
  months: string[];
  toggleAllSelected: () => void;
  isAllSelected: boolean;
}

export const TableLineHeader: FC<TableHeaderLineProps> = ({months, toggleAllSelected, isAllSelected}) => {
  const [countMonths, setCountMonths] = useState<ReactNode[]>();

  const countingNumberOfMonths = () => {
    return months.filter((month, index) => index < 4).map((month) => <MonthItem key={month} />);
  };

  const onChecked = () => {
    toggleAllSelected();
  };

  useEffect(() => {
    setCountMonths(countingNumberOfMonths);
  }, [months]);

  return (
    <div className={classNames(s.report__line, s.report__lineHeader)}>
      <div className={s.report__group}>
        <div className={classNames(s.report__item, s.report__itemName)}>
          <div className={s.report__subitem}>
            <RadioButton handleChange={onChecked} isChecked={isAllSelected} />
          </div>
          <div className={s.report__subitem}>
            <span className={s.report__text}>Название</span>
          </div>
        </div>
        {countMonths}
        <MonthItem className="report__itemTotal" />
      </div>
    </div>
  );
};
