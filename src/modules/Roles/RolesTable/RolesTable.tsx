import {FC, useMemo, Dispatch, SetStateAction} from 'react';

import {Table} from 'shared/components/Table';
import {Account} from 'shared/models/Account';

import {getColumns} from './getColumns';

interface Props {
  accounts: Account[];
  setChanging: Dispatch<SetStateAction<boolean>>;
  isActive: boolean;
}

export const RolesTable: FC<Props> = ({accounts, setChanging, isActive}) => {
  const columns = useMemo(() => getColumns(setChanging), [accounts]);

  return (
    <>{!!accounts.length && <Table hasHeading={isActive} className="roles" columns={columns} data={accounts} />}</>
  );
};
