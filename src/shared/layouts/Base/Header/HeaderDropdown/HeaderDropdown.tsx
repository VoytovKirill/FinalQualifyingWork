import classNames from 'classnames';
import {FC, useState, useRef} from 'react';

import {Icon} from 'shared/components/Icon';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';

import {DropdownButton} from './DropdownButton';
import {DropdownPopup} from './DropdownPopup';
import s from './HeaderDropdown.module.scss';

interface HeaderDropdownProps {
  className?: string;
}

const HeaderDropdown: FC<HeaderDropdownProps> = ({className}) => {
  const [isOpenMenu, toogleOpenMenu] = useState(false);
  const headerDropdownRef = useRef(null);

  const onDropdownClick = () => {
    toogleOpenMenu(!isOpenMenu);
  };

  useOutsideClick(headerDropdownRef, () => toogleOpenMenu(false));

  return (
    <div className={classNames(className, s.dropdown)} ref={headerDropdownRef}>
      <DropdownButton
        className={classNames(s.dropdown__button, {[s.dropdown__button_active]: isOpenMenu})}
        onClick={onDropdownClick}
      >
        <Icon className={s.dropdown__icon} stroke width={18} height={18} name="arrow-down" />
      </DropdownButton>
      {isOpenMenu && <DropdownPopup closePopup={onDropdownClick} />}
    </div>
  );
};

export {HeaderDropdown};
