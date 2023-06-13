import {Table} from '@tanstack/react-table';
import classNames from 'classnames';
import {FC} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Pagination} from 'shared/components/Pagination';
import {usePagination} from 'shared/hooks/usePagination';

import s from './ControlePanel.module.scss';
import {PagesStepper} from './PagesStepper';

type Props<T> = {
  table: Table<T>;
};

export const ControlPanel = <T,>({table}: Props<T>) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pagesCount = table.getPageCount();
  const paginationRange = usePagination({pagesCount, currentPage});

  return (
    <div className={classNames(s.panel)}>
      <div className={s.panel__pagination}>
        <Button
          className={s.panel__btn}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          variants={[ButtonStyleAttributes.colorLightGreen]}
        >
          В начало
        </Button>

        <Pagination paginationRange={paginationRange} table={table} />

        <Button
          className={s.panel__btn}
          onClick={() => table.nextPage()}
          variants={[ButtonStyleAttributes.colorLightGreen]}
          disabled={!table.getCanNextPage()}
        >
          Далее
        </Button>
      </div>

      <PagesStepper style={s} table={table} />
    </div>
  );
};
