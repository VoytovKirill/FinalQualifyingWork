import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type salaryRatesFiltersType = {
  year: number;
  isFired: boolean;
  search: string;
  checkedEmployeId: number | null;
};

const salaryRatesFiltersSlice = createSlice({
  name: 'salaryRatesFilters',
  initialState: {
    search: '',
    checkedEmployeId: null,
    year: new Date().getFullYear(),
    isFired: false,
  } as salaryRatesFiltersType,

  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCheckedEmployeeId(state, action: PayloadAction<number | null>) {
      state.checkedEmployeId = action.payload;
    },
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload;
    },
    setIsFired(state, action: PayloadAction<boolean>) {
      state.isFired = action.payload;
      state.search = '';
      state.checkedEmployeId = null;
    },
  },
});

export const {
  actions: salaryRatesFiltersActions,
  caseReducers: salaryRatesFiltersCaseReducers,
  reducer: salaryRatesFiltersReducer,
} = salaryRatesFiltersSlice;
