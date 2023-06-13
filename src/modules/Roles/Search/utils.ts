import {accountService} from 'api';

export const getEmployeeById = async (checkedEmployeeId: number | null) => {
  if (checkedEmployeeId) {
    try {
      const {data} = await accountService.getAccountById(checkedEmployeeId);
      return data;
    } catch (err) {
      throw err;
    }
  }
  return null;
};
