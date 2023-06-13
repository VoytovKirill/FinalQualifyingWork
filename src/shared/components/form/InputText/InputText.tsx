import classNames from 'classnames';
import {FC, HTMLInputTypeAttribute, InputHTMLAttributes, useState} from 'react';

import styles from './InputText.module.scss';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (...event: any[]) => void;
  value: string;
  type?: HTMLInputTypeAttribute;
  errorMessage?: string;
  reset?: () => void;
  label?: string;
  className?: string;
}

export const InputText: FC<InputTextProps> = ({
  onChange,
  value,
  type = 'text',
  reset,
  className,
  label,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <label className={classNames(styles.inputText, className)}>
      {label ? <div className={styles.inputText__label}>{label}</div> : null}
      <div
        className={classNames(styles.inputText__fieldContainer, {
          [styles.inputText__fieldContainer_focused]: isFocused,
        })}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={styles.inputText__field}
          {...inputProps}
        />
      </div>
    </label>
  );
};
