import {FC} from 'react';

import {BackupCodesControl} from './BackupCodesControl';
import s from './Safeness.module.scss';
import {ScreenLockControl} from './ScreenBlockControl';

export const Safeness: FC = () => {
  return (
    <div className={s.safeness}>
      <h2>Безопасность</h2>
      <p className={s.safeness__paragraf}>
        Рекомендуем использовать все доступные уровни безопасности, это позволит предотвратить утечку конфиденциальной
        информации.
      </p>
      <ScreenLockControl />
      <BackupCodesControl />
    </div>
  );
};
