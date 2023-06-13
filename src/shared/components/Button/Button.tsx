import classNames from 'classnames';
import {isValidElement, ReactElement, cloneElement, forwardRef, ButtonHTMLAttributes, ForwardedRef} from 'react';

import s from './Button.module.scss';

import {IconProps} from '../Icon/';

export enum ButtonStyleAttributes {
  icon = 'icon',
  colorPale = 'colorPale',
  colorGreen = 'colorGreen',
  colorLightGreen = 'colorLightGreen',
  colorTransparent = 'colorTransparent',
  reverse = 'reverse',
  delete = 'delete',
  recovery = 'recovery',
  withoutBg = 'withoutBg',
  lock = 'lock',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variants?: ButtonStyleAttributes[];
  className?: string;
  icon?: ReactElement<IconProps>;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

export const Button = forwardRef((props: ButtonProps, ref?: ForwardedRef<HTMLButtonElement>) => {
  const {variants, className, icon, onClick, type, children, ...buttonProps} = props;

  const variantsClassString = variants?.map((variant) => s[`ctrlButton_${variant}`]);

  const getIcon = () =>
    icon && isValidElement(icon)
      ? cloneElement(icon, {
        ...icon.props,
        className: classNames(s.ctrlButton__icon, icon.props.className),
      })
      : null;

  return (
    <button
      {...buttonProps}
      className={classNames(s.ctrlButton, variantsClassString, className)}
      onClick={onClick}
      type={type}
      ref={ref}
    >
      <span className={s.ctrlButton__container}>
        <span className={s.ctrlButton__text}>{children}</span>
        {icon ? getIcon() : null}
      </span>
    </button>
  );
});
