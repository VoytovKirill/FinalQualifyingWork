import classNames from 'classnames';
import {FC} from 'react';

import s from './RadioButton.module.scss';

type RadioButtonProps = {
  handleChange: (event: any) => void;
  isChecked: boolean;
  name?: string;
  disabled?: boolean;
};

export const RadioButton: FC<RadioButtonProps> = ({handleChange, isChecked, name, disabled}) => {
  return (
    <>
      <label className={classNames(s.radio, {[s.isDisabled]: disabled})}>
        <span className={s.radio__box}>
          <input
            name={name}
            className={s.radio__control}
            type="checkbox"
            value=""
            onChange={(event) => handleChange(event)}
            checked={isChecked}
          />
          <span className={s.radio__icon} />
        </span>
      </label>
    </>
  );
};
