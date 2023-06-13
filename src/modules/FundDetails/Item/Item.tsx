import classNames from 'classnames';
import {FC, useState} from 'react';
import {useLocation} from 'react-router-dom';

import {Button} from 'shared/components/Button';
import {DoubleRate} from 'shared/components/Funds/DoubleRate';
import s from 'shared/components/Funds/Funds.module.scss';
import {StatisticsDataModels} from 'shared/components/Funds/monthData';
import {convertToFullWide} from 'shared/components/Funds/utils/utils';
import {Icon} from 'shared/components/Icon';

import {AdditionalExpensesForm} from '../AdditionalExpensesForm';
import {CostsTableInput} from '../CostsTable/CostsTableInput';
import {DeleteExpensesForm} from '../DeleteExpensesForm';

interface ItemProps {
  hours: string | number;
  expenses: string;
  percent?: string | number;
  isAdditionalExpenses?: boolean;
  statisticsDataModels?: StatisticsDataModels;
  name?: string;
}

export const Item: FC<ItemProps> = ({
  hours,
  expenses,
  isAdditionalExpenses = false,
  statisticsDataModels,
  name = '',
}) => {
  const location = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const openUpdate = () => {
    setIsUpdate(true);
  };

  const closeUpdate = () => {
    setIsUpdate(false);
  };

  const openDelete = () => {
    setIsDelete(true);
  };

  const closeDelete = () => {
    setIsDelete(false);
  };

  return (
    <>
      <div>{hours}</div>
      {statisticsDataModels?.isChangeable ? (
        <CostsTableInput
          initialValue={expenses}
          id={statisticsDataModels.id!}
          date={statisticsDataModels.dateFrom}
          name={name}
        />
      ) : (
        <>
          <div>{expenses}</div>
          {typeof statisticsDataModels?.doubleRateWorkTime === 'number' &&
            statisticsDataModels?.doubleRateWorkTime > 0 && (
            <DoubleRate doubleRate={convertToFullWide(statisticsDataModels.doubleRateWorkTime)} />
          )}
        </>
      )}

      {isAdditionalExpenses && (
        <>
          <Button
            onClick={openUpdate}
            className={classNames(s.ctrlButton, s.ctrlButtonIcon, s.expenses__button, s.expenses__buttonEdit)}
            icon={<Icon fill className={s.ctrlButton__icon} height={24} width={22} name="pencil" />}
          />
          <Button
            onClick={openDelete}
            className={classNames(s.ctrlButton, s.ctrlButtonIcon, s.expenses__button, s.expenses__buttonDelete)}
            icon={<Icon stroke className={s.ctrlButton__icon} height={24} width={22} name="basket" />}
          />
          {isUpdate && (
            <AdditionalExpensesForm fundId={location.state.id} close={closeUpdate} type="updateName" oldName={name} />
          )}
          {isDelete && <DeleteExpensesForm fundId={location.state.id} close={closeDelete} name={name} />}
        </>
      )}
    </>
  );
};
