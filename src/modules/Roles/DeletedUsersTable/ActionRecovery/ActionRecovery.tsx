import {CellContext} from '@tanstack/table-core';
import {FC, useState} from 'react';

import {accountService} from 'api';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {Account} from 'shared/models';

import {getCurrentId} from '../utils';

const SUCCESS_MESSAGE = 'Аккаунт восстановлен';
const ERROR_MESSAGE = 'Ошибка в удалении аккаунта';

type Props = {
  info: CellContext<Account, string>;
  setChanging: () => void;
};

export const ActionRecovery: FC<Props> = ({info, setChanging}) => {
  const {showToast} = useToast();
  const [loading, setLoading] = useState(false);

  const handelUndo = async (id: number) => {
    try {
      await accountService.deleteAccount(id);
      setChanging();
    } catch (err) {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
  };

  const onRecovery = async () => {
    const id = getCurrentId(info);
    try {
      setLoading(true);
      await accountService.recoveryAccount(id);
      setChanging();
      showToast({
        type: toasts.undo,
        description: SUCCESS_MESSAGE,
        handleBtn: () => {
          handelUndo(id);
        },
      });
    } catch (err) {
      setLoading(false);
      showToast({type: toasts.error, description: 'Произошла ошибка восстановления пользователя'});
    }
  };

  return (
    <>
      <div className="btn-container">
        <Button
          className="btn"
          variants={[ButtonStyleAttributes.colorLightGreen, ButtonStyleAttributes.delete]}
          disabled={loading}
          icon={<Icon name="recovery" stroke fill />}
          onClick={() => onRecovery()}
        />
      </div>
    </>
  );
};
