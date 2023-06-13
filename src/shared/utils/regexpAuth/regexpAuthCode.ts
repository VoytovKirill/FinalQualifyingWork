export const authCodeValidation = (code: string): boolean => {
  const regexpCode = new RegExp('^[0-9]{6}$');
  return regexpCode.test(code);
};
