import {AccountDTO} from 'api/dto/Account';
import {translateRole} from 'shared/utils/role';

export interface Account {
  fullName: string;
  role: string;
  id: number;
  isAdditionalLineOfSearch?: boolean;
}

export function mapAccountDtoToModel(account: AccountDTO): Account {
  return {
    ...account,
    fullName: `${account.firstName} ${account.lastName}`,
    role: translateRole(account.role),
  };
}
