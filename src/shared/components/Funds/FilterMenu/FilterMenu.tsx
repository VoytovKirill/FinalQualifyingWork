import {FC, useContext} from 'react';

import {FiltersContext} from 'shared/components/Context';

import {FilterItem} from './FilterItem';
import s from './FilterMenu.module.scss';

interface FilterMenuProps {
  activeFilterName: string;
  commercialFilterName: string;
}

export const FilterMenu: FC<FilterMenuProps> = ({activeFilterName, commercialFilterName}) => {
  const {setActiveOption, setCommercialOption} = useContext(FiltersContext);

  return (
    <div className={s.filter__menuGroup}>
      <FilterItem text={activeFilterName} filters={['Все', 'Активные', 'Архивные']} changeState={setActiveOption} />
      <FilterItem
        text={commercialFilterName}
        filters={['Все', 'Коммерческие', 'Внутренние']}
        changeState={setCommercialOption}
      />
    </div>
  );
};
