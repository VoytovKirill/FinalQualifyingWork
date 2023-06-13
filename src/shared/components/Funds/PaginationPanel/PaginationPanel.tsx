import classNames from 'classnames';
import {ChangeEvent, FC, useState} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {PaginationFunds} from 'shared/components/Funds/PaginationFunds';
import s from 'shared/components/Table/ControlPanel/ControlePanel.module.scss';
import {paginationOffset, paginationSize} from 'shared/constants/pagination';
import {usePagination} from 'shared/hooks/usePagination';

const FIRST_PAGE = 1;

interface PaginationPanelProps {
  currentPage: number;
  changePaginationNumber: (tableIndex: number) => void;
  totalSize: number;
}

export const PaginationPanel: FC<PaginationPanelProps> = ({currentPage, changePaginationNumber, totalSize}) => {
  const pagesCount = Math.ceil(totalSize / paginationSize);
  const paginationRange = usePagination({pagesCount, currentPage});
  const [targetPage, setTargetPage] = useState<null | number>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const page = e.target.value ? Number(e.target.value) : null;
    setTargetPage(page);
  };
  const handleBtn = () => {
    targetPage !== null && targetPage <= pagesCount ? changePaginationNumber(targetPage - paginationOffset) : null;
  };

  const onPreviousPage = () => {
    return currentPage - paginationOffset >= 0;
  };

  const onNextPage = () => {
    if (currentPage + paginationOffset < pagesCount) changePaginationNumber(currentPage + paginationOffset);
  };

  return (
    <div className={classNames(s.panel, 'box')}>
      <div className={s.panel__pagination}>
        <Button
          className={s.panel__btn}
          disabled={!onPreviousPage()}
          variants={[ButtonStyleAttributes.colorLightGreen]}
          onClick={() => changePaginationNumber(0)}
        >
          В начало
        </Button>

        <PaginationFunds
          paginationRange={paginationRange}
          changePaginationNumber={changePaginationNumber}
          paginationNumber={currentPage}
        />

        <Button
          className={s.panel__btn}
          variants={[ButtonStyleAttributes.colorLightGreen]}
          onClick={onNextPage}
          disabled={currentPage + FIRST_PAGE === pagesCount}
        >
          Далее
        </Button>
      </div>

      <div className={s.panel__stepper}>
        <span className={s.panel__text}> Перейти на страницу </span>
        <input type="text" pattern="^[ 0-9]+$" onChange={handleInput} className={s.panel__input} />
        <Button
          className={classNames(s.panel__btn, s.panel__btn_stepper)}
          variants={[ButtonStyleAttributes.colorLightGreen]}
          disabled={targetPage === null}
          onClick={handleBtn}
        >
          Перейти
        </Button>
      </div>
    </div>
  );
};
