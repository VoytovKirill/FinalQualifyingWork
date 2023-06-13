import {RootState} from 'store';

const getYearFilter = (state: RootState) => state.salaryRatesFilters.year;
const getIsFired = (state: RootState) => state.salaryRatesFilters.isFired;
const getSearch = (state: RootState) => state.salaryRatesFilters.search;
const getCheckedEmployeeId = (state: RootState) => state.salaryRatesFilters.checkedEmployeId;

export const salaryRatesFiltersSelectors = {
  getYearFilter,
  getIsFired,
  getSearch,
  getCheckedEmployeeId,
};
