import classNames from 'classnames';
import {ChangeEvent, Dispatch, FC, FormEventHandler, SetStateAction, useEffect, useRef, useState} from 'react';

import {Button} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {Popup} from 'shared/components/Popup';
import {SearchListItem} from 'typings/global';

import s from './FormSearch.module.scss';

// TODO сделать аргументы setSearchString setEmployeId обязательным после добавления поиска на страницах с фондами

type Props = {
  className?: string;
  setSearchString?: (search: string) => void;
  setIsNotFoundShow?: Dispatch<SetStateAction<boolean>>;
  setId?: (id: number | null) => void;
  placeholder?: string;
  list?: SearchListItem[];
  patternInput?: string;
  searchString?: string;
};

export const FormSearch: FC<Props> = ({
  placeholder,
  className = '',
  list = [],
  setSearchString,
  setId,
  patternInput,
  searchString = '',
  setIsNotFoundShow,
}) => {
  const [filteredList, setFilteredList] = useState<SearchListItem[]>(list);
  const [isShowPopup, setIsShowPopup] = useState<boolean>(false);
  const [isItemChecked, setIsItemChecked] = useState(false);
  const [isFocusInput, setIsFocusInput] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newList = !searchString ? list : filter(list);
    setFilteredList(newList);
  }, []);

  useEffect(() => {
    checkNotFoundShown();
  }, [filteredList]);

  const filter = (array: SearchListItem[]) => {
    return array.filter((item: SearchListItem) => item.text.toLowerCase().includes(searchString.toLowerCase()));
  };

  function checkNotFoundShown() {
    if (!filteredList.length && searchString) {
      if (setIsNotFoundShow) setIsNotFoundShow(true);
    }
    if (filteredList.length === 1) {
      handleClickBtn(filteredList[0].id, filteredList[0].text);
    }
  }

  useEffect(() => {
    if (isFocusInput) searchInputRef.current?.focus();
    setIsShowPopup(!!filteredList.length || !searchString);
  }, [isFocusInput]);

  useEffect(() => {
    const newList = !searchString ? list : filter(list);
    setFilteredList(newList);

    setIsShowPopup(!isItemChecked && !!newList.length && isFocusInput);
  }, [searchString, list]);

  const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (setIsNotFoundShow) setIsNotFoundShow(false);
    const isValid = e.target.validity.valid;

    if (isValid && setSearchString) {
      setSearchString(e.target.value);
    }
    if (setId) setId(null);
    setIsItemChecked(false);
  };

  const blurHandler = () => {
    if (isShowPopup) {
      setTimeout(() => {
        setIsShowPopup(false);
      }, 300);
    }
    setIsFocusInput(false);
  };

  const focusHandler = () => {
    setIsFocusInput(true);
    if (!!filteredList?.length) setIsShowPopup(true);
  };

  const handlerSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    checkNotFoundShown();
  };

  const clear = () => {
    if (setSearchString) setSearchString('');
    setId && setId(null);
    setIsItemChecked(false);
    setFilteredList(list);
  };

  function handleClickBtn(id: number, text: string) {
    if (setIsNotFoundShow) setIsNotFoundShow(false);
    if (setId) setId(id);
    if (setSearchString) setSearchString(text);
    setIsItemChecked(true);
  }

  const renderItem = (item: SearchListItem) => {
    const handleClick = () => handleClickBtn(item.id, item.text);
    return (
      <Button key={item.id} onClick={handleClick}>
        {item.text}
      </Button>
    );
  };

  return (
    <>
      <form className={classNames(s.formSearch, className)} onSubmit={handlerSubmit} noValidate>
        <div className={s.formSearch__box}>
          <div className={classNames(s.form__item, s.formSearch__item)}>
            <input
              className={classNames(s.input, s.formSearch__input)}
              type="text"
              autoComplete="on"
              placeholder={placeholder}
              onChange={changeInput || undefined}
              onFocus={focusHandler}
              onBlur={blurHandler}
              pattern={patternInput || undefined}
              value={searchString}
              ref={searchInputRef}
            />
            <Button
              className={classNames(s.formSearch__buttonSearch)}
              icon={<Icon fill className={s.ctrlButton__icon} height={24} width={24} name="loupe" />}
            />
            <Button
              className={classNames(s.formSearch__buttonClear)}
              type="button"
              icon={<Icon fill className={s.ctrlButton__icon} height={14} width={14} name="close" />}
              onClick={clear}
            />
          </div>
        </div>
        {!!isShowPopup && !!filteredList.length && (
          <Popup stylePrefix="search">{filteredList?.map((item: SearchListItem) => renderItem(item))}</Popup>
        )}
      </form>
    </>
  );
};
