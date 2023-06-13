import classNames from 'classnames';
import {FC, useRef, useState} from 'react';

import {Button} from 'shared/components/Button';
import s from 'shared/components/Funds/FilterMenu/FilterMenu.module.scss';
import {Icon} from 'shared/components/Icon';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';

interface FilterItemProps {
  text?: string;
  filters?: string[];
  changeState: (text: string) => void;
}

export const FilterItem: FC<FilterItemProps> = ({text, filters, changeState}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterDropDownRef = useRef(null);

  const onDropdownClick = () => {
    setIsOpen((prevState) => !prevState);
  };
  const parseFilters = filters?.map((item, index) => (
    <span key={index} className={s.dropdown__item} onClick={() => changeState(item)}>
      {item}
    </span>
  ));

  useOutsideClick(filterDropDownRef, () => setIsOpen(false));

  return (
    <div className={s.filter__menu} ref={filterDropDownRef}>
      <Button
        className={classNames(s.filter__menuButton)}
        icon={<Icon stroke className={s.ctrlButton__icon} height={16} width={16} name="arrow-down" />}
        onClick={onDropdownClick}
      >
        {text}
      </Button>
      {isOpen && (
        <div className={classNames(s.dropdown, s.filter__dropdown, s.isOpen)}>
          <div className={s.dropdown__box} onClick={onDropdownClick}>
            {parseFilters}
          </div>
        </div>
      )}
    </div>
  );
};
