import {createAsyncThunk} from '@reduxjs/toolkit';

import {CurrencyCodeDto} from 'api/dto/Income';
import {incomeService} from 'api/services/incomeService';

const getCurrencyCodes = createAsyncThunk('dataForCalculation/getCurrencyCodes', async () => {
  try {
    const response = await incomeService.getCurrencyCodes();
    return response.data as CurrencyCodeDto[];
  } catch (err: any) {
    throw err;
  }
});

export const dataForCalculationsAsyncActions = {
  getCurrencyCodes,
};
