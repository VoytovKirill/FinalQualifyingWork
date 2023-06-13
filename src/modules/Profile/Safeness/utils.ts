import {profileService} from 'api/services/profileService';

export const getCountCodesString = async () => {
  const {data: count} = await profileService.getRecoveryCodesCount();
  if (count >= 5) return `У вас осталось ${count} кодов`;
  if (count === 1) return `У вас остался ${count} код`;
  if (count === 0) return 'У вас отсутствуют резервные коды. Необходимо их создать';
  else return `У вас осталось ${count} кода`;
};
