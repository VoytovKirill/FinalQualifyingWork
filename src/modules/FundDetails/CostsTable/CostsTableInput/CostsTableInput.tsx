import dayjs from 'dayjs';
import {ChangeEvent, FC, FocusEvent, useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';

import {additionalCostService} from 'api/services/additionalCostService';
import {KeyCodes} from 'shared/constants/keycodes';
import {toasts} from 'shared/constants/toasts';
import {useKeydownPress} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';
import {detailsInfoActions, useRootDispatch} from 'store';

import s from './CostsTable.module.scss';

interface Props {
  initialValue: string;
  id: number;
  date: Date | string;
  name: string;
}

export const CostsTableInput: FC<Props> = ({initialValue, id, date, name}) => {
  const [value, setValue] = useState(initialValue);
  const [prevValue, setPrevValue] = useState(initialValue);
  const cellRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const newDate = new Date(date).setDate(15);
  const {showToast} = useToast();
  const dispatch = useRootDispatch();

  useEffect(() => {
    setValue(initialValue);
    setPrevValue(initialValue);
  }, [initialValue]);

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    setPrevValue(e.target.value);
  };

  const validationNewExpenses = (newExpenses: string) => {
    if (Number(newExpenses.replace(/\s/g, '')) >= 0 || newExpenses === '-') {
      return true;
    } else {
      cellRef.current?.focus();
      setValue(prevValue);
      showToast({type: 'error', description: 'Введите число или прочерк'});
    }
  };

  const createAdditionalCost = async () => {
    const newValue = value.replace(/\s/g, '');
    const params = {
      name,
      date: dayjs(newDate).format('YYYY-MM-DD'),
      sum: Number(newValue) || 0,
      fundId: Number(location.state.id),
    };
    try {
      const response = await additionalCostService.postAdditionalCosts([params]);
      const {id, name, date, sum} = response.data.additionalCostsList[0];
      const updateParams = {
        id,
        name,
        date,
        expenses: sum,
      };
      dispatch(detailsInfoActions.setNewExpenses(updateParams));
      showToast({
        type: 'success',
        description: `Доп. затраты за ${dayjs(newDate).locale('ru').format('MMMM YYYY')} созданы`,
      });
    } catch (e) {
      showToast({type: 'error', description: 'Ошибка при создании доп. затраты'});
      cellRef.current?.focus();
    }
  };

  const updateAdditionalCost = async () => {
    const newValue = value.replace(/\s/g, '');
    try {
      await additionalCostService.updateAdditionalCosts(id, Number(newValue) || 0);
      showToast({
        type: toasts.undo,
        description: `Доп. затраты за ${dayjs(newDate).locale('ru').format('MMMM YYYY')} обновлены`,
        handleBtn: async () => {
          await additionalCostService.updateAdditionalCosts(id, Number(prevValue.replace(/\s/g, '')) || 0);
          dispatch(
            detailsInfoActions.setUpdateExpenses({id, name, expenses: Number(prevValue.replace(/\s/g, '')) || 0}),
          );
          setValue(prevValue);
        },
      });
      dispatch(detailsInfoActions.setUpdateExpenses({id, name, expenses: Number(newValue) || 0}));
    } catch (e) {
      showToast({type: 'error', description: 'Ошибка при обновлении доп. затраты'});
      cellRef.current?.focus();
    }
  };

  const editData = async () => {
    if (validationNewExpenses(value) && value !== initialValue) {
      if (id === -1) {
        await createAdditionalCost();
      } else {
        await updateAdditionalCost();
      }
    }
  };

  const enterPressCallback = () => {
    cellRef.current?.blur();
  };

  const escPressCallback = () => {
    setValue(prevValue);
  };

  useKeydownPress(enterPressCallback, KeyCodes.enter);
  useKeydownPress(escPressCallback, KeyCodes.close);

  return (
    <input
      ref={cellRef}
      className={s.input}
      value={value}
      onChange={(e) => onChangeValue(e)}
      onFocus={(e) => onFocus(e)}
      onBlur={() => editData()}
      maxLength={50}
    />
  );
};
