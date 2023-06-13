const ERROR_OF_EMPTITY = 'Заполните поле.';
const ERROR_OF_LENGTH = 'Код-пароль должен состоять из 4 цифр.';

export const getValidationMessage = (code: string) => {
  if (!code) {
    return ERROR_OF_EMPTITY;
  }

  const regexp = /[0-9]{4}/;
  if (!regexp.test(code)) {
    return ERROR_OF_LENGTH;
  } else return '';
};
