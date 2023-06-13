import {CellContext} from '@tanstack/table-core';
import {Dispatch, SetStateAction, useState} from 'react';

import {ChangeRoleItem} from 'modules/Roles/RolesTable/ChangeRoleItem';
import {Dropdown} from 'shared/components/Dropdown';
import {Account} from 'shared/models';

import {getCurrentId} from '../utils';

const roles = ['Супер-админ', 'Администратор', 'Аккаунт-менеджер', 'Роль не указана'];

type Props = {
  info: CellContext<Account, string>;
  setChanging: Dispatch<SetStateAction<boolean>>;
};
export interface PropsRoleItem {
  text: string;
  id: number;
  index: number;
  closePopup: () => void;
  previousValue: string;
}

export const RoleDropdown = ({info, setChanging}: Props) => {
  const [pressedItem, setPressedItem] = useState('');
  const id = getCurrentId(info);

  const renderRoleItem = (item: PropsRoleItem) => {
    const {text, id, index, closePopup, previousValue} = item
    return (
      <ChangeRoleItem
        id={id}
        item={String(text)}
        key={index}
        closePopup={closePopup}
        setChanging={setChanging}
        previousValue={previousValue}
        pressedItem={pressedItem}
        setPressedItem={setPressedItem}
      />
    );
  };

  return <Dropdown textButton={info.getValue()} stylePrefix="role" items={roles} id={id} renderItem={renderRoleItem} />;
};
