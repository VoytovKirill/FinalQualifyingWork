import {createColumnHelper} from '@tanstack/react-table';

import {ActionRecovery} from 'modules/Roles/DeletedUsersTable/ActionRecovery';
import {Account} from 'shared/models';

import {RoleCellContainer} from './RoleCellContainer';
import {RoleName} from './RoleName';
import {TableCell} from './TableCell';

const columnHelper = createColumnHelper<Account>();

export const getColumns = (setChanging: () => void) => {
  return [
    columnHelper.accessor('fullName', {
      header: () => <TableCell stylePrefix="heading_name" text="Имя партнёра" />,
      cell: (info) => <TableCell stylePrefix="cell_name" text={info.getValue()} />,
    }),
    columnHelper.accessor('role', {
      header: () => <TableCell stylePrefix="heading_role" text="Роль" />,
      cell: (info) => {
        return (
          <RoleCellContainer>
            <RoleName info={info} />
            <ActionRecovery info={info} setChanging={setChanging} />
          </RoleCellContainer>
        );
      },
    }),
  ];
};
