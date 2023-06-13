import {flexRender, Table} from '@tanstack/react-table';
import classNames from 'classnames';
import {FC} from 'react';

import {Cell} from '../Table';

type Props = {
  className: string;
  table: Table<any>;
  s: any;
  disabled?: boolean;
  fullnameOfFoundItem?: string | null;
  SubComponent?: (props: {row: any}) => React.ReactElement;
  searchId?: number | null;
};

export const TableBody: FC<Props> = ({
  table,
  s,
  className,
  disabled = false,
  fullnameOfFoundItem = null,
  SubComponent,
  searchId,
}) => {
  return (
    <div className={s.table__body}>
      {table.getRowModel().rows.map((row: any) => (
        <div
          key={row.id}
          className={classNames(
            s.table__line,
            {[s['table__line-warning']]: row.original.isMissingSalaryRates},
            {[s['table__line-additional']]: !!(row.original.employeeFullName === fullnameOfFoundItem)},
            {[s['table__line-additional']]: row.original.isAdditionalLineOfSearch},
            {[s['table__line-inactive']]: disabled},
          )}
        >
          <div
            key={row.id}
            className={classNames(s.table__group, {[s['table__line-search']]: row.original.fundId === searchId})}
          >
            {row.getVisibleCells().map((cell: Cell) => (
              <div className={classNames(s.table__item, s[`table__item_${className}`])} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
          {row.getIsExpanded() && SubComponent && <SubComponent row={row.original} />}
        </div>
      ))}
    </div>
  );
};
