import classNames from 'classnames';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {useState, useEffect, createContext, useCallback} from 'react';
import {useLocation} from 'react-router';

import {profitService} from 'api';
import {totalStatType} from 'api/dto/Income';
import {fundService} from 'api/services/fundsService';
import {DatePicker} from 'shared/components/DatePicker';
import {DatePickerType} from 'shared/components/DatePicker/DatePicker';
import {YearsHeader} from 'shared/components/Funds/YearsHeader/YearsHeader';
import {Loader} from 'shared/components/Loader';
import {currentYear} from 'shared/constants/actualDate';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {parseDatePicker} from 'shared/utils/parseDatePicker/parseDatePicker';
import {getLastDayDate} from 'shared/utils/prepareDate/getLastDayDate';
import {DATE_API_FORMAT, prepareDate} from 'shared/utils/prepareDate/prepareDate';

import {FundInfo} from '../CostsTable/columns';
import s from '../FundDetails.module.scss';
import {ProfitCards} from '../ProfitCards';
import {ProfitTable} from '../ProfitTable';
import {getHeaders, getColumnsData, addFirstAnfLastDataColumns} from '../ProfitTable/utils';
import {TabHeading} from '../TabHeading';
import {GeneralIncomeInfoType, getInitialDateInterval} from '../utils';

dayjs.extend(isBetween);

export const TriggerTableContext = createContext<((date: Date) => void) | null>(null);

export const MAX_MONTH_COUNT = 10;
export const PROFIT_DATE_FORMAT = 'DD.MM.YYYY';
export const MAX_INDEX_OF_SHOWN_COLUMNS = 9;
const COUNT_INDEXES_OF_MONTHS_IN_YEAR = 11;
const ERROR_MESSAGE = 'Произошла ошибка получения данных';
const START_OFFSET = 2;

const placeholderText = `${dayjs(getInitialDateInterval()[0]).format(PROFIT_DATE_FORMAT)}-${dayjs(
  getInitialDateInterval()[1],
).format(PROFIT_DATE_FORMAT)}`;

