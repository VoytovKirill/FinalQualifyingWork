import classNames from 'classnames';
import {FC} from 'react';

import {TableNote} from 'shared/components/TableNote';

import s from './TableCell.module.scss';

interface RolesItemProps {
  stylePrefix?: string;
  text: string;
  attantion?: boolean;
}

export const TableCell: FC<RolesItemProps> = ({stylePrefix, text = '', attantion}) => {
  return (
    <>
      {' '}
      <div className={classNames({[s[stylePrefix || '']]: !!stylePrefix, attantion: attantion})}>{text}</div>
      {attantion && <TableNote text="Не указана роль партнера" className={s.note} />}
    </>
  );
};
