import classNames from 'classnames';
import {FC, ReactNode, useEffect, useState} from 'react';

import {Button} from 'shared/components/Button';
import s from 'shared/components/Funds/Funds.module.scss';
import {Icon} from 'shared/components/Icon';

import {biasOffset, offsetBorderLeft, offsetBorderRight, lastIndexCorrection, offsetMinValue} from './offsetConst';
import {OneMonth} from './OneMonth';

interface MonthHeaderProps {
  allMonths: string[];
  offset: number;
  setOffset: (offset: number) => void;
  showPeriodText?: boolean;
  maxCountOfShownColumns: number;
}

export const MonthHeader: FC<MonthHeaderProps> = ({
  allMonths,
  offset,
  setOffset,
  showPeriodText = true,
  maxCountOfShownColumns,
}) => {
  const [load, setLoad] = useState(false);
  const [parsedMonths, setParsedMonths] = useState<ReactNode[]>();

  const parseMonth = () =>
    allMonths
      ?.filter((item, index) => index >= offset && index <= offset + maxCountOfShownColumns - lastIndexCorrection)
      .map((month) => <OneMonth key={month} period={month} />);

  const plusOffset = () => {
    const length = allMonths?.length || 0;
    if (offset + offsetBorderRight < length && !load) {
      setOffset(offset + biasOffset);
      setLoad(true);
    }
  };

  const minusOffset = () => {
    if (offset - biasOffset >= offsetBorderLeft && !load) {
      setOffset(offset - biasOffset);
      setLoad(true);
    }
  };

  useEffect(() => {
    setParsedMonths(parseMonth());
    setTimeout(() => {
      setLoad(false);
    }, 500); /* Задержка нужна, чтобы ограничить быстрое перелистывание*/
  }, [offset, allMonths]);

  return (
    <div className={classNames(s.report__line, s.report__linePeriod)}>
      <div className={s.report__group}>
        <div
          className={classNames(
            s.report__item,
            s.report__itemName,
            {[s.loadFunds]: load},
            {[s.hidden]: !(allMonths.length >= offsetBorderRight && offset >= offsetMinValue)},
          )}
        >
          <Button
            className={classNames(s.report__periodButton)}
            icon={<Icon stroke className={s.icon__style} height={16} width={16} name="arrow-down" />}
            onClick={minusOffset}
          />
        </div>
        <>{parsedMonths}</>
        <div className={classNames(s.report__item, s.report__itemTotal)}>
          <div
            className={classNames(
              s.report__item,
              s.report__itemName,
              {[s.loadFunds]: load},
              {
                [s.hidden]: !(offset + maxCountOfShownColumns < allMonths.length),
              },
            )}
          >
            <Button
              className={classNames(s.report__periodButton)}
              icon={<Icon stroke className={s.icon__style} height={16} width={16} name="arrow-down" />}
              onClick={plusOffset}
            />
          </div>
          {showPeriodText && <span className={s.report__text}>За выбранный период</span>}
        </div>
      </div>
    </div>
  );
};
