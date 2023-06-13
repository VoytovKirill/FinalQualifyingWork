import classNames from 'classnames';
import {FC, HTMLProps, useState} from 'react';

import {ApiFailedResponseError} from 'api/types/ApiResponseError';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';

import s from './Switch.module.scss';

export enum SwitchStyleAttributes {
  allFounds = 'allFounds',
  profile = 'profile',
}

export interface SwitchProps extends HTMLProps<HTMLDivElement> {
  initialState?: boolean;
  leftText?: string;
  rightText?: string;
  styleSwitch?: SwitchStyleAttributes;
  onChange?: () => void;
}

export const Switch: FC<SwitchProps> = ({
  initialState = false,
  leftText,
  rightText,
  styleSwitch = '',
  onChange,
  ...props
}) => {
  const [isCheckedInput, setIsCheckedInput] = useState(initialState);
  const {showToast} = useToast();

  const handleChange = async () => {
    if (onChange) {
      try {
        await onChange();
      } catch (err: any) {
        if (err instanceof ApiFailedResponseError) {
          showToast({type: toasts.error, description: err.message});
          setIsCheckedInput(!isCheckedInput);
        }
      }
    }
  };
  const handleSwitched = () => {
    setIsCheckedInput(!isCheckedInput);
    handleChange();
  };

  return (
    <>
      <div
        className={classNames(s.switch, {[s[styleSwitch]]: styleSwitch}, {[props.className || '']: !!props.className})}
      >
        <label className={s.switch__label}>
          {!!leftText && <span className={classNames(s.switch__text, s.switch__text_left)}>{leftText}</span>}
          <input className={s.switch__input} type="checkbox" checked={isCheckedInput} onChange={handleSwitched} />
          <span className={s.switch__switcher}></span>
          {!!rightText && <span className={classNames(s.switch__text, s.switch__text_right)}>{rightText}</span>}
        </label>
      </div>
    </>
  );
};
