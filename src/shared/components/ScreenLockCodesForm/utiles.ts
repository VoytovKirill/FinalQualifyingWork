import {valuesType} from './ScreenLockCodesForm';

const ERROR_OF_SIMILARY = 'Код-пароли не совпадают, попробуйте снова.';
const ERROR_OF_LENGTH = 'Код-пароль должен состоять из 4 цифр.';
const ERROR_OF_EMPTY = 'Заполните все поля.';

export const getValidationMessage = ({FIRST_CODE_INPUT, SECOND_CODE_INPUT}: valuesType) => {
  if (FIRST_CODE_INPUT === '' || SECOND_CODE_INPUT === '') {
    return ERROR_OF_EMPTY;
  }
  if (FIRST_CODE_INPUT !== SECOND_CODE_INPUT) {
    return ERROR_OF_SIMILARY;
  }

  const regexp = /[0-9]{4}/;
  if (!regexp.test(FIRST_CODE_INPUT) || !regexp.test(SECOND_CODE_INPUT)) {
    return ERROR_OF_LENGTH;
  } else return '';
};
