import classNames from 'classnames';
import {ReactNode, forwardRef} from 'react';
import ReactDOM from 'react-dom';

import s from './Modal.module.scss';

export enum ModalStyle {
  blockedScreen = 'blockedScreen',
  confirmation = 'confirmation',
  additionalExpenses = 'additionalExpenses',
  additionalExpenses_active = 'additionalExpenses_active',
  blockedCode = 'blockedCode',
  delete = 'delete',
  calculation = 'calculation',
}

interface ModalProps {
  children: ReactNode;
  modalStyle?: ModalStyle;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {children, modalStyle = ''} = props;
  return ReactDOM.createPortal(
    <div ref={ref} className={classNames(s.popup, {[s[modalStyle]]: !!modalStyle})}>
      <div className={classNames(s.popup__item, s.popup__item_green, {[s[`popup__item_${modalStyle}`]]: !!modalStyle})}>
        {children}
      </div>
    </div>,
    document.body,
  );
});
