import classNames from 'classnames';
import {FC, useEffect, useState} from 'react';

import {Button} from 'shared/components/Button';
import s from 'shared/components/Funds/Funds.module.scss';
import {Icon} from 'shared/components/Icon';

import {biasOffset, maxIndexOfShownColumns} from './offsetConst';
import style from './YearsHeader.module.scss';

interface Props {
  offset: number;
  setOffset: (offset: number) => void;
  headerList: string[];
  numberCheckedMonth: number;
}
const MAX_MONTH_COUNT = 10;

export const YearsHeader: FC<Props> = ({offset, setOffset, headerList, numberCheckedMonth}) => {
  const [load, setLoad] = useState(false);
  const yearHeaders = headerList?.map((item) => item.split(' ')[1]).slice(1, -1);
  const yearHeadersArray: Array<string[]> = [];
  const numberOfMonth = yearHeaders.length < MAX_MONTH_COUNT ? yearHeaders.length : MAX_MONTH_COUNT;
  yearHeaders.reduce((r: string, a: string) => {
    if (a !== r) {
      yearHeadersArray.push([]);
    }
    yearHeadersArray[yearHeadersArray.length - 1].push(a);
    return a;
  }, '');

  const plusOffset = () => {
    if (!load) {
      setOffset(offset + biasOffset);
      setLoad(true);
    }
  };

  const minusOffset = () => {
    if (!load) {
      setOffset(offset - biasOffset);
      setLoad(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 500); /* Задержка нужна, чтобы ограничить быстрое перелистывание*/
  }, [offset, headerList]);

  const isShowRightBtn = () => {
    return offset + maxIndexOfShownColumns < numberCheckedMonth;
  };
  const isShowLiftBtn = () => {
    return offset > 0;
  };
  return (
    <div className={s.yearsHeader}>
      <div className={classNames(s.report__item, s.report__toLeft)}>
        {isShowLiftBtn() && (
          <Button
            className={classNames(s.report__periodButton)}
            icon={<Icon stroke className={s.icon__style} height={16} width={16} name="arrow-down" />}
            onClick={minusOffset}
          />
        )}
      </div>
      {!isShowLiftBtn() && numberCheckedMonth > MAX_MONTH_COUNT && (
        <div className={classNames(style.table__br_left)}></div>
      )}
      <div className={style.table}>
        {yearHeadersArray.map((header: string[], index: number) => {
          const sizeStyle = {
            width: `${(header.length / numberOfMonth) * 100}%`,
          };
          return (
            <div
              className={classNames(s.table__item, s.table__item_header, style.table__item)}
              key={index}
              style={sizeStyle}
            >
              {header[0]}
            </div>
          );
        })}
      </div>
      {!isShowRightBtn() && numberCheckedMonth > MAX_MONTH_COUNT && (
        <div className={classNames(style.table__br_right)}></div>
      )}
      <div className={classNames(s.report__item, s.report__toRight)}>
        {isShowRightBtn() && (
          <Button
            className={classNames(s.report__periodButton, s.report__checkPeriod_toRight)}
            icon={<Icon stroke className={classNames(s.icon__style)} height={16} width={16} name="arrow-down" />}
            onClick={plusOffset}
          />
        )}
      </div>
    </div>
  );
};
