import classNames from 'classnames';
import {FC, useRef, useEffect, FormEventHandler, useState} from 'react';

import {additionalCostService} from 'api/services/additionalCostService';
import {fundService} from 'api/services/fundsService';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {Modal, ModalStyle} from 'shared/components/Modal';
import {KeyCodes} from 'shared/constants/keycodes';
import {useKeydownPress} from 'shared/hooks';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';
import {useToast} from 'shared/hooks/useToast';
import {detailInfoSelectors, detailsInfoActions, useRootDispatch, useRootSelector} from 'store';

import s from './AdditionalExpensesForm.module.scss';
import {AdditionalExpensesInput} from './AdditionalExpensesInput';
import {
  COUNT_ERROR,
  EMPTY_ERROR,
  failedValidationValues,
  maxAdditionalField,
  CREATE_ERROR,
  CREATE_SUCCESS,
  UPDATE_ERROR,
  UPDATE_SUCCESS,
  DEFAULT_INPUT_ID,
} from './constants';
import {ValidationValuesType, ValuesType} from './types';
import {cuttingExistNames, mapAdditionalExpenses, prepareValues} from './utils';

import {mappingAdditionalCosts} from '../utils';

type Props = {
  fundId: number;
  close: () => void;
  type?: string;
  oldName?: string;
  allDesiredMonths?: string[];
};

export const AdditionalExpensesForm: FC<Props> = ({
  fundId,
  close,
  type = 'newAdditionalExpenses',
  oldName = '',
  allDesiredMonths,
}) => {
  const expensesName = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [validationValues, setValidationValues] = useState<ValidationValuesType>(failedValidationValues);
  const [error, setError] = useState('');
  const [prevExpenseList, setPrevExpenseList] = useState<ValuesType[]>([]);
  const {showToast} = useToast();
  const isUpdateCurrentExpenses = type !== 'newAdditionalExpenses';
  const dispatch = useRootDispatch();
  const tableData = useRootSelector(detailInfoSelectors.getTableData);

  useEffect(() => {
    expensesName.current?.focus();
  }, []);

  useOutsideClick(formRef, close);
  useKeydownPress(close, KeyCodes.close);

  const validateForm = (form: HTMLFormElement, isAddNewExp = false) => {
    if (form instanceof HTMLFormElement) {
      const elements = [...(form.elements as any)].filter((element: any) => element.nodeName === 'INPUT');
      const filteredElements = elements.filter((element: any) => element.value.replace(/\s/g, ''));
      const isOnlySpace = elements.length === filteredElements.length;
      const isError = !form.checkValidity() || !isOnlySpace;
      const isExceed = prevExpenseList.length === maxAdditionalField;
      if (isError) {
        setError(EMPTY_ERROR);
      } else if (isExceed && isAddNewExp) {
        setError(COUNT_ERROR);
        return !isExceed;
      }
      return !isError;
    }
  };

  const addNewExpenses = () => {
    if (validateForm(formRef.current!, true)) {
      const newPrevExpenseList = [...prevExpenseList, {expensesName: '', fundId, id: Date.now()} as ValuesType];
      setPrevExpenseList(newPrevExpenseList);
      const newValidateValues = {...validationValues, expensesName: false};
      setValidationValues(newValidateValues);
    }
  };

  const deleteExpenses = (id: number) => {
    const newPrevExpenseList = prevExpenseList.filter((expense) => expense.id !== id);
    setPrevExpenseList(newPrevExpenseList);
  };

  const submitNewExpenses: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const newValidateValues = {...validationValues};
    setValidationValues(newValidateValues);
    const firstMonthForCreate = allDesiredMonths ? allDesiredMonths[0] : '';
    const list = prepareValues(e.currentTarget.elements);
    const notExistList = cuttingExistNames(tableData, list);
    const params = mapAdditionalExpenses(notExistList, fundId, firstMonthForCreate);

    try {
      const {data} = await additionalCostService.postAdditionalCosts(params);

      const additionalCostRow = data.additionalCostsList.map((item: any) => {
        const {id, name, date, sum} = item;
        const monthStat = {
          id,
          name,
          date,
          cost: sum,
        };
        return {
          name,
          monthAdditionalStatistics: [monthStat],
          totalCost: 0,
        };
      });

      const mappedRow = mappingAdditionalCosts(additionalCostRow, allDesiredMonths!);
      dispatch(detailsInfoActions.setDefaultExpenses(mappedRow));
      showToast({type: 'success', description: CREATE_SUCCESS});
      close();
    } catch (err) {
      showToast({type: 'error', description: CREATE_ERROR});
    }
  };

  const submitUpdateExpenses: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const list = prepareValues(e.currentTarget.elements);
    const mappedExpenses = mapAdditionalExpenses(list, fundId);
    const params = {
      oldName,
      newName: mappedExpenses[0].name,
      fundId,
    };
    try {
      await fundService.updateNameAddCosts(fundId, params);
      showToast({type: 'success', description: UPDATE_SUCCESS});
      dispatch(detailsInfoActions.setChangeName(params));
      close();
    } catch (e) {
      showToast({type: 'error', description: UPDATE_ERROR});
    }
  };

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm(e.currentTarget);
    if (isFormValid) {
      if (isUpdateCurrentExpenses) {
        submitUpdateExpenses(e);
      } else {
        submitNewExpenses(e);
      }
    }
  };

  return (
    <Modal modalStyle={ModalStyle.additionalExpenses}>
      <form className={s.form} onSubmit={submit} noValidate ref={formRef}>
        <h2 className={s.form__title}>Дополнительные расходы</h2>

        <AdditionalExpensesInput
          setError={setError}
          fundId={fundId}
          error={error}
          oldName={isUpdateCurrentExpenses ? oldName : ''}
          id={DEFAULT_INPUT_ID}
        />

        {prevExpenseList?.map((expenses) => {
          return (
            <AdditionalExpensesInput
              key={expenses.id}
              id={expenses.id}
              setError={setError}
              fundId={fundId}
              error={error}
              deleteExpense={deleteExpenses}
            />
          );
        })}

        {!!error && <span className={s.form__error}>{error}</span>}
        <div className={s.form__btnBox}>
          {!isUpdateCurrentExpenses && (
            <Button
              className={classNames(s.form__btn, s.form__btn_pale)}
              variants={[ButtonStyleAttributes.colorPale, ButtonStyleAttributes.reverse]}
              icon={<Icon width={10} height={10} name="paleCross" className={s.form__cross} />}
              onClick={addNewExpenses}
              type="button"
            >
              Строка
            </Button>
          )}
        </div>
        <div className={s.form__btnBox}>
          <Button className={s.form__btn} variants={[ButtonStyleAttributes.colorGreen]}>
            {isUpdateCurrentExpenses ? 'Изменить' : 'Внести'}
          </Button>
          {!isUpdateCurrentExpenses && (
            <Button
              className={s.form__btn}
              variants={[ButtonStyleAttributes.colorLightGreen]}
              type="button"
              onClick={close}
            >
              Отмена
            </Button>
          )}
          <Button
            type="button"
            className={s.form__btn_cross}
            variants={[ButtonStyleAttributes.withoutBg]}
            onClick={close}
            icon={<Icon height={12} width={12} name="cross" fill />}
          />
        </div>
      </form>
    </Modal>
  );
};
