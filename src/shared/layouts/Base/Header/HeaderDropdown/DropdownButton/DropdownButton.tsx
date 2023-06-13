import classNames from 'classnames';
import {FC, PropsWithChildren, HTMLProps} from 'react';
import {useSelector} from 'react-redux';

import {usersSelectors} from 'store/';

import s from './DropdownButton.module.scss';

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const DropdownButton: FC<PropsWithChildren<ButtonProps>> = ({children, onClick, className, ...buttonProps}) => {
  const userName = useSelector(usersSelectors.getUserName);

  return (
    <button {...buttonProps} className={classNames(s.button, className)} type="button" onClick={onClick}>
      <span className={s.button__container}>
        <span className={s.button__text}>{userName}</span>
        {children}
      </span>
    </button>
  );
};

export {DropdownButton};
