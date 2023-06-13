import {FC, ReactNode, useRef} from 'react';

import {Button} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {useOutsideClick} from 'shared/hooks/useOutsideClick';

import s from './ErrorInformation.module.scss';

interface ErrorInformationProps {
  onClose: () => void;
  data: string[];
  title: string;
}

export const ErrorInformation: FC<ErrorInformationProps> = ({onClose, data, title}) => {
  const modalRef = useRef(null);
  useOutsideClick(modalRef, onClose);

  const getItems = () => {
    const COUNT_ITEM_COLUMN = 10;
    const COUNT_CONTAINERS = Math.ceil(data.length / COUNT_ITEM_COLUMN);
    const containers: ReactNode[] = [];
    for (let i = 0; i < COUNT_CONTAINERS; i++) {
      containers.push(
        data
          .slice(i * COUNT_ITEM_COLUMN, i * COUNT_ITEM_COLUMN + COUNT_ITEM_COLUMN)
          .map((item, index) => <div key={index}>{item}</div>),
      );
    }
    return containers.map((item, index) => (
      <div key={index} className={s.popup__container}>
        {item}
      </div>
    ));
  };

  return (
    <div className={s.popup}>
      <div className={s.popup__item} ref={modalRef}>
        <div className={s.popup__header}>
          <div className={s.popup__title}>{title}</div>
          <Button
            onClick={onClose}
            className={s.popup__close}
            icon={<Icon name="cross" stroke width={12} height={12} />}
          />
        </div>
        <div className={s.popup__body}>{getItems()}</div>
      </div>
    </div>
  );
};
