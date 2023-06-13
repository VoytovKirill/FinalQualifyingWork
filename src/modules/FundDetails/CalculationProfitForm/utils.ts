import {CurrencyCodeType} from 'shared/models';

export const initValidationValuesProfitForm = {
  month: true,
  currency: true,
  sum: true,
};

export const initValuesProfitForm = {
  month: new Date(),
  currency: null,
  sum: null,
};

export type ValuesIncomeFormType = {
  month: Date;
  currency: CurrencyCodeType | null;
  sum: string | null;
};

export type ValidationValuesIncomeFormType = {
  month: boolean;
  currency: boolean;
  sum: boolean;
};

export const parseSum = (sum: string): number => {
  return sum?.includes(',') ? Number(sum.replace(',', '.')) : Number(sum);
};
