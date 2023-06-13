import {FC, useRef, RefObject} from 'react';

import {KeyCodes} from 'shared/constants/keycodes';
import {useKeydownPress} from 'shared/hooks';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';

import s from './ConfirmationPopup.module.scss';

import {Button} from '../Button';
import {Modal, ModalStyle} from '../Modal';

type Props = {
  onAccept: () => void;
  onReject: () => void;
  text: string;
  acceptText: string;
  rejectText: string;
};

export const ConfirmationPopup: FC<Props> = (props) => {
  const {text, onAccept, onReject, acceptText, rejectText} = props;
  const popup = useRef<HTMLDivElement | null>(null);

  useKeydownPress(onReject, KeyCodes.close);
  useOutsideClick(popup as RefObject<HTMLDivElement | null>, onReject);

  return (
    <Modal modalStyle={ModalStyle.confirmation}>
      <div ref={popup}>
        <span>{text} </span>
        <div className={s.buttonsGroup}>
          <Button type="button" onClick={onAccept}>
            {acceptText}
          </Button>
          <Button type="button" onClick={onReject}>
            {rejectText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
