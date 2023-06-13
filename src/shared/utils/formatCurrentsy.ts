export const formatCurrentsy = (value: number | string, minimumFractionDigits = 2) => {
  let resValue: number | string;

  if (typeof value === 'number') {
    resValue = value;
  } else {
    resValue = Number(value?.replace(/[^\d,.]/g, '')) || '-';
  }
  const result =
    typeof resValue === 'number'
      ? String(new Intl.NumberFormat('ru', {style: 'decimal', minimumFractionDigits: 2}).format(resValue))
      : '-';
  return result;
};
