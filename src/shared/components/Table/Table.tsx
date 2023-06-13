import {ColumnDef, getCoreRowModel, useReactTable} from '@tanstack/react-table';
import classNames from 'classnames';
import {FC} from 'react';


import {TableBody} from './Body';
import {ControlPanel} from './ControlPanel';
import {TableHeader} from './Header';
import s from './Table.module.scss';

import {TablePagination} from '../TableWithPagination';

export interface Cell {
  [key: string]: any;
}

type TableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className: string;
  paginationTableOptions?: TablePagination;
  hasHeading?: boolean;
};
const Table = <TData, TValue>({columns, data, className, paginationTableOptions, hasHeading = true}: TableProps<TData, TValue>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...paginationTableOptions,
  });
  return (
    <>
      <div className={classNames(s.table, s[`table_${className}`])}>
        <div className={s.table__box}>
          {hasHeading && (
            <div className={classNames(s.table__line, s.table__line_header)}>
              {<TableHeader table={table} s={s} className={className} />}
            </div>
          )}
          {<TableBody table={table} s={s} className={className} />}
        </div>
      </div>
      {paginationTableOptions && <ControlPanel table={table} />}
    </>
  );
};

export {Table};
