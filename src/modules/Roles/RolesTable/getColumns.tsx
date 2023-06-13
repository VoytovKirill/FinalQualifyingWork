import {createColumnHelper} from '@tanstack/react-table';
import {Dispatch, SetStateAction} from 'react';

import {ActionDelete} from 'modules/Roles/RolesTable/ActionDelete';
import {Account} from 'shared/models';

import {RoleCellContainer} from './RoleCellContainer';
import {RoleDropdown} from './RoleDropdown';
import {TableCell} from './TableCell';
import {getAttentionStyle} from './utils';

const columnHelper = createColumnHelper<Account>();

export const getColumns = (setChanging: Dispatch<SetStateAction<boolean>>) => {
  return [
    columnHelper.accessor('fullName', {
      header: () => <TableCell stylePrefix="heading_name" text="Имя партнёра" />,
      cell: (info) => <TableCell stylePrefix="cell_name" text={info.getValue()} attantion={getAttentionStyle(info)} />,
    }),
    columnHelper.accessor('role', {
      header: () => <TableCell stylePrefix="heading_role" text="Роль" />,
      cell: (info) => {
        return (
          <RoleCellContainer>
            <RoleDropdown info={info} setChanging={setChanging} />
            <ActionDelete info={info} setChanging={setChanging} />
          </RoleCellContainer>
        );
      },
    }),
  ];
};
