import classNames from 'classnames';
import {FC, ReactNode} from 'react';

import s from './MessageTimer.module.scss';

interface MessageTimerProps {
  children: ReactNode;
}

export const MessageTimer: FC<MessageTimerProps> = ({children}) => {
  return (
    <div className={classNames(s.message)}>
      <div className={s.box}>
        <div className={s.message__box}>
          <div className={s.message__group}>
            <div className={s.message__timer}>
              <div className={s.message__timerSpinner}>
                <svg className={s.message__timerCircle} viewBox="25 25 50 50">
                  <circle className={s.message__timerPath} cx="50" cy="50" r="20" fill="none" strokeWidth="2"></circle>
                </svg>
              </div>
              <div className={s.message__timerNumber}></div>
            </div>
            <div className={s.message__content}>
              <p className={s.message__text}>Фонд Dayberry (PH) добавлен в отслеживаемые</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
