import {PaginationState} from '@tanstack/react-table';
import {useEffect, useMemo, useState} from 'react';

interface PaginationOptionsProps {
  initialPaginationState: {
    pageIndex: number;
    pageSize: number;
  };
  totalSize: number;
  getData: (arg: any) => Promise<void> | void;
}

export const usePaginationOptions = ({getData, initialPaginationState, totalSize}: PaginationOptionsProps) => {
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

  return {
    pageCount: Math.ceil(totalSize / pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  };
};
