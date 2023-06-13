export const recoveryCodeValidation = (code: string): boolean | number => {
  if (code.length === 7) {
    const regexpLogin = new RegExp('^[a-zA-Z0-9]{1,7}$');
    return regexpLogin.test(code);
  } else {
    return code.length;
  }
};
