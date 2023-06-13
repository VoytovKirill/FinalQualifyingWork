import {PaginationState} from '@tanstack/react-table';
import {cloneElement, FC, isValidElement, ReactElement, useEffect, useMemo, useState} from 'react';

import {useAfterFirstRender} from 'shared/hooks';

interface TableWithPaginationProps {
  getData: ({pageIndex, pageSize}: PaginationState) => Promise<void> | void;
  totalSize: number;
  initialPaginationState: {
    pageIndex: number;
    pageSize: number;
  };
  children: ReactElement<{options: any}>;
  options?: any;
}

// TODO:Заменить shared компонент на этот
export const TableWithPagination: FC<TableWithPaginationProps> = ({
  children,
  options,
  initialPaginationState,
  totalSize,
  getData,
}) => {
  const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>(initialPaginationState);
  const isAfterFirstRender = useAfterFirstRender();

  useEffect(() => {
    if (!isAfterFirstRender) return;
    getData({pageIndex, pageSize});
  }, [pageIndex, pageSize]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const paginationOptions = {
    pageCount: Math.ceil(totalSize / pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  };

  if (isValidElement(children)) {
    return cloneElement(children, {
      options: {...options, ...paginationOptions, state: {...options?.state, ...paginationOptions.state}},
    });
  }
  return null;
};
