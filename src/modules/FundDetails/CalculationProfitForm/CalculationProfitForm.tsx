import classNames from 'classnames';
import dayjs from 'dayjs';
import {FC, FormEventHandler, useEffect, useState} from 'react';
import CurrencyInput from 'react-currency-input-field';
import {useLocation} from 'react-router';

import {CurrencyCodeDto, IncomeByMonthDto} from 'api/dto/Income';
import {incomeService} from 'api/services/incomeService';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {DatePicker} from 'shared/components/DatePicker';
import {DatePickerType} from 'shared/components/DatePicker/DatePicker';
import {RadioButton} from 'shared/components/RadioButton';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {CurrencyCodeType, mapCurrencyCodeDtoToModel, mapIncomeDtoToModel} from 'shared/models';
import {formatCurrentsy} from 'shared/utils/formatCurrentsy';
import {DATE_API_FORMAT} from 'shared/utils/prepareDate/prepareDate';
import {useRootDispatch} from 'store';
import {dataForCalculationsActions} from 'store/dataForCalculations';

import s from './CalculationProfitForm.module.scss';
import {
  initValidationValuesProfitForm,
  initValuesProfitForm,
  parseSum,
  ValidationValuesIncomeFormType,
  ValuesIncomeFormType,
} from './utils';

const MIN_PROFIT = 0;
const MAX_PROFIT = 10000000000;
const DEFAULT_CURRENCY_CODE = '0';
const placeholderProfit = formatCurrentsy(100000);
const ERROR_MESSAGE = 'Не удалось получить данные. Попробуйте перезагрузть страницу';
const SUCСESS_MESSAGE = 'Значение выручки успешно сохранено';
const SUCСESS_DELETE_MESSAGE = 'Значение выручки удалено';

export enum CalculationProfitFormType {
  detailedFund = 'detailedFund',
  allFundProfit = 'allFundProfit',
}

interface CalculationProfitFormProps {
  type: CalculationProfitFormType;
  id?: number;
  onClose?: () => void;
  startDate?: string | null;
  endDate?: string | null;
  updateTable: (date?: any) => void;
  getGeneralInfo: () => void;
}

