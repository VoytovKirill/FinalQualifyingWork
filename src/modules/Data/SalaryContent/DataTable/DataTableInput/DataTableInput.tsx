import {useState, ChangeEvent, useRef, FC, FocusEvent} from 'react';

import {salaryService} from 'api';
import {TableNote} from 'shared/components/TableNote';
import {KeyCodes} from 'shared/constants/keycodes';
import {toasts} from 'shared/constants/toasts';
import {useKeydownPress} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';

import s from './DataTableItem.module.scss';

const NO_RATE_ERROR = 'Не указана ставка партнёра';

interface DataTableInputProps {
  text?: string;
  warning?: boolean;
  employeeId: number;
  from: string;
  mounthName: string;
  employeeFullName: string;
  dataMeta: any;
  isMissingSalaryRates: boolean;
}

export const DataTableInput: FC<DataTableInputProps> = ({
  warning,
  employeeId,
  text = '',
  from,
  mounthName,
  employeeFullName,
  dataMeta,
  isMissingSalaryRates,
}) => {
  const [value, setValue] = useState<string>(text);
  const {showToast, dismiss} = useToast();
  const cellRef = useRef<HTMLInputElement>(null);

  const [prevValue, setPrevValue] = useState<string>(text);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setPrevValue(e.target.value);
  };

  const validationNewRate = (newRate: string) => {
    if (newRate.length > 0 && Number(newRate) >= 0) {
      return true;
    } else {
      cellRef.current?.focus();
      setValue(prevValue);
    }
  };

  async function endEdit() {
    if (validationNewRate(value) && value !== text) {
      try {
        const lastLimitRate = isMissingSalaryRates ? null : from;
        await salaryService.updateRateByEmployeeId({employeeId, rate: Number(value), from, to: lastLimitRate});
        if (isMissingSalaryRates) await dataMeta.updateData();
        dismiss();

        showToast({
          type: toasts.undo,
          description: `Ставка «${employeeFullName}» за ${mounthName} ${dataMeta.year} была изменена.`,
          handleBtn: async () => {
            await salaryService.updateRateByEmployeeId({employeeId, rate: Number(prevValue), from, to: lastLimitRate});
            await dataMeta.updateData();
          },
        });
      } catch (err) {
        showToast({
          type: toasts.error,
          description: `Ставка «${employeeFullName}» за ${mounthName} ${dataMeta.year} не изменена.`,
        });
        cellRef.current?.focus();
      }
    }
  }

  const enterPressCallback = () => {
    cellRef.current?.blur();
  };

  useKeydownPress(enterPressCallback, KeyCodes.enter);

  return (
    <>
      <input
        ref={cellRef}
        className={s.input}
        type="number"
        value={value}
        onChange={(e) => handleChange(e)}
        onFocus={(e) => handleFocus(e)}
        onBlur={() => endEdit()}
      />
      {warning && <TableNote text={NO_RATE_ERROR} />}
    </>
  );
};
