import classNames from 'classnames';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReactInputMask from 'comigo-tech-react-input-mask';
import {ChangeEvent, HTMLInputTypeAttribute, PropsWithChildren, forwardRef, InputHTMLAttributes} from 'react';

import styles from './CustomInput.module.scss';

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void;
  styleName?: string;
  labelStyle?: string;
  error?: string;
  className?: string;
  label?: string;
  mask?: string | Array<string | RegExp>;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
  name?: string;
  onFocus?: any;
  maskChar?: any;
  onBlur?: any;
  beforeMaskedStateChange?: Function;
}

export const CustomInput = forwardRef<HTMLInputElement, PropsWithChildren<CustomInputProps>>((props, ref) => {
  const {
    styleName,
    labelStyle,
    onChangeInput,
    error = '',
    className,
    label,
    onFocus,
    onBlur,
    beforeMaskedStateChange,
    ...inputProps
  } = props;

  return (
    <>
      <label className={classNames(styles[`${labelStyle}`])}>{label} </label>
      <ReactInputMask
        onFocus={onFocus}
        onBlur={onBlur}
        ref={ref}
        beforeMaskedStateChange={beforeMaskedStateChange}
        className={classNames({
          [styles.error]: !!error,
          [styles[`${styleName}`]]: !!styleName,
          [`${className}`]: !!className,
        })}
        onChange={onChangeInput}
        {...inputProps}
      ></ReactInputMask>
    </>
  );
});
