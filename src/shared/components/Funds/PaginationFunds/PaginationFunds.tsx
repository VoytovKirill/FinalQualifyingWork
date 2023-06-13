import classNames from 'classnames';
import {FC} from 'react';

import s from 'shared/components/Pagination/Pagination.module.scss';
import {DOTS} from 'shared/hooks/usePagination';

export interface PaginationProps {
  paginationRange: (number | string)[];
  paginationNumber: number;
  changePaginationNumber: (tableIndex: number) => void;
}

export const PaginationFunds: FC<PaginationProps> = ({paginationRange, changePaginationNumber, paginationNumber}) => {
  return (
    <div className={s.pagination}>
      {paginationRange.map((pageNumber: number | string, index: number) => {
        if (pageNumber === DOTS) {
          return (
            <div key={index} className={classNames(s.pagination__item, s.pagination__dots)}>
              &#8230;
            </div>
          );
        }

        return (
          <div
            key={index}
            className={classNames({
              [s.pagination__item]: true,
              [s.pagination__item_active]: paginationNumber + 1 === pageNumber,
            })}
            onClick={() => changePaginationNumber(Number(pageNumber) - 1)}
          >
            {pageNumber}
          </div>
        );
      })}
    </div>
  );
};
