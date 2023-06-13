import {Table} from '@tanstack/react-table';
import classNames from 'classnames';
import {FC} from 'react';

import {DOTS} from 'shared/hooks/usePagination';

export interface PaginationProps {
  paginationRange: (number | string)[];
  table: Table<any>;
}

import style from './Pagination.module.scss';

export const Pagination: FC<PaginationProps> = ({paginationRange, table}) => {
  return (
    <div className={style.pagination}>
      {paginationRange.map((pageNumber: number | string, index: number) => {
        if (pageNumber === DOTS) {
          return (
            <div key={index} className={classNames(style.pagination__item, style.pagination__dots)}>
              &#8230;
            </div>
          );
        }

        return (
          <div
            key={index}
            className={classNames({
              [style.pagination__item]: true,
              [style.pagination__item_active]: table.getState().pagination.pageIndex + 1 === pageNumber,
            })}
            onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
          >
            {pageNumber}
          </div>
        );
      })}
    </div>
  );
};
