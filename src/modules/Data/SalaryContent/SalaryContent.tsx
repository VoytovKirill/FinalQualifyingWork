import {useState} from 'react';

import {Dropdown} from 'shared/components/Dropdown';
import {NoteFoundSearch} from 'shared/components/NoteFoundSearch';
import {getArrayYears} from 'shared/utils/arrayYears/year';
import {salaryRatesFiltersActions, salaryRatesFiltersSelectors, useRootDispatch, useRootSelector} from 'store';

import {Table} from './DataTable';
import {Form} from './Form';
import {Import} from './Import';
import s from './SalaryContent.module.scss';
import {Search} from './Search';

enum EmployersState {
  active = 'Активные',
  fired = 'Уволенные',
}

export interface PropsItem {
  text: string;
  id: number;
  index: number;
  closePopup: () => void;
  previousValue: string;
}

export const SalaryContent = () => {
  const dispatch = useRootDispatch();
  const initialYear = useRootSelector(salaryRatesFiltersSelectors.getYearFilter);
  const isFired = useRootSelector(salaryRatesFiltersSelectors.getIsFired);
  const years = getArrayYears().reverse();
  const [year, setYear] = useState(initialYear);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isNotFoundShow, setIsNotFoundShow] = useState(false);

  const renderYearsItem = ({text = '', index, closePopup}: PropsItem) => {
    const handleClick = () => {
      setYear(Number(text));
      dispatch(salaryRatesFiltersActions.setYear(Number(text)));
      closePopup();
    };
    return <button key={index} onClick={handleClick}>{`${text} год`}</button>;
  };

  const renderEmployeeItem = ({text = '', index, closePopup, previousValue}: PropsItem) => {
    const handleClick = () => {
      if (text !== previousValue) {
        dispatch(salaryRatesFiltersActions.setIsFired(!isFired));
        dispatch(salaryRatesFiltersActions.setCheckedEmployeeId(null));
        dispatch(salaryRatesFiltersActions.setSearch(''));
      }
      closePopup();
    };

    return (
      <button key={index} onClick={handleClick}>
        {text}
      </button>
    );
  };

  return (
    <>
      <div className={s.salary__group}>
        <div className={s.salary__item}>
          <Import changeLastUpdate={setLastUpdate} />
        </div>
        <Form />
      </div>
      <Search setIsNotFoundShow={setIsNotFoundShow} />
      <div className={s.filter__container}>
        <Dropdown textButton={`${year} год`} stylePrefix="year" items={years} renderItem={renderYearsItem} />
        <Dropdown
          textButton={isFired ? EmployersState.fired : EmployersState.active}
          stylePrefix="employers"
          items={Object.values(EmployersState)}
          renderItem={renderEmployeeItem}
        />
      </div>
      {!isNotFoundShow && <Table date={lastUpdate} />}
      {isNotFoundShow && (
        <NoteFoundSearch title="Партнёр не найден" message="Попробуйте изменить ваш запрос или настройки профиля" />
      )}
    </>
  );
};
