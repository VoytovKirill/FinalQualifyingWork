import {FC, useState, useEffect, Dispatch, SetStateAction} from 'react';

import {FileFormat} from 'api/dto/Reports';
import {reportsService} from 'api/services/reportsService';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {FormSearch} from 'shared/components/FormSearch';
import {getUtf8FileName, saveFile} from 'shared/components/Funds/utils/utils';
import {Icon} from 'shared/components/Icon';
import {useToast} from 'shared/hooks/useToast';
import {salaryRatesFiltersActions, salaryRatesFiltersSelectors, useRootDispatch, useRootSelector} from 'store';
import {SearchListItem} from 'typings/global';

import s from './Search.module.scss';
import {getEmployeeList} from './utils';

type Props = {
  setIsNotFoundShow?: Dispatch<SetStateAction<boolean>>;
};

export const Search: FC<Props> = ({setIsNotFoundShow}) => {
  const [firedEmployeeList, setFiredEmployeeList] = useState<SearchListItem[]>([]);
  const isFired = useRootSelector(salaryRatesFiltersSelectors.getIsFired);
  const search = useRootSelector(salaryRatesFiltersSelectors.getSearch);
  const [employeeList, setEmployeeList] = useState<SearchListItem[]>([]);
  const [isShowSearchInput, setIsShowSearchInput] = useState(!!search);
  const dispatch = useRootDispatch();
  const setSearchString = (search: string) => dispatch(salaryRatesFiltersActions.setSearch(search));
  const setEmployeeId = (id: number | null) => dispatch(salaryRatesFiltersActions.setCheckedEmployeeId(id));
  const {showToast} = useToast();

  const getEmployeeLists = async () => {
    const employee = await getEmployeeList(true);
    setEmployeeList(employee);
    const firedEmployee = await getEmployeeList(false);
    setFiredEmployeeList(firedEmployee);
    setIsShowSearchInput(true);
  };

  const exportSalaryRates = async () => {
    try {
      const response = await reportsService.exportSalaryRates(FileFormat.OpenXml);
      saveFile(
        new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        getUtf8FileName(response.headers['content-disposition']),
      );
    } catch (e) {
      showToast({type: 'error', description: 'Произошла ошибка во время скачивания файла'});
    }
  };

  useEffect(() => {
    getEmployeeLists();
  }, []);

  return (
    <div className={s.container}>
      {isShowSearchInput && (
        <FormSearch
          placeholder="Найти партнера"
          className={s.search}
          setSearchString={setSearchString}
          setId={setEmployeeId}
          list={isFired ? employeeList : firedEmployeeList}
          patternInput="[а-яА-Яa-zA-Z/\s]*"
          searchString={search}
          setIsNotFoundShow={setIsNotFoundShow}
        />
      )}
      <Button
        className={s.button}
        variants={[ButtonStyleAttributes.colorLightGreen, ButtonStyleAttributes.reverse]}
        icon={<Icon name="export" stroke width={17} height={17} />}
        onClick={exportSalaryRates}
      >
        Экспортировать
      </Button>
    </div>
  );
};
