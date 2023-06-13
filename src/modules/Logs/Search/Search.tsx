import {Dispatch, FC, SetStateAction} from 'react';

import {FormSearch} from 'shared/components/FormSearch';
import {useRootDispatch, useRootSelector} from 'store';
import {logsActions} from 'store/logs';
import {logsSelectors} from 'store/logs/selectors';

type Props = {
  setIsNotFoundShow: Dispatch<SetStateAction<boolean>>;
};

export const Search: FC<Props> = ({setIsNotFoundShow}) => {
  const searchString = useRootSelector(logsSelectors.getSearchString);
  const employeeList = useRootSelector(logsSelectors.getEmployeeList);
  const dispatch = useRootDispatch();

  const setSearchString = (text: string) => {
    dispatch(logsActions.setSearchString(text));
  };

  const setAccountId = (id: number | null) => {
    dispatch(logsActions.setAccountId(id));
  };

  return (
    <FormSearch
      searchString={searchString}
      setSearchString={setSearchString}
      setId={setAccountId}
      setIsNotFoundShow={setIsNotFoundShow}
      list={employeeList}
      placeholder="Найти партнера"
      patternInput="[а-яА-Яa-zA-Z/\s]*"
    />
  );
};
