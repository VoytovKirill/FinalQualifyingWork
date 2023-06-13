import {FC, Dispatch, SetStateAction} from 'react';

import {PrevExtensesItem} from '../PrevExtensesItem';
import {ValuesType} from '../types';

type PrevExpensesType = {
  savedExpenses: ValuesType[];
  setValues: Dispatch<SetStateAction<ValuesType>>;
  changeExpenses: (index: number) => void;
  setValidationValues: (newValidateValues: {sum: boolean; date: boolean; expensesName: boolean}) => void;
};

export const PrevExpenses: FC<PrevExpensesType> = ({savedExpenses, setValues, changeExpenses, setValidationValues}) => {
  const handleClick = (expense: ValuesType, index: number) => {
    setValues(expense);
    changeExpenses(index);
    const newValidateValues = {sum: true, date: true, expensesName: true};
    setValidationValues(newValidateValues);
  };
  return (
    <>
      {savedExpenses.map((expense, index) => (
        <PrevExtensesItem expense={expense} handleClick={() => handleClick(expense, index)} key={index} />
      ))}
    </>
  );
};
