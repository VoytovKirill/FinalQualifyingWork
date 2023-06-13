import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {SearchListItem} from 'typings/global';

export type LogsSliceState = {
  searchString: string;
  employeeList: SearchListItem[];
  checkedEmployeeId: number | null;
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    searchString: '',
    employeeList: [],
    checkedEmployeeId: null,
  } as LogsSliceState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.searchString = action.payload;
    },
    setEmployeeList(state, action: PayloadAction<SearchListItem[]>) {
      state.employeeList = action.payload;
    },
    setCheckedEmployeeId(state, action: PayloadAction<number | null>) {
      state.checkedEmployeeId = action.payload;
    },
  },
});

export const {actions: rolesActions, reducer: rolesReducer} = rolesSlice;
