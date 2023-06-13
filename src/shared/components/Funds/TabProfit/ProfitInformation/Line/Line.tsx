import {FC} from 'react';

import s from 'shared/components/Funds/Funds.module.scss';

interface LineProps {
  name: string;
  data: number | string;
}

export const Line: FC<LineProps> = ({name, data}) => {
  return (
    <div className={s.profit__line}>
      <div className={s.profit__item}>{name}</div>
      <div className={s.profit__item}>{data}</div>
    </div>
  );
};
