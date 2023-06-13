import dayjs from 'dayjs';
import {FC, Dispatch, SetStateAction} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';

import s from '../AdditionalExpensesForm.module.scss';
import {ValuesType} from '../types';

type ExtenesType = {
  key: number;
  handleClick: any;
  expense: ValuesType;
};

export const PrevExtensesItem: FC<ExtenesType> = ({handleClick, expense}) => {
  const onClick = () => {
    handleClick();
  };

  return (
    <div className={s.expenese__wrapper}>
      <div className={s.expenese}>
        <span className={s.expenese__box}>{`${expense.expensesName}`}</span>
      </div>
      <Button
        type="button"
        icon={<Icon className={s.dropdown__icon} stroke width={24} height={24} name="arrow-down" />}
        onClick={onClick}
        variants={[ButtonStyleAttributes.icon]}
      />
    </div>
  );
};
