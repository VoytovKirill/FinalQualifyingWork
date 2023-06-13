import {apiClient} from 'api/client';
import {AccountDTO} from 'api/dto/Account';
import {Roles} from 'shared/constants/roles';

interface accountResponse {
  items: AccountDTO[];
}

class AccountsService {
  getAccountList() {
    return apiClient.get<accountResponse>(this.getUrl('?PageNumber=1&PageSize=100'));
  }
  deleteAccount(id: number) {
    return apiClient.delete<AccountDTO>(this.getUrl(`delete/${id}`));
  }
  recoveryAccount(id: number) {
    return apiClient.put<AccountDTO>(this.getUrl(`recovery/${id}`));
  }
  updateRole(id: number, role: Roles) {
    return apiClient.put<AccountDTO>(this.getUrl('role-setting'), {
      accountId: id,
      role,
    });
  }
  getDeletedAccountList() {
    return apiClient.get<accountResponse>(this.getUrl('deleted/?PageNumber=1&PageSize=100'));
  }
  getAccountListShort() {
    return apiClient.get(this.getUrl('short'));
  }
  getAccountById(id: number) {
    return apiClient.get(this.getUrl(String(id)));
  }
  private getUrl(endPoint: string) {
    return `Accounts/${endPoint}`;
  }
}

export const accountService = new AccountsService();
