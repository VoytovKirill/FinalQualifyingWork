import classNames from 'classnames';
import {ChangeEvent, FC, FormEventHandler, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {authService} from 'api';
import {EyeIcon} from 'modules/DomainAuthorization/DomainAuthForm/EyeIcon';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {CustomInput} from 'shared/components/form/CustomInput';
import {routes} from 'shared/constants/routes';
import {dataValidation} from 'shared/utils/regexpAuth/regexpAuth';
import {authSelectors, useRootDispatch, useRootSelector, usersSelectors} from 'store';
import {authAsyncActions} from 'store/auth';

import styles from './DomainAuthForm.module.scss';

const ERROR_OF_EMPTY_FIELD = 'Все поля должны быть заполнены';
const ERROR_OF_INVALID_FIELD = 'Указан неверный логин или пароль, попробуйте снова.';
const ERROR_ACCESS_DENIED = 'Доступ к системе запрещен.';

export const DomainAuthForm: FC = () => {
  const [userLogin, setUserLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPasswordType, setIsPasswordType] = useState<boolean>(true);

  const dispatch = useRootDispatch();
  const navigate = useNavigate();
  const userToken = useRootSelector(usersSelectors.getUserToken);
  const loading = useRootSelector(authSelectors.getLoadingAuth);
  const error = useRootSelector(authSelectors.getError);
  const onToggleVisiblePassword = () => {
    setIsPasswordType((prevState) => !prevState);
  };

  const onChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
    setUserLogin(event.target.value);
    setErrorMessage('');
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrorMessage('');
  };

  useEffect(() => {
    if (!error) return;
    if (error.includes('401') || error.includes('400')) setErrorMessage(ERROR_OF_INVALID_FIELD);
    if (error.includes('403')) setErrorMessage(ERROR_ACCESS_DENIED);
  }, [error]);

  useEffect(() => {
    if (userToken) {
      authService.check().then((response) => {
        if (response.data.isTfaEnabled) {
          navigate(routes.authSecondary);
        } else {
          navigate(routes.authStep2);
        }
      });
    }
  }, [userToken]);

  const onSubmitHandler: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!userLogin || !password) {
      return setErrorMessage(ERROR_OF_EMPTY_FIELD);
    }
    if (dataValidation(userLogin)) {
      dispatch(authAsyncActions.login({password: password, username: userLogin}));
    } else setErrorMessage(ERROR_OF_INVALID_FIELD);
  };

  return (
    <form className={classNames(styles.form, styles.formAuthtorisation)} onSubmit={(event) => onSubmitHandler(event)}>
      <div className={classNames(styles.form__item, styles.formAuthtorisation__item, styles.isInvalid)}>
        <CustomInput
          styleName="input"
          placeholder="Доменный логин"
          autoComplete="on"
          onChangeInput={onChangeLogin}
          type="text"
          label="Логин"
          labelStyle="label"
          value={userLogin}
          error={errorMessage || ''}
        />
      </div>
      <div className={classNames(styles.form__item, styles.formAuthtorisation__item, styles.isInvalid)}>
        <div className={styles.form__inputBox}>
          <CustomInput
            styleName="input"
            placeholder="Пароль"
            autoComplete="on"
            type={isPasswordType ? 'password' : 'text'}
            onChangeInput={onChangePassword}
            label="Пароль"
            labelStyle="label"
            value={password}
            error={errorMessage || ''}
          />
          <EyeIcon onToggle={onToggleVisiblePassword} />
        </div>
        {!!errorMessage ? <div className={styles.form__error}>{errorMessage}</div> : null}
      </div>
      <div className={classNames(styles.form__item, styles.formAuthtorisation__item)}>
        <Button
          className={classNames(styles.form__button, styles.formScan__button)}
          variants={[ButtonStyleAttributes.colorGreen]}
          disabled={loading}
          type="submit"
        >
          Продолжить
        </Button>
      </div>
    </form>
  );
};
