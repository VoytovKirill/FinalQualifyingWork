import classNames from 'classnames';
import {FC} from 'react';

import s from 'shared/components/Funds/Funds.module.scss';

import {convertToFullWide} from '../../../utils/utils';
import {ProfitType} from '../SubTable';

interface RowProps {
  offset: number;
  maxCountOfShownColumns: number;
  name: string;
  data: ProfitType;
}

export const Row: FC<RowProps> = ({data, offset, maxCountOfShownColumns, name}) => {
  return (
    <div className={s.report__line}>
      <div className={s.report__group}>
        <div className={classNames(s.report__item, s.report__name)}>{name}</div>
        {data
          .filter((item, index) => index >= offset && index < offset + maxCountOfShownColumns)
          .map((item, index) => (
            <div key={index} className={classNames(s.report__item, s.report__itemData)}>
              {convertToFullWide(item) || '-'}
            </div>
          ))}
      </div>
    </div>
  );
};
