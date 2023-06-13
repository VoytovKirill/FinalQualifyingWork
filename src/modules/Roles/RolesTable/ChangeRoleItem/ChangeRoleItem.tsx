import classNames from 'classnames';
import {FC, Dispatch, SetStateAction, useState} from 'react';

import {accountService} from 'api';
import s from 'shared/components/Dropdown/Dropdown.module.scss';
import {Toast} from 'shared/components/Toast';
import {Roles} from 'shared/constants/roles';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {changeRoleToDTO} from 'shared/utils/role';

type Props = {
  item: string;
  id: number;
  closePopup?: (a: boolean) => void;
  changeRole?: (role: Roles) => void;
  previousValue?: string;
  setChanging: Dispatch<SetStateAction<boolean>>;
  pressedItem: string;
  setPressedItem: (a: string) => void;
};

const ERROR_MESSAGE = 'Ошибка в изменении роли';
const SUCCESS_MESSAGE = 'Роль была изменена';

export const ChangeRoleItem: FC<Props> = ({
  item,
  id,
  closePopup,
  previousValue,
  setChanging,
  pressedItem,
  setPressedItem,
}) => {
  const {showToast} = useToast();
  const isPressedItem = pressedItem === item;
  const [loading, setLoading] = useState(false);
  const currentRole = changeRoleToDTO(item);

  const handelUndo = async () => {
    try {
      await accountService.updateRole(id, changeRoleToDTO(previousValue || ''));
      setChanging(true);
    } catch (err) {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
  };

  const changeRole = async () => {
    try {
      setLoading(true);
      await accountService.updateRole(id, currentRole);
      setChanging(true);
      showToast({
        type: toasts.undo,
        description: SUCCESS_MESSAGE,
        handleBtn: () => {
          handelUndo();
        },
      });
    } catch (err) {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
    closePopup && closePopup(true);
    setLoading(false);
  };

  const handleClick = () => {
    if (isPressedItem && !loading) return changeRole();
    setPressedItem(item);
  };

  if (!item) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={classNames({[s.dropdown__button_isConfirmation]: isPressedItem})}
        disabled={loading}
      >
        {isPressedItem ? 'Подтвердить' : item}
      </button>
      <Toast />
    </>
  );
};
