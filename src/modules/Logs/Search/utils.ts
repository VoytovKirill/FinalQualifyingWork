import {accountService} from 'api';
import {AccountShortDTO} from 'api/dto/Account';
import {SearchListItem} from 'typings/global';

const transformEmployeeDtoList = (accountDtoList: AccountShortDTO[]): SearchListItem[] => {
  return accountDtoList.map((item) => {
    const {fullName, id} = item;
    return {text: fullName, id};
  });
};

export const getAccountList = async () => {
  try {
    const {data} = await accountService.getAccountListShort();
    return transformEmployeeDtoList(data);
  } catch (err) {
    return [];
  }
};
