import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import {event, SourceType} from 'api/services/logsService';
import {currentYear} from 'shared/constants/actualDate';
import {SearchListItem} from 'typings/global';

export type LogsSliceState = {
  searchString: string;
  accountId: number | null;
  startDate: string | null;
  endDate: string | null;
  events: event[];
  eventsFilterTitle: string;
  sourceFilterTitle: string;
  sourceList: SourceType[];
  employeeList: SearchListItem[];
};

const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    searchString: '',
    accountId: null,
    sourceList: [],
    startDate: dayjs(new Date(currentYear, dayjs().month(), 1)).format('YYYY-MM-DD'),
    endDate: dayjs(new Date()).format('YYYY-MM-DD'),
    events: [],
    eventsFilterTitle: 'Все',
    sourceFilterTitle: 'Все',
    employeeList: [],
  } as LogsSliceState,
  reducers: {
    setStartDate(state, action: PayloadAction<string | null>) {
      state.startDate = action.payload;
    },
    setEndDate(state, action: PayloadAction<string | null>) {
      state.endDate = action.payload;
    },
    setSearchString(state, action: PayloadAction<string>) {
      state.searchString = action.payload;
    },
    setAccountId(state, action: PayloadAction<number | null>) {
      state.accountId = action.payload;
    },
    setEvents(state, action: PayloadAction<event[]>) {
      state.events = action.payload;
    },
    setSources(state, action: PayloadAction<SourceType[]>) {
      state.sourceList = action.payload;
    },
    setEventsFilterTitle(state, action: PayloadAction<string>) {
      state.eventsFilterTitle = action.payload;
    },
    setSourceFilterTitle(state, action: PayloadAction<string>) {
      state.sourceFilterTitle = action.payload;
    },
    setEmployeeList(state, action: PayloadAction<SearchListItem[]>) {
      state.employeeList = action.payload;
    },
  },
});

export const {actions: logsActions, reducer: logsReducer} = logsSlice;
