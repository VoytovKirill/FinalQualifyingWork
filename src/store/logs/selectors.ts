import {RootState} from 'store';

const getAccountId = (state: RootState) => state.logs.accountId;
const getStartDate = (state: RootState) => state.logs.startDate;
const getEndDate = (state: RootState) => state.logs.endDate;
const getEvents = (state: RootState) => state.logs.events;
const getSearchString = (state: RootState) => state.logs.searchString;
const getEventsFilterTitle = (state: RootState) => state.logs.eventsFilterTitle;
const getSourceFilterTitle = (state: RootState) => state.logs.sourceFilterTitle;
const getEmployeeList = (state: RootState) => state.logs.employeeList;
const getSourceeList = (state: RootState) => state.logs.sourceList;

export const logsSelectors = {
  getStartDate,
  getEndDate,
  getAccountId,
  getEvents,
  getSearchString,
  getEventsFilterTitle,
  getSourceFilterTitle,
  getEmployeeList,
  getSourceeList,
};
