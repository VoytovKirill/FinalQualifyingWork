import classNames from 'classnames';
import dayjs from 'dayjs';
import {useState, useEffect} from 'react';
import {useLocation} from 'react-router';

import {fundService, IFullStats} from 'api/services/fundsService';
import {Button} from 'shared/components/Button';
import {DatePicker} from 'shared/components/DatePicker';
import {DatePickerType} from 'shared/components/DatePicker/DatePicker';
import buttonStyle from 'shared/components/Funds/Funds.module.scss';
import {MonthHeader} from 'shared/components/Funds/MonthHeader';
import {Icon} from 'shared/components/Icon';
import {currentMonth, currentYear} from 'shared/constants/actualDate';
import {KeyCodes} from 'shared/constants/keycodes';
import {Roles} from 'shared/constants/roles';
import {toasts} from 'shared/constants/toasts';
import {useKeydownPress} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';
import {parseDatePicker} from 'shared/utils/parseDatePicker/parseDatePicker';
import {convertDefaultDate} from 'shared/utils/prepareDate/convertDefaultDate';
import {getLastDayDate} from 'shared/utils/prepareDate/getLastDayDate';
import {initialStartDate, prepareDate} from 'shared/utils/prepareDate/prepareDate';
import {detailInfoSelectors, detailsInfoActions, useRootDispatch, useRootSelector, usersSelectors} from 'store';

import {AdditionalExpensesForm} from '../AdditionalExpensesForm';
import {CostsCards} from '../CostsCards';
import {CostsTable} from '../CostsTable';
import {GeneralFundInfo} from '../CostsTable/columns';
import s from '../FundDetails.module.scss';
import {TabHeading} from '../TabHeading';
import {mappingAdditionalCosts, mappingCommonInfo, mappingEmployeesInfo} from '../utils';

const ERROR_MESSAGE = 'Произошла ошибка получения данных';

export const CostsTab = () => {
  const [startDate, setStartDate] = useState<Date>(new Date(initialStartDate()));
  const [endDate, setEndDate] = useState<Date | null>(
    dayjs(getLastDayDate(new Date(currentYear, currentMonth, 1))).toDate(),
  );
  const [allDesiredMonths, setAllDesiredMonths] = useState<string[]>(parseDatePicker(startDate, endDate));
  const [detailInfo, setDetailInfo] = useState<GeneralFundInfo>();
  const [offset, setOffset] = useState(0);
  const {showToast} = useToast();
  const location = useLocation();
  const userRole = useRootSelector(usersSelectors.getRole);
  const tableData = useRootSelector(detailInfoSelectors.getTableData);
  const [isAdditionalFormOpen, setIsAdditionalFormOpen] = useState(false);
  const dispatch = useRootDispatch();

  const setDate = (dates: [Date, Date]): void => {
    const [start, end] = dates;
    const uiEndDate = getLastDayDate(end);
    setStartDate(start);
    setEndDate(uiEndDate);
    if (end) {
      const objDate = {
        start: dayjs(start).format('YYYY-MM-DD'),
        end: dayjs(end).format('YYYY-MM-DD'),
      };
      dispatch(detailsInfoActions.setDate(objDate));
      setAllDesiredMonths(parseDatePicker(start, end));
    }
  };

  const getFundById = async (params: {id: number; from: string; to: string}) => {
    try {
      const commonInfo = await fundService.getFundById(params.id, params.from, params.to, false);
      return commonInfo.data;
    } catch (e) {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
  };

  const getGeneralInfo = async () => {
    try {
      const generalInfo = await fundService.getDetailStats(location.state.id);
      return generalInfo.data;
    } catch (e) {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
  };

  const getFullStats = async (params: IFullStats) => {
    if (userRole === Roles.superAdmin || userRole === Roles.admin) {
      try {
        const fullAdditionalStats = await fundService.getFullDetailedAdditionalStats(params.id, params.from, params.to);
        return fullAdditionalStats.data;
      } catch (e) {
        showToast({type: toasts.error, description: ERROR_MESSAGE});
      }
    }
  };

  const getAdditionalStats = async (params: IFullStats) => {
    if (userRole === Roles.manager) {
      try {
        const additionalStats = await fundService.getDetailedAdditionalStats(params.id, params.from, params.to);
        return additionalStats.data;
      } catch (e) {
        showToast({type: toasts.error, description: ERROR_MESSAGE});
      }
    }
  };

  const getStats = async () => {
    const backConvertedDate = convertDefaultDate(endDate?.toString() || '', 1)!;
    const params = {
      id: location.state.id,
      from: prepareDate(startDate, 'YYYY-MM-DD') || '',
      to: backConvertedDate,
    };
    const generalInfo = await getGeneralInfo();
    const fullStats = await getFullStats(params);
    const commonInfo = await getFundById(params);
    const additionalStats = await getAdditionalStats(params);

    setDetailInfo(generalInfo);
    dispatch(detailsInfoActions.setProjectInfo(generalInfo));
    if (generalInfo && fullStats && commonInfo) {
      dispatch(
        detailsInfoActions.setDetailsInfo([
          mappingCommonInfo(commonInfo),
          ...mappingEmployeesInfo(fullStats, allDesiredMonths),
        ]),
      );
    } else if (generalInfo && commonInfo && additionalStats) {
      const {additionalCosts} = additionalStats;
      dispatch(
        detailsInfoActions.setDetailsInfo([
          mappingCommonInfo(commonInfo),
          ...mappingAdditionalCosts(additionalCosts, allDesiredMonths),
        ]),
      );
    }
  };

  const onClose = () => {
    setIsAdditionalFormOpen(false);
  };

  const onOpen = () => {
    setIsAdditionalFormOpen(true);
  };

  useKeydownPress(onClose, KeyCodes.close);

  useEffect(() => {
    getStats();
  }, [allDesiredMonths]);
  return (
    <>
      <div className="box">
        {detailInfo && (
          <>
            <TabHeading title={detailInfo.name} />
            <CostsCards {...detailInfo} />
            <div className="box">
              <div className={s.container}>
                <DatePicker type={DatePickerType.range} startDate={startDate} endDate={endDate} setDate={setDate} />
                <Button
                  className={classNames(
                    buttonStyle.ctrlButtonColorGreen,
                    buttonStyle.ctrlButtonReverse,
                    buttonStyle.filter__button,
                  )}
                  type={'button'}
                  icon={<Icon fill className={buttonStyle.ctrlButton__icon} height={12} width={12} name={'plus'} />}
                  onClick={onOpen}
                >
                  Добавить расходы
                </Button>
                {isAdditionalFormOpen && (
                  <AdditionalExpensesForm
                    fundId={location.state.id}
                    close={onClose}
                    allDesiredMonths={allDesiredMonths}
                  />
                )}
              </div>
              {tableData[0]?.statisticsDataModels.length === allDesiredMonths.length && (
                <div className={s.filter}>
                  <MonthHeader
                    allMonths={allDesiredMonths}
                    offset={offset}
                    setOffset={setOffset}
                    maxCountOfShownColumns={4}
                  />
                  <CostsTable allMonths={allDesiredMonths} offset={offset} setOffset={setOffset} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
