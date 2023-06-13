import classNames from 'classnames';
import {ChangeEvent, FormEventHandler, useState, useEffect} from 'react';
import {useNavigate} from 'react-router';

import {tfaService} from 'api';
import {BackupCodesModal} from 'shared/components/BackupCodesModal';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {CustomInput} from 'shared/components/form/CustomInput';
import {KeyCodes} from 'shared/constants/keycodes';
import {PLACEHOLDER_INPUT} from 'shared/constants/placeholders';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {useKeydownPress} from 'shared/hooks/';
import {authCodeValidation} from 'shared/utils/regexpAuth/regexpAuthCode';
import {
  authAsyncActions,
  profileActions,
  useRootDispatch,
  usersSelectors,
  useRootSelector,
  authSelectors,
  profileSelectors,
} from 'store';

import s from './TwoFactorForm.module.scss';

const TwoFactorForm = () => {
  const [qr, setQr] = useState<string>();
  const [authorizationCode, setAuthorizationCode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const loading = useRootSelector(authSelectors.getLoadingAuth);
  const serverError = useRootSelector(authSelectors.getError);
  const isRecoveryCodesCompilling = useRootSelector(profileSelectors.getIsReserveCodeCompiling);
  const userRole = useRootSelector(usersSelectors.getRole);
  const navigate = useNavigate();
  const dispatch = useRootDispatch();

  const closeMenu = () => {
    setIsModalOpen(false);
    dispatch(profileActions.setIsReserveCodeCompiling(false));
  };

  useKeydownPress(closeMenu, KeyCodes.close);

  useEffect(() => {
    getQr().then((data) => setQr(URL.createObjectURL(data)));
  }, []);

  useEffect(() => {
    if (serverError) setAuthError('Неверный код');
  }, [serverError]);

  useEffect(() => {
    if (!isModalOpen) {
      if (userRole === Roles.user) navigate(routes.authStep3);
    }
  }, [isModalOpen]);

  const onAuthorizationCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthorizationCode(event.target.value);
    setAuthError('');
  };

  const getQr = async () => {
    const response = await tfaService.createQrCode();
    return response.data;
  };

  const sendCode = () => {
    const splitCode = authorizationCode.split('_').join('');
    if (!splitCode) {
      setAuthError('Заполните поле');
      return;
    }
    if (!authCodeValidation(splitCode)) {
      setAuthError('Неверный код');
      return;
    }
    dispatch(authAsyncActions.enableTfa(splitCode));
  };

  const onSubmitHandler: FormEventHandler = (e) => {
    e.preventDefault();
    sendCode();
  };

  return (
    <>
      {isRecoveryCodesCompilling && <BackupCodesModal onClose={closeMenu} />}
      <form onSubmit={onSubmitHandler} className={classNames(s.form, s.formScan)}>
        <div className={classNames(s.imageBox, s.formScan__image)}>
          <img className={s.imageBox__image} src={qr} alt="" />
        </div>
        <div className={classNames(s.form__item, {[s.isInvalid]: authError}, s.formScan__item)}>
          <CustomInput
            styleName="input"
            placeholder={PLACEHOLDER_INPUT}
            autoComplete="on"
            onChangeInput={onAuthorizationCodeChange}
            type="text"
            label="Введите 6-значный код из приложения"
            labelStyle="label"
            value={authorizationCode}
            error={authError}
            className={s.input}
            mask="999_999"
          />
          {authError ? <div className={s.form__error}>{authError}</div> : null}
        </div>
        <div className={classNames(s.form__item, s.formScan__item)}>
          <Button
            className={classNames(s.form__button, s.formScan__button)}
            disabled={loading}
            variants={[ButtonStyleAttributes.colorGreen]}
            type="submit"
          >
            Продолжить
          </Button>
        </div>
      </form>
    </>
  );
};

export {TwoFactorForm};
