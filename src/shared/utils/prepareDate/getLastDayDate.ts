export const getLastDayDate = (date: Date | null) => {
  if (date) return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return date;
};
