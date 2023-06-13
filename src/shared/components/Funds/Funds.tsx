import {FC, useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router';

import {FiltersContext} from 'shared/components/Context';
import {DatePicker} from 'shared/components/DatePicker';
import {DatePickerType} from 'shared/components/DatePicker/DatePicker';
import {getShortFundsList} from 'shared/components/Funds/utils/utils';
import {Switch, SwitchStyleAttributes} from 'shared/components/Switch';
import {Filters} from 'shared/constants/filters';
import {RequestStatus} from 'shared/constants/requestsStatus';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {parseDatePicker} from 'shared/utils/parseDatePicker/parseDatePicker';
import {getLastDayDate} from 'shared/utils/prepareDate/getLastDayDate';
import {prepareDate} from 'shared/utils/prepareDate/prepareDate';
import {useRootDispatch, useRootSelector} from 'store';
import {fundsInstances} from 'store/utils/fundSliceCreator';
import {SearchListItem} from 'typings/global';

import {Actions, TrackType} from './Actions';
import {ConsolidatedReport} from './ConsolidatedReport';
import {FilterMenu} from './FilterMenu';
import s from './Funds.module.scss';
import {Search} from './Search/Search';
import {TabCosts} from './TabCosts';
import {TabProfit} from './TabProfit';

import {Tabs, TabsStyleAttributes} from '../Tabs';

interface FundsProps {
  title?: string;
  pageName: 'fonds' | 'tracked';
}

export const Funds: FC<FundsProps> = ({pageName}) => {
  const myFunds = fundsInstances[pageName];
  const selectedFundsId = useRootSelector(myFunds.getSelectedFundsId);
  const isDetailed = useRootSelector(myFunds.getIsDetailed);
  const activeFilterName = useRootSelector(myFunds.getActiveFilterName);
  const commercialFilterName = useRootSelector(myFunds.getCommercialFilterName);
  const startDate = useRootSelector(myFunds.getStartDate);
  const endDate = useRootSelector(myFunds.getEndDate);
  const [allDesiredMonths, setAllDesiredMonths] = useState<string[]>(parseDatePicker(startDate, endDate));
  const [offset, setOffset] = useState(0);
  const [shortFundsList, setShortFundsList] = useState<SearchListItem[]>([]);
  const updateTableRef = useRef<{update: () => void} | null>(null);
  const startDatePicker = startDate ? new Date(startDate) : null;
  const endDatePicker = endDate ? new Date(endDate) : null;
  const currentPageFonds = pageName === 'fonds';
  const {showToast} = useToast();
  const dispatch = useRootDispatch();
  const location = useLocation();
  const currentPageProfit = location.pathname.includes('profit');

  useEffect(() => {
    getShortFundsList(!currentPageFonds)
      .then((res) => setShortFundsList(res))
      .catch((err) => {
        if (err.response.status === RequestStatus.BAD_REQUEST) {
          showToast({type: toasts.error, description: err.message});
        }
      });
  }, []);

  const toggleDetailed = () => dispatch(myFunds.actions.toggleIsDetailed());

  const setActiveAndFilterName = (filter: boolean | null, filterName: string) => {
    dispatch(myFunds.actions.setIsActive(filter));
    dispatch(myFunds.actions.setActiveFilterName(filterName));
  };

  const setCommercialAndFilterName = (filter: boolean | null, filterName: string) => {
    dispatch(myFunds.actions.setIsCommercial(filter));
    dispatch(myFunds.actions.setCommercialFilterName(filterName));
  };

  const setActiveOption = (text: string) => {
    setDefaultSelectedFunds();
    if (text === Filters.active) {
      setActiveAndFilterName(true, Filters.active);
    } else if (text === Filters.archives) {
      setActiveAndFilterName(false, Filters.archives);
    } else {
      setActiveAndFilterName(null, Filters.all);
    }
  };

  const setCommercialOption = (text: string) => {
    setDefaultSelectedFunds();
    if (text === Filters.commercial) {
      setCommercialAndFilterName(true, Filters.commercial);
    } else if (text === Filters.internal) {
      setCommercialAndFilterName(false, Filters.internal);
    } else {
      setCommercialAndFilterName(null, Filters.all);
    }
  };

  const setDate = (dates: [Date, Date]) => {
    const [start, end] = dates;
    const uiEndDate = getLastDayDate(end);
    dispatch(myFunds.actions.setStartDate(prepareDate(start, 'YYYY-MM-DD')));
    dispatch(myFunds.actions.setEndDate(prepareDate(uiEndDate, 'YYYY-MM-DD')));
    setOffset(0);
    if (end) {
      setAllDesiredMonths(parseDatePicker(start, end));
    }
  };

  const setDefaultSelectedFunds = () => {
    dispatch(myFunds.actions.setSelectedFundsId([]));
  };

  return (
    <main className="screen">
      <div className="box">
        <div className={s.row}>{currentPageFonds && !currentPageProfit ? <ConsolidatedReport /> : null}</div>
        <div className={s.filter}>
          <div className={s.filter__group}>
            <Search fundType={currentPageFonds ? 'fonds' : 'tracked'} shortFundsList={shortFundsList} />
            <Actions
              trackType={currentPageFonds ? TrackType.track : TrackType.untrack}
              selectedFunds={selectedFundsId}
              startDate={startDatePicker}
              endDate={endDatePicker}
              clearSelectedFunds={setDefaultSelectedFunds}
              updateFundsList={() => updateTableRef.current && updateTableRef.current.update()}
              shortFundsList={shortFundsList}
            />
          </div>
          <div className={s.filter__group}>
            <div className={s.filter__group}>
              <DatePicker
                type={DatePickerType.range}
                startDate={startDatePicker}
                endDate={endDatePicker}
                setDate={setDate}
                maxDate={new Date()}
              />
              <FiltersContext.Provider value={{setActiveOption, setCommercialOption}}>
                <FilterMenu activeFilterName={activeFilterName} commercialFilterName={commercialFilterName} />
              </FiltersContext.Provider>
            </div>
            {!currentPageProfit && (
              <Switch
                onChange={toggleDetailed}
                initialState={isDetailed}
                leftText={'Кратко'}
                rightText={'Детально'}
                styleSwitch={SwitchStyleAttributes.allFounds}
              />
            )}
          </div>
        </div>
      </div>
      <Tabs
        tabsStyle={TabsStyleAttributes.fundsProfit}
        tabs={[
          {
            name: 'Затраты',
            content: (
              <TabCosts
                pageName={pageName}
                isDetailed={isDetailed}
                startDate={startDate}
                endDate={endDate}
                isCurrentPageFunds={currentPageFonds}
                offset={offset}
                setOffset={setOffset}
                allDesiredMonths={allDesiredMonths}
                updateRef={updateTableRef}
              />
            ),
            pathRoute: '',
          },
          {
            name: 'Прибыль',
            content: (
              <TabProfit
                pageName={pageName}
                startDate={startDate}
                endDate={endDate}
                isCurrentPageFunds={currentPageFonds}
                allDesiredMonths={allDesiredMonths}
                offset={offset}
                setOffset={setOffset}
                updateRef={updateTableRef}
              />
            ),
            pathRoute: 'profit',
          },
        ]}
      />
    </main>
  );
};
