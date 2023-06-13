import classNames from 'classnames';

import {Icon} from 'shared/components/Icon';

import s from './Warning.module.scss';

export const Warning = () => {
  return (
    <div className={classNames(s.note, s.noteWarning, s.report__note)}>
      <div className={s.note__icon}>
        <Icon fill height={13} width={13} name="question" />
      </div>
      <div className={s.note__text}>
        <p>Не указана ставка партнёра</p>
      </div>
    </div>
  );
};
