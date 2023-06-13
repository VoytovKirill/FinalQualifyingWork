import classNames from 'classnames';
import React, {FC, useState} from 'react';
import CurrencyInput from 'react-currency-input-field';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';

import s from '../FundDetails.module.scss';

export enum RowType {
  edit = 'edit',
  text = 'text',
  color = 'color',
}
interface RowProps {
  className?: string;
  name: string;
  data: number | string;
  type: RowType;
  withIcon?: boolean;
  onSubmitChanges?: (data: number | string, name: string) => void;
}

export const Row: FC<RowProps> = ({className, name, data, type, withIcon = false, onSubmitChanges}) => {
  const [value, setValue] = useState(data);

  const onChangeInputValue = (value: number | string) => {
    setValue(value);
  };

  const onPressEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') setValue(data);
  };
  const currentRow = () => {
    if (type === RowType.edit) {
      return (
        <>
          <CurrencyInput
            value={value}
            onValueChange={(value) => {
              onChangeInputValue(value || '');
            }}
            onKeyDown={(e) => onPressEsc(e)}
            allowNegativeValue={false}
            allowDecimals={false}
            transformRawValue={(rawValue) => rawValue.replace('.', ',')}
            className={classNames(s.fundCard__input)}
          />
          {withIcon && <Icon className={s.fundCard__ruble} name="ruble" width={11} height={13} />}
          <Button
            className={s.fundCard__editButton}
            variants={[ButtonStyleAttributes.icon]}
            icon={<Icon name="pencil" width={22} height={24} fill={true} />}
            onClick={() => (onSubmitChanges ? onSubmitChanges(value, name) : null)}
          />
        </>
      );
    } else if (type === RowType.color) {
      return (
        <>
          <span>{data}</span>
          {withIcon && <Icon className={s.fundCard__ruble} name="ruble" width={11} height={13} />}
        </>
      );
    } else {
      return <span>{data}</span>;
    }
  };

  return (
    <div className={classNames(s.fundCard__detailsLine, className)}>
      <div className={s.fundCard__detailsItem}>
        <div className={s.fundCard__name}>
          <span>{name}</span>
        </div>
      </div>
      <div className={s.fundCard__detailsItem}>
        <div className={classNames(type !== RowType.edit ? s.fundCard__data : s.fundCard__editData)}>
          {currentRow()}
        </div>
      </div>
    </div>
  );
};
