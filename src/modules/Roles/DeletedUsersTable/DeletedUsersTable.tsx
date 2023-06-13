import {FC, useMemo} from 'react';

import {Table} from 'shared/components/Table';
import {Account} from 'shared/models/Account';

import style from './DeletedUsersTable.module.scss';
import {getColumns} from './getColumns';

interface Props {
  accounts: Account[];
  setChanging: any;
  isActive: boolean;
}

export const DeletedUsersTable: FC<Props> = ({accounts, setChanging, isActive}) => {
  const columns = useMemo(() => getColumns(setChanging), [accounts]);

  return (
    <>
      {!!accounts.length && <h3 className={style.subtitle}> Удаленные партнёры</h3>}
      {!!accounts.length && <Table hasHeading={!isActive} className="deletedUsers" columns={columns} data={accounts} />}
    </>
  );
};
