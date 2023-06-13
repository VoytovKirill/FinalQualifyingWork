import classNames from 'classnames';
import {FC, useRef, useState, useEffect} from 'react';

import {tfaService} from 'api';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {Loader} from 'shared/components/Loader';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';
import {useRootSelector, usersSelectors} from 'store';

import s from './BackupCodesModal.module.scss';

interface ModalProps {
  onClose: () => void;
}

const BackupCodesModal: FC<ModalProps> = ({onClose}) => {
  const modalRef = useRef(null);
  const token = useRootSelector(usersSelectors.getUserToken);

  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    tfaService.createRecoveryCodes().then((response) => {
      setCodes(response.data.recoveryCodes);
    });
  }, [token]);

  useOutsideClick(modalRef, onClose);

  const COUNT_CODES = 10;

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(codes?.reduce((acc: string, item: string) => (acc += item + '\n'), '') || '');
  };

  const codesItem = !codes?.length ? (
    <Loader />
  ) : (
    <>
      <div>
        {codes
          ?.filter((_, index) => index < COUNT_CODES / 2)
          .map((code, index) => (
            <div key={index} className={s.popup__codesItem}>
              {code}
            </div>
          ))}
      </div>
      <div>
        {codes
          ?.filter((_, index) => index > COUNT_CODES / 2 - 1)
          .map((code, index) => (
            <div key={index} className={s.popup__codesItem}>
              {code}
            </div>
          ))}
      </div>
    </>
  );

  return (
    <div className={s.popup}>
      <div className={classNames(s.popup__item, s.popup__item_green)} ref={modalRef}>
        <div className={s.popup__header}>
          <div className={s.popup__title}>Резервные коды</div>
          <Button
            onClick={onClose}
            className={s.popup__close}
            icon={<Icon name="cross" stroke width={12} height={12} />}
          />
        </div>
        <div className={classNames(s.popup__body, s.popup__code)}>
          <div className={s.popup__text}>
            Если у вас не будет доступа к телефону или вы
            <br /> не сможете получить код через приложение
            <br /> для аутентификации, войдите в систему с помощью
            <br /> этих кодов.
          </div>
          <div className={s.popup__text_title}>Храните их в надёжном месте.</div>
          <div className={s.popup__codes}>{codesItem}</div>
          {!!codes?.length && (
            <Button onClick={copyRecoveryCodes} variants={[ButtonStyleAttributes.colorGreen]}>
              Скопировать в буфер обмена
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export {BackupCodesModal};
