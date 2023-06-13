import {getCoreRowModel, useReactTable} from '@tanstack/react-table';
import classNames from 'classnames';
import {useEffect, FC} from 'react';

import {TableBody} from 'shared/components/Table/Body';
import {ControlPanel} from 'shared/components/Table/ControlPanel';
import {TableHeader} from 'shared/components/Table/Header';
import s from 'shared/components/Table/Table.module.scss';
import {useRootDispatch} from 'store';

export interface Cell {
  [key: string]: any;
}

interface Table {
  fundsInstance: any;
  columns: any;
  data: Cell[];
  className: string;
  hasHeading?: boolean;
  options?: any;
  withPagination?: boolean;
  SubComponent?: (props: {row: any}) => React.ReactElement;
  searchId?: number | null;
}

export const Table: FC<Table> = (props) => {
  const {
    columns,
    data,
    className,
    hasHeading = true,
    options,
    withPagination,
    SubComponent,
    fundsInstance,
    searchId,
  } = props;
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...options,
  });
  const dispatch = useRootDispatch();

  useEffect(() => {
    dispatch(fundsInstance.actions.setPageNumber(table.getState().pagination.pageIndex));
    dispatch(fundsInstance.actions.setSelectedFundsId([]));
  }, [table.getState().pagination]);

  return (
    <div className={classNames(s.table, s[`table_${className}`])}>
      <div className={s.table__box}>
        {hasHeading && (
          <div className={classNames(s.table__line, s.table__line_header)}>
            {<TableHeader table={table} s={s} className={className} />}
          </div>
        )}
        {<TableBody table={table} s={s} className={className} SubComponent={SubComponent} searchId={searchId} />}
      </div>
      {withPagination && <ControlPanel table={table} />}
    </div>
  );
};
