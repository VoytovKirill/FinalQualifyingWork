import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {CurrencyCodeDto} from 'api/dto/Income';
import {CurrencyCodeType, mapCurrencyCodeDtoToModel} from 'shared/models';

import {dataForCalculationsAsyncActions} from './actions';

type DataForCalculationSliceState = {
  currencyCodes: CurrencyCodeType[];
};

const dataForCalculationSlice = createSlice({
  name: 'dataForCalculation',
  initialState: {
    currencyCodes: [],
  } as DataForCalculationSliceState,

  reducers: {
    setCurrencyCodes(state, action: PayloadAction<CurrencyCodeDto[]>) {
      const currencyCodesWithoutCharacters = action.payload as CurrencyCodeDto[];
      const currencyCodesList = currencyCodesWithoutCharacters.map((item) => mapCurrencyCodeDtoToModel(item));
      state.currencyCodes = currencyCodesList;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(dataForCalculationsAsyncActions.getCurrencyCodes.fulfilled, (state, action: any) => {
      const currencyCodesWithoutCharacters = action.payload as CurrencyCodeDto[];
      const currencyCodesList = currencyCodesWithoutCharacters.map((item) => mapCurrencyCodeDtoToModel(item));
      state.currencyCodes = currencyCodesList;
    });
  },
});

export const {
  actions: dataForCalculationsActions,
  caseReducers: dataForCalculationsCaseReducers,
  reducer: dataForCalculationsReducer,
} = dataForCalculationSlice;
export {dataForCalculationsAsyncActions};
