import {ColumnDef, createColumnHelper} from '@tanstack/react-table';
import dayjs from 'dayjs';

import {RateInfo} from 'api/dto/Rate';
import {TableItem} from 'shared/components/Table/Item';
import {makeFirstCharUppercase} from 'shared/utils/makeFirstCharUppercase';

const columnHelper = createColumnHelper<RateInfo>();

export const columns: ColumnDef<RateInfo>[] = [
  columnHelper.accessor('ratio', {
    header: () => <TableItem text="Ставка" />,
    cell: (info) => <TableItem text={info.getValue()} />,
  }),
  columnHelper.accessor('from', {
    header: () => <TableItem text="Дата начала" />,
    cell: (info) => (
      <TableItem
        text={info.getValue() ? makeFirstCharUppercase(dayjs(info.getValue()).locale('ru').format('MMMM YYYY')) : '-'}
      />
    ),
  }),
  columnHelper.accessor('to', {
    header: () => <TableItem text="Дата завершения" />,
    cell: (info) => (
      <TableItem
        text={info.getValue() ? makeFirstCharUppercase(dayjs(info.getValue()).locale('ru').format('MMMM YYYY')) : '-'}
      />
    ),
  }),
] as ColumnDef<RateInfo>[];
