import classNames from 'classnames';
import {ChangeEvent, FC, FormEventHandler, useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {CallModalSecondary} from 'modules/AuthorizationTwoFactorSecondary/CallModalSecondary';
import {BackupCodesModal} from 'shared/components/BackupCodesModal';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {CustomInput} from 'shared/components/form/CustomInput';
import {Modal} from 'shared/components/Modal';
import {PLACEHOLDER_INPUT} from 'shared/constants/placeholders';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {authCodeValidation} from 'shared/utils/regexpAuth/regexpAuthCode';
import {
  authAsyncActions,
  authSelectors,
  profileActions,
  profileSelectors,
  useRootDispatch,
  useRootSelector,
  usersSelectors,
} from 'store';

import styles from './TwoFactorSecondaryForm.module.scss';

interface TwoFactorSecondaryFormProps {
  isModalOpen: boolean | null;
  closeMenu: () => void;
}

export const TwoFactorSecondaryForm: FC<TwoFactorSecondaryFormProps> = ({isModalOpen, closeMenu}) => {
  const [authError, setAuthError] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [secondaryAuthCode, setSecondaryAuthCode] = useState('');
  const userRole = useRootSelector(usersSelectors.getRole);
  const loading = useRootSelector(authSelectors.getLoadingAuth);
  const isRecoveryCodesCompilling = useRootSelector(profileSelectors.getIsReserveCodeCompiling);
  const focusInput = useRef<HTMLInputElement>(null);
  const dispatch = useRootDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    focusInput.current?.focus();
  }, []);

  const onErrorData = (error = '', errorMessage = '') => {
    setAuthError(error);
    setErrorMessage(errorMessage);
  };

  const onChangeSecondaryAuthCode = (event: ChangeEvent<HTMLInputElement>) => {
    onErrorData();
    setSecondaryAuthCode(event.target.value);
  };

  const verifyCode = async (code: string) => {
    onErrorData();
    await dispatch(authAsyncActions.verify(code));

    if (userRole === Roles.user) navigate(routes.authStep3);
    onErrorData('error', 'Неверный код.');
    focusInput.current?.focus();
  };

  const onSubmitHandler: FormEventHandler = async (event) => {
    event.preventDefault();
    const splitCode = secondaryAuthCode.split('_').join('');
    if (splitCode) {
      if (authCodeValidation(splitCode)) {
        await verifyCode(splitCode);
      } else {
        onErrorData('error', 'Неверный код.');
      }
    } else {
      onErrorData('error', 'Заполните поле.');
    }
  };

  const closeRecoveryCodesPopup = () => {
    dispatch(profileActions.setIsReserveCodeCompiling(false));
  };

  return (
    <>
      <form onSubmit={onSubmitHandler} className={classNames(styles.form, styles.formScan)}>
        <div className={classNames(styles.form__item, {[styles.isInvalid]: authError}, styles.formScan__item)}>
          <CustomInput
            styleName="input"
            placeholder={PLACEHOLDER_INPUT}
            autoComplete="on"
            onChangeInput={onChangeSecondaryAuthCode}
            type="text"
            label="Введите 6-значный код из приложения"
            labelStyle="label"
            value={secondaryAuthCode}
            error={authError}
            className={styles.input}
            mask="999_999"
            ref={focusInput}
          />
          {authError ? <div className={styles.form__error}>{errorMessage}</div> : null}
        </div>
        <div className={classNames(styles.form__item, styles.formScan__item)}>
          <Button
            className={classNames(styles.form__button, styles.formScan__button)}
            variants={[ButtonStyleAttributes.colorGreen]}
            disabled={loading || isRecoveryCodesCompilling}
          >
            Продолжить
          </Button>
        </div>
      </form>
      {isModalOpen && (
        <Modal>
          <CallModalSecondary onClose={closeMenu} />
        </Modal>
      )}
      {isRecoveryCodesCompilling && <BackupCodesModal onClose={closeRecoveryCodesPopup} />}
    </>
  );
};
