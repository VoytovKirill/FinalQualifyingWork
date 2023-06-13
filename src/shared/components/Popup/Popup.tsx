import classNames from 'classnames';
import {FC, ReactNode} from 'react';

import s from './Popup.module.scss';

interface PopupProps {
  children: ReactNode;
  stylePrefix?: string;
}

export const Popup: FC<PopupProps> = ({children, stylePrefix}) => {
  return <div className={classNames(s.popup, s[`popup_${stylePrefix}`])}>{children}</div>;
};
