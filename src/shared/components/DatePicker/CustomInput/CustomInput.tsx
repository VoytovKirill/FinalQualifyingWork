import classNames from 'classnames';
import {forwardRef, ForwardedRef, ChangeEvent} from 'react';

import {Icon} from 'shared/components/Icon';
import {makeFirstCharUppercase} from 'shared/utils/makeFirstCharUppercase';

import s from './CustomInput.module.scss';

type InputProps = {
  className?: string;
  value?: string;
  error?: boolean;
  onClick?: () => void;
  isReadOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholderText?: string;
  isClearable?: boolean;
  setClear?: () => void;
};

export const CustomInput = forwardRef(
  (
    {
      value,
      error,
      onClick,
      onChange,
      className,
      isReadOnly = true,
      placeholderText,
      isClearable = false,
      setClear,
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const date = value ? makeFirstCharUppercase(value) : '';
    const isShownClearBtn = isClearable ? isClearable && !!value : false;
    return (
      <div className={classNames(s.calendar, className)}>
        <div className={s.calendar__date}>
          {!isShownClearBtn && <Icon fill className={s.calendar__icon} height={24} width={24} name="calendar" />}
          <div className={s.reactDatepickerWrapper}>
            <div className={s.reactDatepicker__inputContainer}>
              <input
                readOnly={isReadOnly}
                type="text"
                value={date}
                className={classNames({[s.isInvalid]: error})}
                ref={ref}
                onClick={onClick}
                onChange={onChange}
                placeholder={placeholderText}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
