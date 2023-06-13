import {ColumnDef, PaginationState} from '@tanstack/react-table';
import { useEffect, useState, useMemo, Dispatch, SetStateAction} from 'react';

import {Table} from 'shared/components/Table';

type TableWithPagination<TData,TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className: string;
  initialPaginationState: {
    pageIndex: number;
    pageSize: number;
  };
  totalSize: number;
  getData: ( {pageIndex, pageSize}: PaginationState) => Promise<void> | void;
};

interface Pagination {
  pagination: {pageIndex: number, pageSize: number};
}

export interface TablePagination {
  manualPagination: boolean;
  pageCount: number;
  onPaginationChange: Dispatch<SetStateAction<PaginationState>>;
  state: Pagination;
}

export const TableWithPagination = <TData, TValue,>({
  columns,
  data,
  className,
  initialPaginationState,
  getData,
  totalSize,
}: TableWithPagination<TData, TValue>) => {
  const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>(initialPaginationState);

  useEffect(() => {
    getData({
      pageIndex,
      pageSize,
    });
  }, [pageIndex, pageSize]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const paginationTableOptions = {
    pageCount: Math.ceil(totalSize / pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  } as TablePagination;

  return <Table columns={columns} data={data} className={className} paginationTableOptions={paginationTableOptions} />;
};
