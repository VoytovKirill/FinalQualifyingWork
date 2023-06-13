import classNames from 'classnames';
import dayjs from 'dayjs';
import {FC, useEffect, useState, FormEventHandler, ChangeEvent} from 'react';

import {ratesService} from 'api/';
import {RateType} from 'api/dto/Rate';
import {ApiFailedResponseError} from 'api/types/ApiResponseError';
import {Button} from 'shared/components/Button';
import {ConfirmationPopup} from 'shared/components/ConfirmationPopup';
import {DatePicker} from 'shared/components/DatePicker';
import {DatePickerType} from 'shared/components/DatePicker/DatePicker';
import {toasts} from 'shared/constants/toasts';
import {usePopup} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';
import {makeFirstCharUppercase} from 'shared/utils/makeFirstCharUppercase';
import {prepareDate} from 'shared/utils/prepareDate/prepareDate';

import s from './TaxesForm.module.scss';

const className = 'taxes';

interface FormProps {
  type: RateType;
  getRateHistory: (type: RateType) => void;
}

const ERROR_OF_EMPTY_FIELD = 'Заполните поле';
const ERROR_INVALID_YEAR = 'Дата изменения не может быть задана на прошлый год';
const ERROR_INPUT_VALUE = 'Допустимы только цифры';
const ERROR_END_DATE_BEFORE_START_DATE = 'Дата завершения раньше даты начала периода';

export const Form: FC<FormProps> = ({type, getRateHistory}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(dayjs().set('date', 1).toDate());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const {showToast} = useToast();
  const {handleClose, handleOpen, openPopup} = usePopup();

  useEffect(() => {
    setStartDate(dayjs().set('date', 1).toDate());
    setEndDate(null);
    setInputValue('');
    setErrorMessage('');
  }, [type]);

  useEffect(() => {
    setErrorMessage('');
    validateDates();
  }, [startDate, endDate]);

  const createText = () => {
    const rateType = type === RateType.tax ? 'ставку налога' : 'долю ПР';
    const startPeriod = makeFirstCharUppercase(dayjs(startDate).locale('ru').format('MMMM YYYY'));
    const endPeriod = endDate ? makeFirstCharUppercase(dayjs(endDate).locale('ru').format('MMMM YYYY')) : '';
    return `Вы уверены, что хотите изменить ${rateType} c ${startPeriod} ${endPeriod ? 'по ' + endPeriod : ''}`;
  };

  const openConfirmActionPopup = () => {
    handleOpen();
  };

  const changeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setErrorMessage('');
  };

  const validateDates = () => {
    if (startDate !== null && startDate.getFullYear() < new Date().getFullYear()) {
      setErrorMessage(ERROR_INVALID_YEAR);
    }
    if (endDate && startDate.getTime() > endDate.getTime()) {
      setErrorMessage(ERROR_END_DATE_BEFORE_START_DATE);
    }
  };

  const onSubmitHandler: FormEventHandler = async (e) => {
    e.preventDefault();
    validateDates();
    if (errorMessage) return;
    const number = Number(inputValue);
    if (number && number > 0) openConfirmActionPopup();
    else {
      inputValue.length ? setErrorMessage(ERROR_INPUT_VALUE) : setErrorMessage(ERROR_OF_EMPTY_FIELD);
    }
  };

  const updateRates = async () => {
    handleClose();
    try {
      const endPeriod = endDate ? prepareDate(endDate, 'YYYY-MM-DD') : null;
      await ratesService.update(type, prepareDate(startDate, 'YYYY-MM-DD'), endPeriod, parseFloat(inputValue));
      getRateHistory(type);
    } catch (err) {
      if (err instanceof ApiFailedResponseError) showToast({type: toasts.error, description: err.response?.data.title});
    }
  };

  return (
    <>
      <div className={classNames(s.rates__item, s.rates__item_changes)}>
        <h2 className={s.rates__title}>{type === RateType.tax ? 'Изменение ставки' : 'Изменение доли ПР'} </h2>
        <div>
          <form onSubmit={onSubmitHandler} className={classNames(s.form, s.formRateTax)}>
            <div className={classNames(s.form__item, s.isInvalid, s.form__item_flex, s.formRateTax__item)}>
              <label className={s.label}>{type === RateType.tax ? 'Ставка налога' : 'Доля ПР'}</label>
              <div className={classNames(s.form__group, s.formRateTax__group)}>
                <input
                  onChange={changeInputValue}
                  className={classNames(
                    s.input,
                    {
                      [s.isInvalid]: [ERROR_OF_EMPTY_FIELD, ERROR_INPUT_VALUE].includes(errorMessage),
                    },
                    s.formRateTax__number,
                  )}
                  type="text"
                  autoComplete="on"
                  maxLength={10}
                  value={inputValue}
                />

                <span className={s.formRateTax__text}>с</span>
                <div className={s.form__inputBox}>
                  <DatePicker
                    className={className}
                    type={DatePickerType.default}
                    startDate={startDate}
                    setDate={setStartDate}
                    error={errorMessage === ERROR_INVALID_YEAR}
                  />
                </div>
                <span className={s.formRateTax__text}>по</span>
                <div className={s.form__inputBox}>
                  <DatePicker
                    className={className}
                    type={DatePickerType.default}
                    startDate={endDate}
                    setDate={setEndDate}
                    isClearable
                    error={[ERROR_END_DATE_BEFORE_START_DATE, ERROR_INVALID_YEAR].includes(errorMessage)}
                  />
                </div>
              </div>
              {errorMessage ? <div className={s.form__error}>{errorMessage}</div> : null}
            </div>
            <div className={classNames(s.form__item, s.formRateTax__action)}>
              <Button className={s.ctrlButton}>Применить</Button>
            </div>
          </form>
        </div>
      </div>
      {openPopup && (
        <ConfirmationPopup
          text={createText()}
          onReject={handleClose}
          onAccept={updateRates}
          acceptText="Подтвердить"
          rejectText="Отмена"
        />
      )}
    </>
  );
};
