import dayjs from 'dayjs';

import {CurrencyCodeDto, IncomeByMonthDto} from 'api/dto/Income';
import {ValuesIncomeFormType} from 'modules/FundDetails/CalculationProfitForm/utils';

export type CurrencyCodeType = {
  type: number;
  title: string;
  character: string;
};

export function mapCurrencyCodeDtoToModel(codeDto: CurrencyCodeDto): CurrencyCodeType {
  const {type, title} = codeDto;
  const getCharacter = (title: string): string => {
    switch (title) {
      case 'RUB':
        return '₽';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return title;
    }
  };
  const character = getCharacter(title);
  const currencyCode = {type, title, character};
  return currencyCode;
}

export function mapIncomeDtoToModel(codeDto: IncomeByMonthDto, currencies: CurrencyCodeType[]): ValuesIncomeFormType {
  const {month, sum, currencyCode} = codeDto;

  const currency = currencies.find((item) => item.type === currencyCode);
  const _newSum = String(sum);
  return {
    sum: _newSum,
    month: dayjs(month).locale('ru').toDate(),
    currency: currency ?? null,
  };
}
