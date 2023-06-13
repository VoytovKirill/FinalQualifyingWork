import {CellContext} from '@tanstack/table-core';
import {FC, Dispatch, SetStateAction, useState} from 'react';

import {accountService} from 'api';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {ConfirmationPopup} from 'shared/components/ConfirmationPopup';
import {Icon} from 'shared/components/Icon';
import {toasts} from 'shared/constants/toasts';
import {usePopup} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';
import {Account} from 'shared/models';

import {getCurrentId} from '../utils';

type Props = {
  info: CellContext<Account, string>;
  setChanging: Dispatch<SetStateAction<boolean>>;
};

export const ActionDelete: FC<Props> = ({info, setChanging}) => {
  const {handleClose, handleOpen, openPopup} = usePopup();
  const {showToast} = useToast();
  const [loading, setLoading] = useState(false);
  const id = getCurrentId(info);

  const openConfirmActionPopup = () => {
    handleOpen();
  };

  const onDelete = async () => {
    handleClose();
    try {
      setLoading(true);
      await accountService.deleteAccount(id);
      setChanging(true);
    } catch (err) {
      setLoading(false);
      showToast({type: toasts.error, description: 'Произошла ошибка удаления пользователя'});
    }
  };

  return (
    <>
      <div className="btn-container">
        <Button
          className="btn"
          variants={[ButtonStyleAttributes.colorLightGreen, ButtonStyleAttributes.delete]}
          icon={<Icon name="basket" stroke />}
          onClick={openConfirmActionPopup}
          disabled={loading}
        />
      </div>
      {openPopup && (
        <ConfirmationPopup
          text={'Вы уверены, что хотите удалить партнёра из системы ролей ?'}
          onReject={handleClose}
          onAccept={onDelete}
          acceptText="Да"
          rejectText="Нет"
        />
      )}
    </>
  );
};
