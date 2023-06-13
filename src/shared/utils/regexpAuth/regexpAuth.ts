export const dataValidation = (username: string): boolean => {
  const regexpLogin = new RegExp('^.{1,30}$');
  return regexpLogin.test(username);
};
