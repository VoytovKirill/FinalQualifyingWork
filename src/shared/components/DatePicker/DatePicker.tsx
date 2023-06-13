import classNames from 'classnames';
import ru from 'date-fns/locale/ru';
import dayjs from 'dayjs';
import {FC} from 'react';
import ReactDatePicker from 'react-datepicker';

import {currentYear} from 'shared/constants/actualDate';
import {getArrayYears, minYear} from 'shared/utils/arrayYears/year';
import {makeFirstCharUppercase} from 'shared/utils/makeFirstCharUppercase';

import {CustomInput} from './CustomInput/CustomInput';
import s from './DatePicker.module.scss';
import './ReactDatePicker.scss';

export enum DatePickerType {
  default = 'default',
  monthly = 'monthly',
  range = 'range',
  oneMounth = 'oneMounth',
  rangeOrNull = 'rangeOrNull',
}

interface Props {
  type: DatePickerType;
  startDate?: Date | null;
  endDate?: Date | null;
  setDate: (date: any) => void;
  error?: boolean;
  className?: string;
  isClearable?: boolean;
  isShowMonth?: boolean;
  isReadOnly?: boolean;
  customInput?: any;
  name?: string;
  maxDate?: Date;
  onFocus?: () => void | undefined;
  onBlur?: () => void | undefined;
  placeholderText?: string;
}

export const DatePicker: FC<Props> = (props) => {
  const {
    type,
    startDate,
    endDate,
    setDate,
    error,
    className,
    isClearable = false,
    isShowMonth = true,
    isReadOnly = true,
    customInput,
    name,
    maxDate,
    onFocus,
    onBlur,
    placeholderText,
  } = props;
  const years = getArrayYears();
  const isDatePickerTypeRange = type === DatePickerType.range || type === DatePickerType.rangeOrNull;

  const handleChange = (date: any) => {
    setDate(date);
    onBlur && onBlur();
  };

  const getPlaceholderText = () => {
    if (placeholderText) return placeholderText;

    if (type === DatePickerType.oneMounth) return dayjs(new Date()).locale('ru').format('DD.MM.YYYY');
    if (type === DatePickerType.default || DatePickerType.monthly)
      return makeFirstCharUppercase(dayjs().locale('ru').format('MMMM YYYY'));
  };
  return (
    <div className={classNames({[s[className || '']]: !!className}, s.center)}>
      <ReactDatePicker
        onFocus={onFocus}
        onBlur={onBlur}
        maxDate={maxDate}
        name={name}
        locale={ru}
        isClearable={isClearable}
        onChange={handleChange}
        selected={startDate}
        startDate={startDate}
        endDate={endDate}
        selectsRange={type === DatePickerType.range || type === DatePickerType.rangeOrNull}
        dateFormat={type === DatePickerType.default ? 'LLLL yyyy' : 'dd.MM.yyyy'}
        customInput={
          !!customInput ? (
            customInput
          ) : (
            <CustomInput
              error={error}
              className={s.calendar__input}
              isReadOnly={isReadOnly}
              placeholderText={getPlaceholderText()}
              isClearable={isClearable}
            />
          )
        }
        showMonthYearPicker={isShowMonth ? true : false}
        renderCustomHeader={({
          date,
          changeYear,
          decreaseYear,
          increaseYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => {
          const checkPrevYear = () => {
            return !(minYear - new Date(date).getFullYear());
          };
          const checkNextYear = () => {
            return !(currentYear - new Date(date).getFullYear());
          };
          return (
            <div>
              <button
                type="button"
                onClick={isDatePickerTypeRange && isShowMonth ? decreaseYear : decreaseMonth}
                disabled={isDatePickerTypeRange && isShowMonth ? checkPrevYear() : prevMonthButtonDisabled}
                className="react-datepicker__navigation react-datepicker__navigation--previous"
              />
              <div className="react-datepicker__current-month">
                {makeFirstCharUppercase(dayjs(date).locale('ru').format('MMMM'))}
              </div>
              <select value={dayjs(date).year()} onChange={({target: {value}}) => changeYear(Number(value))}>
                {years.map((option: number) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={isDatePickerTypeRange && isShowMonth ? increaseYear : increaseMonth}
                disabled={isDatePickerTypeRange && isShowMonth ? checkNextYear() : nextMonthButtonDisabled}
                className="react-datepicker__navigation react-datepicker__navigation--next"
              />
            </div>
          );
        }}
      />
    </div>
  );
};
