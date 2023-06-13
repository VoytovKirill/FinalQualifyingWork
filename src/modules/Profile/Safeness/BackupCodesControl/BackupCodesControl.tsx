import classNames from 'classnames';
import {FC, useState, useEffect} from 'react';
import {useNavigate} from 'react-router';

import {ApiFailedResponseError} from 'api/types/ApiResponseError';
import {BackupCodesModal} from 'shared/components/BackupCodesModal';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {KeyCodes} from 'shared/constants/keycodes';
import {routes} from 'shared/constants/routes';
import {toasts} from 'shared/constants/toasts';
import {useKeydownPress} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';
import {profileAsyncActions, useRootDispatch} from 'store';

import s from '../Safeness.module.scss';
import {getCountCodesString} from '../utils';

const ERROR_TEXT = 'Извините, не удалось получить оставшееся количество кодов';
const ERROR_OF_NO_CODES = 'У вас отсутствуют резервные коды. Необходимо их создать';

export const BackupCodesControl: FC = () => {
  const [loading, setLoading] = useState(false);
  const [countCodesString, setCountCodesString] = useState('');
  const [isBackupCodesModalOpen, setIsModalOpen] = useState<boolean | null>(null);
  const {showToast} = useToast();
  const dispatch = useRootDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getCountCodesString()
      .then((countString) => {
        if (countString === ERROR_OF_NO_CODES) showToast({type: toasts.error, description: ERROR_OF_NO_CODES});
        setCountCodesString(countString);
      })
      .catch((err) => {
        if (err instanceof ApiFailedResponseError) {
          showToast({type: toasts.error, description: ERROR_TEXT});
        }
      });
  }, []);

  const openMenu = () => {
    setIsModalOpen(true);
  };

  const closeMenu = () => {
    setIsModalOpen(false);
  };

  useKeydownPress(closeMenu, KeyCodes.close);

  const disableTfa = async () => {
    setLoading(true);
    dispatch(profileAsyncActions.restoreTfaAccess()).then(() => navigate(routes.authStep2));
  };

  return (
    <>
      <h2>Двухфакторная аутентификация</h2>
      <h3>Резервные коды</h3>
      <p className={s.safeness__paragraf}>
        Если у вас не будет доступа к приложению двойной аутентификации, вы сможете войти в систему с помощью резервных
        кодов.
      </p>
      <h4>{countCodesString}</h4>
      <div className={s.safeness__box}>
        <p className={s.safeness__paragraf}>
          Если вы опасаетесь, что доступ к вашим кодам был рассекречен или большая часть кодов уже использована, вы
          можете создать новые коды.
        </p>
        <Button onClick={openMenu} className={s.form__button} variants={[ButtonStyleAttributes.colorGreen]}>
          Создать
        </Button>
      </div>
      <h4>Утерян доступ к приложению</h4>
      <div className={s.safeness__box}>
        <p className={s.safeness__paragraf}>
          Если доступ к приложению двойной аутентификации был утерян, вы можете привязать приложение заново.
        </p>
        <Button
          className={classNames(s.form__button)}
          variants={[ButtonStyleAttributes.colorGreen]}
          disabled={loading}
          onClick={disableTfa}
        >
          Привязать заново
        </Button>
      </div>
      {isBackupCodesModalOpen && <BackupCodesModal onClose={closeMenu}></BackupCodesModal>}
    </>
  );
};
