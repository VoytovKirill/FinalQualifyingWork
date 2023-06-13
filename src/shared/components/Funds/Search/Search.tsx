import {FC} from 'react';

import {FormSearch} from 'shared/components/FormSearch';
import {useRootSelector, useRootDispatch} from 'store';
import {fundsInstances} from 'store/utils/fundSliceCreator';
import {SearchListItem} from 'typings/global';

type Props = {
  setIsNotFoundShow?: any;
  fundType: 'fonds' | 'tracked';
  shortFundsList: SearchListItem[];
};

export const Search: FC<Props> = ({setIsNotFoundShow, fundType, shortFundsList}) => {
  const searchString = useRootSelector(fundsInstances[fundType].getSearchName);
  const dispatch = useRootDispatch();
  const setSearchString = (search: string) => dispatch(fundsInstances[fundType].actions.setSearchName(search));
  const setFundId = (id: number | null) => dispatch(fundsInstances[fundType].actions.setSearchId(id));

  return (
    <>
      <FormSearch
        placeholder="Найти фонд"
        setSearchString={setSearchString}
        setId={setFundId}
        list={shortFundsList}
        searchString={searchString}
        setIsNotFoundShow={setIsNotFoundShow}
      />
    </>
  );
};
