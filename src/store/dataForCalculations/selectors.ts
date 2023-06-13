import {RootState} from 'store';

const getCurrencyCodes = (state: RootState) => state.dataForCalculation.currencyCodes;

export const dataForCalculationsSelectors = {
  getCurrencyCodes,
};