export const CalculationProfitForm: FC<CalculationProfitFormProps> = (props) => {
  const {id, type, onClose, startDate, endDate, updateTable, getGeneralInfo} = props;
  const [isSavedIncome, setIsSavedIncome] = useState<boolean>(false);
  const [values, setValues] = useState<ValuesIncomeFormType>(initValuesProfitForm);
  const [validationValues, setValidationValues] =
    useState<ValidationValuesIncomeFormType>(initValidationValuesProfitForm);
  const [currencies, setCurrencies] = useState<CurrencyCodeType[]>([]);
  const [availableCurrencies, setAvailableCurrencies] = useState<number[]>([]);
  const dispatch = useRootDispatch();
  const {showToast, dismiss} = useToast();
  const location = useLocation();
  const fundId = id || location.state.id;

  const getIncomeByMonth = async (date: Date) => {
    try {
      const monthIncome = await incomeService.getIncomeOfOneMonthByFundId(date, fundId);
      return monthIncome.data;
    } catch (e) {
      return;
    }
  };

  const initCurrencies = (currencyCodeListDto: CurrencyCodeDto[], currencyCodes: CurrencyCodeType[]) => {
    dispatch(dataForCalculationsActions.setCurrencyCodes(currencyCodeListDto));
    setCurrencies(currencyCodes);
  };

  const updateIncome = (monthIncome: IncomeByMonthDto, currencies: CurrencyCodeType[]) => {
    setAvailableCurrencies([monthIncome.currencyCode]);
    const newFormValues = mapIncomeDtoToModel(monthIncome, currencies);
    setValues(newFormValues);
    setIsSavedIncome(true);
  };

  const initIncome = (currencyCodes: CurrencyCodeType[], monthIncome?: IncomeByMonthDto) => {
    if (monthIncome) {
      updateIncome(monthIncome, currencyCodes);
    } else {
      setAvailableCurrencies([...currencyCodes.map((item) => item.type)]);
      setValues((values) => ({...values, currency: currencyCodes[0]}));
    }
  };

  const initIncomeForm = async () => {
    dismiss();
    Promise.all([incomeService.getCurrencyCodes(), getIncomeByMonth(new Date())])
      .then(([{data: currencyCodeListDto}, monthIncome]) => {
        const currencyCodes = currencyCodeListDto.map((item) => mapCurrencyCodeDtoToModel(item));
        initCurrencies(currencyCodeListDto, currencyCodes);
        initIncome(currencyCodes, monthIncome);
      })
      .catch((err) => showToast({type: toasts.error, description: ERROR_MESSAGE}));
  };

  useEffect(() => {
    initIncomeForm();
  }, []);

  useEffect(() => {
    if (!isSavedIncome) setValues((values) => ({...values, currency: currencies[0]}));
  }, [isSavedIncome]);

  const handleProfitChange = (newValue: any) => {
    dismiss();
    const _newValue = parseSum(newValue);
    setValues((values) => ({...values, sum: newValue ? newValue : null}));
    setValidationValues((validationValues) => ({
      ...validationValues,
      sum: newValue !== DEFAULT_CURRENCY_CODE && _newValue >= MIN_PROFIT && _newValue <= MAX_PROFIT,
    }));
  };

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (values.sum && values.sum !== DEFAULT_CURRENCY_CODE) {
      const params = {
        fundId,
        month: dayjs(values.month).locale('ru').format(DATE_API_FORMAT).toString(),
        sum: parseSum(values.sum),
        currencyCode: values.currency!.type,
      };
      const response = await incomeService.updateIncomeOfOneMonthByFundId(params);
      if (response) {
        setIsSavedIncome(true);
        setAvailableCurrencies([values.currency!.type]);
        showToast({type: toasts.success, description: SUCСESS_MESSAGE});
        getGeneralInfo();
        if (type === CalculationProfitFormType.allFundProfit) updateTableWitchCheck();
        if (type === CalculationProfitFormType.detailedFund) updateTable(values.month);
      }
    } else {
      setValidationValues((validationValues) => ({
        ...validationValues,
        sum: false,
      }));
    }
  };

  const updateTableWitchCheck = () => {
    if (!(startDate && endDate)) return;
    const date = dayjs(values.month);
    if (date.isAfter(startDate) && date.isBefore(endDate)) updateTable();
  };

  const setDate = async (date: Date) => {
    dismiss();
    const monthIncome = await getIncomeByMonth(date);

    if (monthIncome) {
      updateIncome(monthIncome, currencies);
    } else {
      setValues({...initValuesProfitForm, month: date, currency: currencies[0]});
      setIsSavedIncome(false);
      setAvailableCurrencies([...currencies.map((item) => item.type)]);
    }
  };

  const handleChange = (currency: CurrencyCodeType | null) => {
    if (currency) setValues((values) => ({...values, currency}));
  };

  const handleDelete = async () => {
    const targetMonth = values.month;
    const deleteResponse = await incomeService.deleteIncomeOfOneMonthByFundId(targetMonth, fundId);

    if (deleteResponse) {
      showToast({type: toasts.success, description: SUCСESS_DELETE_MESSAGE});
      setValues({...initValuesProfitForm, month: targetMonth, currency: currencies[0]});
      setIsSavedIncome(false);
      setAvailableCurrencies([...currencies.map((item) => item.type)]);
      setValidationValues((validationValues) => ({
        ...validationValues,
        sum: true,
      }));
      await getGeneralInfo();
      if (type === CalculationProfitFormType.detailedFund) updateTable(values.month);
    } else {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
  };

  const getRadioBtn = (currencyKey: string) => {
    const isChecked = values.currency
      ? String(values.currency.type) === currencyKey
      : currencyKey === DEFAULT_CURRENCY_CODE;

    const isDisabled = isSavedIncome || values.currency ? !availableCurrencies.includes(Number(currencyKey)) : false;

    const currentCurrency = currencies.find((item) => String(item.type) === currencyKey);

    return (
      <span key={currencyKey} className={s.radioBtn}>
        <RadioButton
          handleChange={() => handleChange(currentCurrency ?? null)}
          isChecked={isChecked}
          disabled={isDisabled}
        />
        <span>{currentCurrency?.character}</span>
      </span>
    );
  };

  return (
    <form onSubmit={submit}>
      <h2 className={s.title}>Данные расчета </h2>
      <p className={s.subtitle}>С помощью внесённых данных будет выполнен расчёт прибыли на указанный месяц.</p>
      <div className={s.details}>
        <div className={classNames(s.field, {[s.field__allFunds]: type === CalculationProfitFormType.allFundProfit})}>
          <label>Валюта</label>
          {Object.keys(currencies).map(getRadioBtn)}
        </div>
        <div className={classNames(s.field, {[s.field__allFunds]: type === CalculationProfitFormType.allFundProfit})}>
          <label>Месяц</label>
          <div className={s.details__inputBox}>
            <DatePicker
              className="add_profit_form"
              type={DatePickerType.default}
              isShowMonth={true}
              startDate={values.month}
              isReadOnly={false}
              setDate={setDate}
              maxDate={new Date()}
            />
          </div>
        </div>
        <div className={classNames(s.field, {[s.field__allFunds]: type === CalculationProfitFormType.allFundProfit})}>
          <label>Выручка</label>
          <CurrencyInput
            value={values.sum || ''}
            onValueChange={(value) => {
              handleProfitChange(value);
            }}
            allowNegativeValue={false}
            allowDecimals={true}
            decimalSeparator=","
            placeholder={placeholderProfit}
            transformRawValue={(rawValue) => rawValue.replace('.', ',')}
            className={classNames(s.details__profit, {[s.details__profit_error]: !validationValues.sum})}
          />
          <span className={s.details__currencyLabel}>{values?.currency?.character}</span>
        </div>
        <div
          className={classNames(s.buttons, {[s.buttons__allFunds]: type === CalculationProfitFormType.allFundProfit})}
        >
          {type === CalculationProfitFormType.allFundProfit && (
            <Button
              className={s.btn}
              variants={[ButtonStyleAttributes.colorLightGreen]}
              type="submit"
              onClick={onClose}
            >
              Отмена
            </Button>
          )}
          <Button className={s.btn} variants={[ButtonStyleAttributes.colorGreen]} type="submit">
            {isSavedIncome ? 'Пересчитать' : 'Расчитать'}
          </Button>
          {type === CalculationProfitFormType.detailedFund && isSavedIncome && (
            <Button
              className={s.btn}
              variants={[ButtonStyleAttributes.colorGreen]}
              type="button"
              onClick={handleDelete}
            >
              Удалить
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
