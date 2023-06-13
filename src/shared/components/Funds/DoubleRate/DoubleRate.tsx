import classNames from 'classnames';
import {FC} from 'react';

import {Icon} from 'shared/components/Icon';

import s from './DoubleRate.module.scss';

interface DoubleRateProps {
  doubleRate: string | null;
}

export const DoubleRate: FC<DoubleRateProps> = ({doubleRate}) => {
  return (
    <div className={classNames(s.rate)}>
      <div className={s.rate__icon}>
        <Icon fill height={13} width={13} name="2x" />
      </div>
      <div className={s.rate__text}>
        <p>{doubleRate} часов по 2х оплате</p>
      </div>
    </div>
  );
};
