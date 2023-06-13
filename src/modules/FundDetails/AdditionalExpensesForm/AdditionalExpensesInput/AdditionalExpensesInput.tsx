import {ChangeEvent, Dispatch, FC, SetStateAction, useRef, useState} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {CustomInput} from 'shared/components/form/CustomInput';
import {Icon} from 'shared/components/Icon';

import s from '../AdditionalExpensesForm.module.scss';
import {defaultValue, failedValidationValues, successValidateValue} from '../constants';
import {ValidationValuesType, ValuesType} from '../types';
import {handleChange} from '../utils';

interface Props {
  error: string;
  fundId: number;
  setError: Dispatch<SetStateAction<string>>;
  oldName?: string;
  deleteExpense?: (id: number) => void;
  id: number;
}

export const AdditionalExpensesInput: FC<Props> = ({error, fundId, setError, oldName, deleteExpense, id}) => {
  const [validationValues, setValidationValues] = useState<ValidationValuesType>(failedValidationValues);
  const [values, setValues] = useState<ValuesType>({...defaultValue, fundId, expensesName: oldName || '', id});
  const expensesName = useRef<HTMLInputElement>(null);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    setValidationValues(successValidateValue);
    const config = {setValidationValues, values, setValues, validationValues};
    handleChange(e, config);
  };

  const handleClickButton = () => {
    if (!deleteExpense) return;
    deleteExpense(id);
    setError('');
  };

  return (
    <div className={s.form__field}>
      <CustomInput
        ref={expensesName}
        name="expensesName"
        label="Название"
        styleName="input"
        labelStyle="additionalExpenses"
        className={s.form__input}
        placeholder="Домен"
        onChangeInput={handleChangeInput}
        required
        type="text"
        error={validationValues.expensesName ? '' : error}
        value={values.expensesName}
        maxLength={50}
      />
      {!!deleteExpense && (
        <Button
          onClick={handleClickButton}
          className={s.form__btn_delete}
          variants={[ButtonStyleAttributes.withoutBg]}
          icon={<Icon height={12} width={12} name="cross" fill />}
        />
      )}
    </div>
  );
};
