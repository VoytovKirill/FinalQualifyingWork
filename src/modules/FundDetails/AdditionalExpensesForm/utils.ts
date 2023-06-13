import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {ChangeEvent, Dispatch, SetStateAction} from 'react';

import {ValidationValuesType, ValuesType} from './types';

import {FundInfo} from '../CostsTable/columns';

type configType = {
  validationValues: ValidationValuesType;
  setValidationValues: Dispatch<SetStateAction<ValidationValuesType>>;
  values: object;
  setValues: Dispatch<SetStateAction<ValuesType>>;
};

export const valideInput = (event: ChangeEvent<HTMLInputElement>) => {
  const target = event.target;

  return target.validity.typeMismatch || !target.value.trim().length || !target.validity.valid ? false : true;
};

export const handleChange = (event: ChangeEvent<HTMLInputElement>, config: configType) => {
  const {setValidationValues, values, setValues, validationValues} = config;
  const target = event.target;
  const name = target.name;
  const value = target.value;
  const newValidateValues = {...validationValues, [name]: valideInput(event)};
  setValidationValues(newValidateValues);
  setValues({...values, [name]: value} as any);
};

export const mapAdditionalExpenses = (list: any[], fundId: number, firstMonth = '') => {
  dayjs.extend(customParseFormat);

  return list.map((item: any) => {
    const currentDay = new Date();
    const stringCurrentDay = dayjs(new Date(currentDay.getFullYear(), currentDay.getMonth(), 15)).format('YYYY-MM-DD');
    const dateForCreate = firstMonth
      ? dayjs(firstMonth.toLowerCase(), 'MMMM YYYY', 'ru').date(15).format('YYYY-MM-DD')
      : stringCurrentDay;
    return {
      name: item,
      date: dateForCreate,
      fundId,
    };
  });
};

export const prepareValues = (elementsList: any) => {
  const setList = new Set();
  const filteredList = [...elementsList].filter((element: any) => element.nodeName === 'INPUT');
  filteredList.forEach((item) => {
    setList.add(item.value);
  });
  return Array.from(setList);
};

export const cuttingExistNames = (actualData: FundInfo[], list: any[]) => {
  const mappedList = list.map((item) => {
    const exists = actualData.filter((actualItem) => actualItem.name === item && actualItem.type === 'additional');
    if (!exists.length) {
      return item;
    }
    return undefined;
  });
  return mappedList.filter((item) => typeof item !== 'undefined');
};
