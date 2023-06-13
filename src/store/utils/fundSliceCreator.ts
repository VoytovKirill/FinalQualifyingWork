import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import {currentMonth, currentYear} from 'shared/constants/actualDate';
import {getLastDayDate} from 'shared/utils/prepareDate/getLastDayDate';
import {initialStartDate} from 'shared/utils/prepareDate/prepareDate';

export type FondsSliceState = {
  searchId: number | null;
  searchName: string;
  isDetailed: boolean;
  isActive: boolean | null;
  isCommercial: boolean | null;
  pageNumber: number;
  activeFilterName: string;
  commercialFilterName: string;
  startDate: string | null;
  endDate: string | null;
  selectedFundsId: number[];
};

const createGenericSlice = (sliceName: string) => {
  const slice = createSlice({
    initialState: {
      searchId: null,
      searchName: '',
      isDetailed: false,
      isActive: true,
      isCommercial: true,
      pageNumber: 0,
      activeFilterName: 'Активные',
      commercialFilterName: 'Коммерческие',
      startDate: initialStartDate(),
      endDate: dayjs(getLastDayDate(new Date(currentYear, currentMonth, 1))).format('YYYY-MM-DD'),
      selectedFundsId: [],
    } as FondsSliceState,
    name: sliceName,
    reducers: {
      setPageNumber(state, action: PayloadAction<number>) {
        state.pageNumber = action.payload;
      },
      setIsActive(state, action: PayloadAction<boolean | null>) {
        state.isActive = action.payload;
      },
      setIsCommercial(state, action: PayloadAction<boolean | null>) {
        state.isCommercial = action.payload;
      },
      setActiveFilterName(state, action: PayloadAction<string>) {
        state.activeFilterName = action.payload;
      },
      setCommercialFilterName(state, action: PayloadAction<string>) {
        state.commercialFilterName = action.payload;
      },
      setStartDate(state, action: PayloadAction<string | null>) {
        state.startDate = action.payload;
      },
      setEndDate(state, action: PayloadAction<string | null>) {
        state.endDate = action.payload;
      },
      toggleIsDetailed(state) {
        state.isDetailed = !state.isDetailed;
      },
      setSearchName(state, action: PayloadAction<string>) {
        state.searchName = action.payload;
      },
      setSearchId(state, action: PayloadAction<number | null>) {
        state.searchId = action.payload;
      },
      setSelectedFundsId(state, action: PayloadAction<number[]>) {
        state.selectedFundsId = action.payload;
      },
    },
  });

  const getIsActive = (state: any) => state[sliceName].isActive;
  const getPageNumber = (state: any) => state[sliceName].pageNumber;
  const getIsCommercial = (state: any) => state[sliceName].isCommercial;
  const getCommercialFilterName = (state: any) => state[sliceName].commercialFilterName;
  const getActiveFilterName = (state: any) => state[sliceName].activeFilterName;
  const getStartDate = (state: any) => state[sliceName].startDate;
  const getEndDate = (state: any) => state[sliceName].endDate;
  const getIsDetailed = (state: any) => state[sliceName].isDetailed;
  const getSearchName = (state: any) => state[sliceName].searchName;
  const getSearchId = (state: any) => state[sliceName].searchId;
  const getSelectedFundsId = (state: any) => state[sliceName].selectedFundsId;

  return {
    slice,
    reducer: slice.reducer,
    actions: slice.actions,
    getIsActive,
    getIsCommercial,
    getPageNumber,
    getCommercialFilterName,
    getActiveFilterName,
    getStartDate,
    getEndDate,
    getIsDetailed,
    getSearchName,
    getSearchId,
    getSelectedFundsId,
  };
};

export const fundsInstances = {
  fonds: createGenericSlice('fonds'),
  tracked: createGenericSlice('tracked'),
};
