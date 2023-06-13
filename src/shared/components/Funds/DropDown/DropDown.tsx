import classNames from 'classnames';
import {FC} from 'react';

import s from './DropDown.module.scss';

interface DropDownProps {
  filters: string[];
}

export const DropDown: FC<DropDownProps> = ({filters}) => {
  const test = filters.map((item, index) => (
    <span key={index} className={s.dropdown__item}>
      {item}
    </span>
  ));
  return (
    <div className={classNames(s.dropdown, s.filter__dropdown, s.isOpen)}>
      <div className={s.dropdown__box}>{test}</div>
    </div>
  );
};
