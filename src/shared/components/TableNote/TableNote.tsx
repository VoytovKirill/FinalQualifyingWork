import classNames from 'classnames';
import {FC} from 'react';

import s from './TableNote.module.scss';

import {Icon} from '../Icon';

type TableNoteProps = {
  text: string;
  className?: string;
};

export const TableNote: FC<TableNoteProps> = ({text, className}) => {
  return (
    <div className={classNames(s.note, s['note--warning'], className)}>
      <div className={s.note__icon}>
        <Icon name="question" width={13} height={13} fill />
      </div>
      <div className={s['note__text']}>
        <p>{text}</p>
      </div>
    </div>
  );
};
