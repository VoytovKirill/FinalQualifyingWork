import classNames from 'classnames';
import {ChangeEvent, FC, useEffect, useState, FormEvent, useRef} from 'react';
import {useNavigate} from 'react-router';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {CustomInput} from 'shared/components/form/CustomInput';
import {routes} from 'shared/constants/routes';
import {SignalrMessages} from 'shared/constants/signalrMessages';
import {useSignalr} from 'shared/utils/signalr';
import {authSelectors, useRootDispatch, useRootSelector} from 'store';
import {authAsyncActions} from 'store/auth';

import {getValidationMessage} from './utiles';

import style from '../BlockedScreen.module.scss';

export const CodeForm: FC = () => {
  const [error, setError] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const client = useSignalr();

  const dispatch = useRootDispatch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const attemptsLeftAutoBlock = useRootSelector(authSelectors.getAttemptsLeftAutoBlock);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setError('');
  }, [value]);

  const logout = async () => {
    setLoading(true);
    setError('');
    setValue('');
    await dispatch(authAsyncActions.logout());
    navigate(routes.auth);
    setLoading(false);
  };

  const errorHandler = async () => {
    if (!!attemptsLeftAutoBlock) {
      if (attemptsLeftAutoBlock === 1) setError(`У вас осталось ${attemptsLeftAutoBlock} попытка`);
      else setError(`У вас осталось ${attemptsLeftAutoBlock} попытки`);
    }
    if (attemptsLeftAutoBlock === 0) logout();
  };

  useEffect(() => {
    errorHandler();
  }, [attemptsLeftAutoBlock]);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const unLock = async (pin: string) => {
    try {
      await client.invoke(SignalrMessages.SET_SCREEN_UNLOCK, {pin});
    } catch (err) {
      logout();
    }
    setLoading(false);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = getValidationMessage(value);
    setError(error);
    if (!error) {
      setLoading(true);
      unLock(value);
    }
  };

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)} className={classNames(style.setup__form)}>
        <div className={classNames(style.setup__field, {[style.isInvalid]: error})}>
          <CustomInput
            styleName="input"
            onChangeInput={handleChangeInput}
            type="password"
            label="Чтобы разблокировать экран, введите код-пароль."
            labelStyle="label"
            value={value}
            error={error}
            className={style.setup__input}
            maxLength={4}
            ref={inputRef}
            autoComplete="off"
          />
          {error && <div className={style.setup__error}>{error}</div>}
        </div>
        <div className={style.setup__buttons}>
          <Button
            type="submit"
            className={style.setup__button}
            variants={[ButtonStyleAttributes.colorGreen]}
            disabled={loading}
          >
            Разблокировать
          </Button>
          <Button
            type="button"
            onClick={logout}
            className={style.setup__button}
            variants={[ButtonStyleAttributes.withoutBg]}
            disabled={loading}
          >
            Выйти из системы
          </Button>
        </div>
      </form>
    </>
  );
};
