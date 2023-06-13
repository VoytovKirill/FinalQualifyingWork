import {FC} from 'react';

import {TableNote} from 'shared/components/TableNote';

import s from './DataTableItem.module.scss';

interface DataTableItemProps {
  text?: string | number;
  warning?: boolean;
}

export const Item: FC<DataTableItemProps> = ({warning, text = ''}) => {
  return (
    <div className={s.table__span}>
      <span>{text}</span>
      {warning && <TableNote text="Не указана ставка партнёра" />}
    </div>
  );
};
