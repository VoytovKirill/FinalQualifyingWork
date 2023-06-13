import {flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table';
import classNames from 'classnames';
import {FC, Fragment} from 'react';

import {TableHeader} from 'shared/components/Table/Header';
import s from 'shared/components/Table/Table.module.scss';

import {getColumns} from './columns';
import style from './ProfitTable.module.scss';

const className = 'profitOneFund';

export interface Cell {
  [key: string]: any;
}

interface ProfitTableProps {
  tableData: Array<string | number>[];
  headersList: string[];
}

export const ProfitTable: FC<ProfitTableProps> = ({headersList, tableData}) => {
  const table = useReactTable({
    columns: getColumns(tableData, headersList),
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={classNames(s.table, s.table_profitOneFund)}>
      <div className={s.table__box}>
        <div className={classNames(s.table__line, s.table__line_header)}>
          <TableHeader table={table} s={s} className={className} />
        </div>
        {table.getRowModel().rows.map((row: any) => (
          <div key={row.id} className={s.table__line}>
            <Fragment key={row.id}>
              <div key={row.id} className={classNames(s.table__line)}>
                <div key={row.id} className={classNames(s.table__group, style.table__group)}>
                  {row.getVisibleCells().map((cell: Cell) => (
                    <div className={classNames(s.table__item, style.table__item)} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          </div>
        ))}
      </div>
    </div>
  );
};
