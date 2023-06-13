import {useEffect} from 'react';

import s from 'modules/Data/SalaryContent/Search/Search.module.scss';
import {getAccountList} from 'modules/Logs/Search/utils';
import {FormSearch} from 'shared/components/FormSearch';
import {useRootDispatch, useRootSelector} from 'store';
import {rolesActions} from 'store/roles';
import {rolesSelectors} from 'store/roles/selectors';

export const Search = () => {
  const employeeList = useRootSelector(rolesSelectors.getEmployeeList);
  const search = useRootSelector(rolesSelectors.getSearchString);
  const dispatch = useRootDispatch();
  const setSearchString = (text: string) => dispatch(rolesActions.setSearch(text));
  const setEmployeeId = (id: number | null) => dispatch(rolesActions.setCheckedEmployeeId(id));

  useEffect(() => {
    getAccountList().then((res) => dispatch(rolesActions.setEmployeeList(res)));
  }, []);
  return (
    <FormSearch
      placeholder="Найти партнера"
      className={s.search}
      setSearchString={setSearchString}
      setId={setEmployeeId}
      list={employeeList}
      patternInput="[а-яА-Яa-zA-Z/\s]*"
      searchString={search}
    />
  );
};
