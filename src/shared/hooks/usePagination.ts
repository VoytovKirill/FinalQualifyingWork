import {useMemo} from 'react';

export const DOTS = '...';

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({length}, (_, idx) => idx + start);
};

interface PaginationProps {
  pagesCount: number;
  currentPage: number;
  siblingCount?: number;
}

export const usePagination = ({pagesCount, siblingCount = 2, currentPage}: PaginationProps) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 3;
    if (totalPageNumbers >= pagesCount) {
      return range(1, pagesCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, pagesCount);

    const shouldShowLeftDots = leftSiblingIndex >= 2;
    const shouldShowRightDots = rightSiblingIndex <= pagesCount - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, pagesCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = range(pagesCount - rightItemCount + 1, pagesCount);
      return [DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [DOTS, ...middleRange, DOTS, pagesCount];
    } else {
      const middleRange = range(leftSiblingIndex + 1, rightSiblingIndex);
      return [DOTS, ...middleRange, pagesCount];
    }
  }, [siblingCount, currentPage, pagesCount]);

  return paginationRange;
};