export const ProfitTab = () => {
  const [commonInfo, setCommonInfo] = useState<FundInfo>();
  const [tableData, setTableData] = useState<Array<string | number>[]>([]);
  const [filteredData, setFilteredData] = useState<Array<string | number>[]>([]);
  const [totalStat, setTotalStat] = useState<totalStatType>();
  const [isSwitchedByYear, setSwitchedByYear] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberCheckedMonth, setNumberCheckedMonth] = useState<number>(COUNT_INDEXES_OF_MONTHS_IN_YEAR);
  const [headersList, setHeadersList] = useState<string[]>([]);
  const [filteredHeadersList, setFilteredHeadersList] = useState<string[]>([]);
  const [offset, setOffset] = useState(START_OFFSET);
  const {showToast} = useToast();
  const location = useLocation();
  const [generalInfo, setGeneralInfo] = useState<GeneralIncomeInfoType>();
  const [isNeedToUpdateTable, setIsNeedToUpdateTable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const triggerTable = useCallback(
    (date: Date) => {
      const isNeedTrigger = isSwitchedByYear
        ? dayjs(date).format('YYYY') === String(currentYear)
        : dayjs(date).isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]');
      setIsNeedToUpdateTable(isNeedTrigger);
    },
    [endDate, startDate, isSwitchedByYear],
  );

  async function getGeneralInfo() {
    let generalInfo: GeneralIncomeInfoType;
    try {
      const res = await profitService.getGeneralStats(location.state.id);
      generalInfo = res.data;
      setGeneralInfo(generalInfo);
    } catch (e) {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
  }

  const setDate = (dates: [Date, Date]): void => {
    const [start, end] = dates;
    const uiEndDate = getLastDayDate(end);
    setStartDate(start);
    setEndDate(uiEndDate);

    if (end) {
      const numberMonth = dayjs(end).diff(start, 'month');
      setNumberCheckedMonth(numberMonth);
      setSwitchedByYear(false);
      setOffset(numberMonth - MAX_INDEX_OF_SHOWN_COLUMNS);
    }

    if (end === null && start === null) {
      setNumberCheckedMonth(COUNT_INDEXES_OF_MONTHS_IN_YEAR);
      setSwitchedByYear(true);
      setOffset(START_OFFSET);
    }
  };

  const getState = async () => {
    const startDateString = prepareDate(startDate, DATE_API_FORMAT) || `${currentYear}-01-01`;
    const endDateString = prepareDate(endDate, DATE_API_FORMAT) || `${currentYear}-12-31`;
    const monthWithYearArray = parseDatePicker(startDateString, endDateString);
    const res = await profitService.getProfitStatsByFundOfPeriod(location.state.id, startDateString, endDateString);
    const {items: statisticArray, ...totalStat} = res;
    const columnsData = getColumnsData(statisticArray, totalStat);
    const headerArray = getHeaders(monthWithYearArray);
    setTotalStat(totalStat);
    setHeadersList(headerArray);
    setTableData(columnsData);
    filterData(columnsData, headerArray);
  };

  const getCommonInfo = async () => {
    try {
      const commonInfo = await fundService.getDetailStats(location.state.id);
      return commonInfo.data;
    } catch (e) {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
  };

  const filterData = (tableData: any, headerArray: string[]) => {
    if (numberCheckedMonth < MAX_MONTH_COUNT) {
      setFilteredData(tableData);
      setFilteredHeadersList(headerArray);
    } else if (totalStat) {
      const filterByOffset = (arr: any[]) => {
        return arr.filter((item, index) => index >= offset && index < offset + MAX_MONTH_COUNT);
      };
      const filteredDataUpdated = addFirstAnfLastDataColumns(
        tableData.map((item: any[], index: number) => {
          return filterByOffset(item.slice(1, -1));
        }),
        totalStat,
      );
      const filteredHeaders = filterByOffset(headerArray.slice(1, -1));
      setFilteredData(filteredDataUpdated);
      setFilteredHeadersList(getHeaders(filteredHeaders));
    }
  };

  useEffect(() => {
    getGeneralInfo();
    getState();
  }, []);

  useEffect(() => {
    filterData(tableData, headersList);
  }, [offset]);

  useEffect(() => {
    filterData(tableData, headersList);
  }, [totalStat]);

  const updateCommonInfo = async () => {
    setIsLoading(true);
    const commonInfo = await getCommonInfo();
    setCommonInfo(commonInfo);
    await getState();
    setIsLoading(false);
  };

  useEffect(() => {
    if (endDate) {
      updateCommonInfo();
    }
  }, [endDate]);

  useEffect(() => {
    updateCommonInfo();
  }, [numberCheckedMonth]);

  useEffect(() => {
    if (isNeedToUpdateTable) {
      updateCommonInfo();
      setIsNeedToUpdateTable(false);
    }
  }, [isNeedToUpdateTable]);

  return (
    <>
      <div className="box">
        {commonInfo && (
          <>
            <TabHeading title={commonInfo.name} />
            {generalInfo && (
              <ProfitCards triggerTable={triggerTable} getGeneralInfo={getGeneralInfo} {...generalInfo} />
            )}
            <div className={s.datapicker}>
              <DatePicker
                type={DatePickerType.rangeOrNull}
                startDate={startDate}
                endDate={endDate}
                setDate={setDate}
                placeholderText={placeholderText}
                isClearable={true}
                maxDate={new Date()}
              />
            </div>
            <div className={classNames(s.filter, {[s.filter_withLoader]: isLoading})}>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <YearsHeader
                    offset={offset}
                    setOffset={setOffset}
                    headerList={filteredHeadersList}
                    numberCheckedMonth={numberCheckedMonth}
                  />
                  <ProfitTable headersList={filteredHeadersList} tableData={filteredData} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
