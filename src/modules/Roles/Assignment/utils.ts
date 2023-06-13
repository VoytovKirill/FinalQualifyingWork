import {accountService} from 'api';
import {AccountDTO} from 'api/dto/Account';
import {mapAccountDtoToModel} from 'shared/models';

export const getActiveAccounts = async () => {
  const {
    data: {items},
  } = await accountService.getAccountList();
  return items.map((item: AccountDTO) => mapAccountDtoToModel(item));
};

export const getDeletedAccounts = async () => {
  const {
    data: {items},
  } = await accountService.getDeletedAccountList();
  return items.map((item: AccountDTO) => mapAccountDtoToModel(item));
};
