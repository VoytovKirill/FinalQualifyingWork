import dayjs from 'dayjs';
import {FormEventHandler, useEffect, useState} from 'react';

import {calculationsService} from 'api/services/calculationCostService';
import {Button} from 'shared/components/Button';
import {DatePicker} from 'shared/components/DatePicker';
import {DatePickerType} from 'shared/components/DatePicker/DatePicker';
import {Icon} from 'shared/components/Icon';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {prepareDate} from 'shared/utils/prepareDate/prepareDate';

import s from './Form.module.scss';

const ERROR_END_DATE_BEFORE_START_DATE = 'Дата завершения раньше даты начала периода';
const ERROR_DATE_NOT_DEFINED = 'Период не определён';
const ERROR_RECALCULATIONS = 'Возникла ошибка при перерасчёте  затрат';

export const Form = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {showToast} = useToast();

  useEffect(() => {
    if (error) setError('');
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      setError(ERROR_END_DATE_BEFORE_START_DATE);
    }
  }, [startDate, endDate]);

  const recalculateCosts = async () => {
    try {
      const from = prepareDate(startDate, 'YYYY-MM-DD');
      const to = prepareDate(endDate, 'YYYY-MM-DD');
      if (from && to) await calculationsService.calculateFundCostsByPeriod(from, to);
    } catch (err) {
      showToast({type: toasts.error, description: ERROR_RECALCULATIONS});
    } finally {
      setLoading(false);
    }
  };

  const cancelLoading = () => setLoading(false);

  const onSubmitHandler: FormEventHandler = async (e) => {
    e.preventDefault();

    if (!(startDate && endDate)) {
      setError(ERROR_DATE_NOT_DEFINED);
      return;
    }
    if (error) return;

    if (!loading) {
      setLoading(true);
      showToast({
        type: toasts.undo,
        description: 'Выполняется перерасчёт затрат за выбранный период времени',
        onExpiration: recalculateCosts,
        handleBtn: cancelLoading,
      });
    }
  };

  return (
    <form className={s.form} onSubmit={onSubmitHandler}>
      <div className={s.form__item}>
        <h2 className={s.form__title}>Перерасчёт затрат</h2>
        <div className={s.form__subtitle}>
          Если вы внесли данные ставок за прошедший период времени, вам необходимо пересчитать затраты на это время.
        </div>
        <div className={s.form__group}>
          <div className={s.form__text}>Период</div>
          <div className={s.form__inputBox}>
            <DatePicker
              setDate={setStartDate}
              type={DatePickerType.default}
              startDate={startDate}
              maxDate={new Date()}
            />
          </div>
          <div className={s.form__text}>–</div>
          <div className={s.form__inputBox}>
            <DatePicker setDate={setEndDate} type={DatePickerType.default} startDate={endDate} maxDate={new Date()} />
          </div>
        </div>
        {error ? (
          <div className={s.form__error}>
            <Icon name="attention" width={25} height={25} stroke />
            <span>{error}</span>
          </div>
        ) : null}
        <div className={s.form__action}>
          <Button className={s.form__button}>Пересчитать</Button>
        </div>
      </div>
    </form>
  );
};
