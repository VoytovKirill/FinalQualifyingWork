import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export const timer = () => {
  dayjs.extend(utc);
  const limit = dayjs(localStorage.getItem('limit')).utc().diff();
  if (isNaN(limit)) return 0;
  return limit;
};
