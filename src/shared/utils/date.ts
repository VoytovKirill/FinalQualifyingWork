import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export function getDate(date: string) {
  return dayjs(date).locale('ru').format('D MMMM YYYY');
}
export function getTime(date: string) {
  return dayjs(date).format('HH:mm');
}
