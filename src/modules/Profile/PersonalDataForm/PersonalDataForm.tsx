import classNames from 'classnames';
import {ChangeEvent, FC, FormEvent, FormEventHandler, useState} from 'react';
import {useSelector} from 'react-redux';

import {profileService} from 'api';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {CustomInput} from 'shared/components/form/CustomInput';
import store, {authAsyncActions, usersSelectors} from 'store';

import s from './PersonalDataForm.module.scss';

const ERROR_OF_EMPTY_FIELD = 'Все поля должны быть заполнены';
const ERROR_OF_INVALID_FIELD = 'Поля должны содержать только буквы или Кириллицу';
const ERROR_OF_LENGTH_FIELD = 'Допустимы значения от 2-х до 50 символов';

export const PersonalDataForm: FC = () => {
  const fullName = useSelector(usersSelectors.getUserName);
  const initialName = fullName?.split(' ')[1] || '';
  const initialSurname = fullName?.split(' ')[0] || '';

  const [name, setName] = useState<string>(initialName);
  const [surname, setSurname] = useState<string>(initialSurname);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const changeErrorMessage = (errorMessage = '') => {
    setErrorMessage(errorMessage);
  };

  const changeErrorState = (error: boolean) => {
    setIsError(error);
  };

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    changeErrorMessage();
    changeErrorState(false);
  };

  const onChangeSurname = (event: ChangeEvent<HTMLInputElement>) => {
    setSurname(event.target.value);
    changeErrorMessage();
    changeErrorState(false);
  };

  const onSubmitHandler: FormEventHandler = async (event) => {
    event.preventDefault();
    if (!name || !surname) {
      changeErrorMessage(ERROR_OF_EMPTY_FIELD);
      changeErrorState(true);
      return;
    } else if (name.length > 50 || name.length < 2 || surname.length > 50 || surname.length < 2) {
      changeErrorMessage(ERROR_OF_LENGTH_FIELD);
      changeErrorState(true);
      return;
    }
    try {
      await profileService.putPersonalData(name, surname);
      store.dispatch(authAsyncActions.refreshToken());
    } catch (e) {
      changeErrorMessage(ERROR_OF_INVALID_FIELD);
      changeErrorState(true);
    }
  };

  return (
    <>
      <form className={classNames(s.form)} onSubmit={(event: FormEvent<HTMLFormElement>) => onSubmitHandler(event)}>
        <div className={classNames(s.form__item)}>
          <CustomInput
            styleName="input"
            placeholder="Имя"
            onChangeInput={onChangeName}
            type="text"
            label="Имя"
            labelStyle="personalData"
            value={name}
            error={isError ? errorMessage : ''}
          />
        </div>
        <div
          className={classNames(s.form__item, {[`${s.form__notError}`]: !isError}, {[`${s.form__onError}`]: isError})}
        >
          <CustomInput
            styleName="input"
            placeholder="Фамилия"
            autoComplete="on"
            type="text"
            onChangeInput={onChangeSurname}
            label="Фамилия"
            labelStyle="personalData"
            value={surname}
            error={isError ? errorMessage : ''}
          />
        </div>
        {isError ? <div className={s.form__error}>{errorMessage}</div> : null}
        <div className={classNames(s.form__item)}>
          <Button className={classNames(s.form__button)} variants={[ButtonStyleAttributes.colorGreen]}>
            Сохранить
          </Button>
        </div>
      </form>
    </>
  );
};
