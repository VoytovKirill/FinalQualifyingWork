import classNames from 'classnames';
import {ChangeEvent, FC, useEffect, useState, FormEvent} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {CustomInput} from 'shared/components/form/CustomInput';
import {profileAsyncActions, useRootDispatch} from 'store';

import style from './ScreenLockCodesForm.module.scss';
import {getValidationMessage} from './utiles';

const FIRST_CODE_INPUT = 'firstCode';
const SECOND_CODE_INPUT = 'secondCode';
const PLACEHOLDER_INPUT = '2456';

export type valuesType = {FIRST_CODE_INPUT: string; SECOND_CODE_INPUT: string};

export enum FormStyle {
  profile = 'profile',
  afterAuth = 'afterAuth',
}

type Props = {
  skipSetup?: () => void;
  formStyle?: FormStyle;
  onAccept?: (pin: string) => void;
};

export const ScreenLockCodesForm: FC<Props> = ({skipSetup = null, formStyle, onAccept = null}) => {
  const dispatch = useRootDispatch();
  const [error, setError] = useState<string>('');
  const [values, setValues] = useState<valuesType>({FIRST_CODE_INPUT: '', SECOND_CODE_INPUT: ''});

  useEffect(() => {
    setError('');
  }, [values]);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case FIRST_CODE_INPUT:
        setValues({...values, FIRST_CODE_INPUT: event.target.value});
        break;
      case SECOND_CODE_INPUT:
        setValues({...values, SECOND_CODE_INPUT: event.target.value});
        break;
    }
  };

  const saveCodes = async (code: string) => {
    dispatch(profileAsyncActions.enableScreenLock(code)).then(() => onAccept && onAccept(code));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = getValidationMessage(values);
    setError(error);
    if (!error) {
      saveCodes(values.FIRST_CODE_INPUT);
    }
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={classNames(style.setup__form, {[style[`setup__form_${formStyle}`]]: !!formStyle})}
      >
        {formStyle === FormStyle.afterAuth && <h3 className={style.setup__subtitle}>Создание код-пароля</h3>}
        <div className={classNames(style.setup__field, {[style.isInvalid]: error})}>
          <CustomInput
            styleName="input"
            placeholder={PLACEHOLDER_INPUT}
            autoComplete="off"
            onChangeInput={handleChangeInput}
            type="password"
            label="Введите 4-х значный код-пароль"
            labelStyle="label"
            value={values.FIRST_CODE_INPUT}
            error={error}
            className={style.setup__input}
            name={FIRST_CODE_INPUT}
            maxLength={4}
          />
        </div>
        <div className={classNames(style.setup__field, {[style.isInvalid]: !!error})}>
          <CustomInput
            styleName="input"
            placeholder={PLACEHOLDER_INPUT}
            autoComplete="off"
            onChangeInput={handleChangeInput}
            type="password"
            label="Введите код повторно"
            labelStyle="label"
            value={values.SECOND_CODE_INPUT}
            error={error}
            className={style.setup__input}
            maxLength={4}
            name={SECOND_CODE_INPUT}
          />
          {error ? <div className={style.setup__error}>{error}</div> : null}
        </div>
        <div className={style.setup__buttons}>
          <Button type="submit" className={style.setup__button} variants={[ButtonStyleAttributes.colorGreen]}>
            {formStyle === FormStyle.profile ? 'Сохранить' : 'Включить'}
          </Button>
          {skipSetup && (
            <Button
              type="button"
              className={style.setup__button}
              variants={[ButtonStyleAttributes.colorLightGreen]}
              onClick={skipSetup}
            >
              Пропустить
            </Button>
          )}
        </div>
      </form>
    </>
  );
};
