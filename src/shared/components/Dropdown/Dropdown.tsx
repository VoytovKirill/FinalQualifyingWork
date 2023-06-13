import classNames from 'classnames';
import {FC, useState, useRef} from 'react';

import {PropsItem} from 'modules/Data/SalaryContent';
import {PropsRoleItem} from 'modules/Roles/RolesTable/RoleDropdown';
import {Icon} from 'shared/components/Icon';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';

import s from './Dropdown.module.scss';
import {DropdownButton} from './DropdownButton';

import {Popup} from '../Popup';

interface Props {
  className?: string;
  textButton: string;
  renderItem: (item: PropsRoleItem | PropsItem) => JSX.Element;
  stylePrefix?: string;
  items: string[] | number[];
  id?: number;
}

const Dropdown: FC<Props> = ({textButton, stylePrefix, items, id = 0, renderItem}) => {
  const [isOpenMenu, toogleOpenMenu] = useState(false);

  const dropdownRef = useRef(null);

  const onDropdownClick = () => {
    toogleOpenMenu(!isOpenMenu);
  };

  useOutsideClick(dropdownRef, () => toogleOpenMenu(false));

  return (
    <div className={classNames(s.dropdown, s[`dropdown_${stylePrefix}`])} ref={dropdownRef}>
      <DropdownButton
        textButton={textButton}
        style={s}
        className={classNames(s.dropdown__button, {[s.dropdown__button_active]: isOpenMenu})}
        onClick={onDropdownClick}
      >
        <Icon className={s.dropdown__icon} stroke width={28} height={28} name="arrow-down" />
      </DropdownButton>
      {isOpenMenu && (
        <Popup stylePrefix={stylePrefix}>
          {items.map((row, index) =>
            renderItem({
              text: String(row),
              id: id || 0,
              index: index || 0,
              closePopup: onDropdownClick,
              previousValue: textButton,
            }),
          )}
        </Popup>
      )}
    </div>
  );
};

export {Dropdown};
