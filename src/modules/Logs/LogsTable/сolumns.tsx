import {ColumnDef, createColumnHelper} from '@tanstack/react-table';

import {TableItem} from 'shared/components/Table/Item';
import {Logs} from 'shared/models/Logs';

const columnHelper = createColumnHelper<Logs>();

export const columns: ColumnDef<Logs, string>[] = [
  columnHelper.accessor('source', {
    header: () => <TableItem text="Источник" />,
    cell: (info) => <TableItem text={info.getValue()} />,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('date', {
    header: () => <TableItem text="Дата" />,
    cell: (info) => <TableItem text={info.getValue()} />,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('time', {
    header: () => <TableItem text="Время" />,
    cell: (info) => <TableItem text={info.getValue()} />,
  }),
  columnHelper.accessor('role', {
    header: () => <TableItem text="Роль" />,
    cell: (info) => <TableItem text={info.getValue()} />,
  }),
  columnHelper.accessor('eventString', {
    header: () => <TableItem text="Тип события" />,
    cell: ({row, getValue}) => <TableItem text={getValue()} eventType={row.original.event} />,
  }),
  columnHelper.accessor('eventDescription', {
    header: () => <TableItem text="Событие" />,
    cell: (info) => <TableItem text={info.getValue()} />,
  }),
];
