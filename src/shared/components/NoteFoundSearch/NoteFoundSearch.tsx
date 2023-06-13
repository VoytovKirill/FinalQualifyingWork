import {FC} from 'react';

import NotFoundImg from 'assets/images/search/not_found.svg';

import s from './NoteFoundSearch.module.scss';

export interface NoteFoundSearch {
  title?: string;
  message?: string;
}

export const NoteFoundSearch: FC<NoteFoundSearch> = ({title, message}) => {
  return (
    <div className={s.message}>
      <div className={s.message__box}>
        <h2 className={s.message__title}>{title}</h2>
        <div className={s.message__text}>
          <p>{message}</p>
        </div>
        <div className={s.message__image}>
          <img src={NotFoundImg} alt="" />
        </div>
      </div>
    </div>
  );
};
