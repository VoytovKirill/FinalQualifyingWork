import {FC, PropsWithChildren, HTMLProps} from 'react';

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  onClick?: () => void;
  textButton?: string;
  children?: React.ReactNode;
  style: any;
}

const DropdownButton: FC<PropsWithChildren<ButtonProps>> = ({textButton, onClick, style, children, ...buttonProps}) => {
  return (
    <button {...buttonProps} type="button" onClick={onClick}>
      <span className={style.button__text}>{textButton}</span>
      {children}
    </button>
  );
};

export {DropdownButton};
