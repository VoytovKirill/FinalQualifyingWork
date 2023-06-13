import classNames from 'classnames';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {ChangeEvent, FC, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {CustomInput} from 'shared/components/form/CustomInput';
import {Icon} from 'shared/components/Icon';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';
import {recoveryCodeValidation} from 'shared/utils/regexpAuth/regexpAuthReciveryCide';
import {timer} from 'shared/utils/timer/timer';
import {authAsyncActions, authSelectors, useRootDispatch, useRootSelector, usersSelectors} from 'store';

import s from './CallModalSecondary.module.scss';

interface CallModalSecondaryProps {
  onClose: () => void;
}

const CallModalSecondary: FC<CallModalSecondaryProps> = ({onClose}) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const modalRef = useRef(null);
  const [authError, setAuthError] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorMessageSecond, setErrorMessageSecond] = useState<string>('');
  const [reserveCode, setReserveCode] = useState('');
  const [countAttempt, setCountAttempt] = useState(3);
  const [countMilliSeconds, setCountMilliSeconds] = useState(timer());
  const loading = useRootSelector(authSelectors.getLoadingAuth);
  const userRole = useRootSelector(usersSelectors.getRole);
  const dispatch = useRootDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!countAttempt) {
      localStorage.setItem('limit', `${dayjs().add(20, 'minute')}`);
      setCountMilliSeconds(timer());
    }
  }, [countAttempt]);

  useEffect(() => {
    let displayedTimer: string | number | NodeJS.Timeout | undefined;
    if (countMilliSeconds > 0) {
      displayedTimer = setInterval(() => setCountMilliSeconds(countMilliSeconds - 1000), 1000);
      const timeToNextReq = dayjs(countMilliSeconds).format('mm:ss');
      onErrorData(
        'error',
        'Вы исчерпали допустимое количество попыток ввода,',
        ` повторный ввод будет доступен через ${timeToNextReq}`,
      );
    } else {
      setCountAttempt(3);
    }
    return () => clearInterval(displayedTimer);
  }, [countMilliSeconds]);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setReserveCode(e.target.value);
    if (countMilliSeconds <= 0) onErrorData();
  };

  const onErrorData = (isError = '', errorMessage = '', errorMessageSecond = '') => {
    setAuthError(isError);
    setErrorMessage(errorMessage);
    setErrorMessageSecond(errorMessageSecond);
  };

  const verifyCode = async (reserveCode: string) => {
    await dispatch(authAsyncActions.verifyRecovery(reserveCode));
    if (userRole === Roles.user) navigate(routes.authStep3);

    let declination = '';
    countAttempt === 1 ? (declination = 'попытка') : (declination = 'попытки');
    onErrorData('error', `Код-пароль указан не верно, осталось ${countAttempt - 1} ${declination}.`);
    setCountAttempt((prevState) => prevState - 1);
  };

  const sendCode = () => {
    if (countMilliSeconds <= 0) {
      if (reserveCode) {
        const resultValidation = recoveryCodeValidation(reserveCode);
        if (resultValidation === true) {
          verifyCode(reserveCode);
        } else if (resultValidation > 7) {
          onErrorData('error', 'Введено больше 7 символов.');
        } else {
          onErrorData('error', 'Введено меньше 7 символов.');
        }
      } else {
        onErrorData('error', 'Заполните поле');
      }
    }
  };

  useOutsideClick(modalRef, onClose);

  return (
    <>
      <div className={s.modalFilling__header}>
        <div className={s.modalFilling__title}>Ввод резервного кода</div>
        <Button
          onClick={onClose}
          className={s.modalFilling__close}
          icon={<Icon name="cross" stroke width={12} height={12} />}
        />
      </div>
      <div className={classNames(s.modalFilling__body, s.modalFilling__code)}>
        <div className={s.modalFilling__text_title}>Каждый код можно использовать только один раз.</div>
        <div className={s.modalFilling__text}>
          Если вы опасаетесь, что доступ к вашим кодам был
          <br /> рассекречен или большая часть кодов уже использована,
          <br /> вы можете создать новые коды в личном кабинете.
        </div>
        <div className={s.modalFilling__size}>
          <CustomInput
            onChangeInput={onChangeInput}
            value={reserveCode}
            styleName="input"
            error={authError}
            className={s.modalFilling__input}
          />
        </div>
        {authError ? (
          <div className={s.modalFilling__error}>
            {errorMessage} <br /> {errorMessageSecond}{' '}
          </div>
        ) : null}
        <Button
          onClick={sendCode}
          variants={[ButtonStyleAttributes.colorGreen]}
          disabled={loading}
          className={classNames(s.modalFilling__buttonForm)}
        >
          Войти
        </Button>
      </div>
    </>
  );
};

export {CallModalSecondary};
