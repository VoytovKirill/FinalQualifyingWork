import {RootState} from '../index';

const getTableData = (state: RootState) => state.detailsInfo.fundInfo;
const getStartDate = (state: RootState) => state.detailsInfo.startDate;
const getEndDate = (state: RootState) => state.detailsInfo.endDate;
const getIsActive = (state: RootState) => state.detailsInfo.isActive;
const getIsCommercial = (state: RootState) => state.detailsInfo.isCommercial;
const getIsHourly = (state: RootState) => state.detailsInfo.isHourly;

export const detailInfoSelectors = {
  getTableData,
  getStartDate,
  getEndDate,
  getIsActive,
  getIsCommercial,
  getIsHourly,
};
