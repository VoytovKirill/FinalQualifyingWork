import {RootState} from 'store';

const getSearchString = (state: RootState) => state.roles.searchString;
const getEmployeeList = (state: RootState) => state.roles.employeeList;
const getCheckedEmployeeId = (state: RootState) => state.roles.checkedEmployeeId;

export const rolesSelectors = {
  getSearchString,
  getEmployeeList,
  getCheckedEmployeeId,
};
