import classNames from 'classnames';
import dayjs from 'dayjs';
import {createContext, FC, useEffect, useState, MutableRefObject} from 'react';

import {FundProfitDto, FundsProfitTotals} from 'api/dto/FundsProfit';
import {GetFundsParams, GetFundsProfitParams} from 'api/services/fundsService';
import {profitService} from 'api/services/profitService';
import {Icon} from 'shared/components/Icon';
import {Loader} from 'shared/components/Loader';
import {NoteFoundSearch} from 'shared/components/NoteFoundSearch';
import {paginationSize as pageSize} from 'shared/constants/pagination';
import {toasts} from 'shared/constants/toasts';
import {useAfterFirstRender} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';
import {convertDefaultDate} from 'shared/utils/prepareDate/convertDefaultDate';
import {DATE_API_FORMAT} from 'shared/utils/prepareDate/prepareDate';
import {useRootDispatch, useRootSelector} from 'store';
import {fundsInstances} from 'store/utils/fundSliceCreator';

import {ProfitInformation} from './ProfitInformation';
import {Table} from './Table';
import {columns} from './Table/columns';
import {SubTable} from './Table/SubTable/SubTable';
import {TableWithPagination} from './TableWithPagination';

import {TableWithExpanding} from '../../TableWithExpanding';
import {TableWithSelection} from '../../TableWithSelection';
import s from '../Funds.module.scss';
import {reorderFunds} from '../utils/utils';

interface TabProfitProps {
  pageName: 'fonds' | 'tracked';
  startDate: string | null;
  endDate: string | null;
  isCurrentPageFunds: boolean;
  allDesiredMonths: string[];
  offset: number;
  setOffset: (offset: number) => void;
  updateRef: MutableRefObject<any>;
}

export const ProfitContext = createContext<any>({});

const ERROR_TOTAL = 'Не удалось получить итоговую прибыль по всем фондам. Попробуйте перезагрузть страницу';
const ERROR_FUNDS_LIST = 'Не удалось получить список фондов. Попробуйте перезагрузть страницу';

export const TabProfit: FC<TabProfitProps> = (props) => {
  const {pageName, startDate, endDate, isCurrentPageFunds, allDesiredMonths, offset, setOffset, updateRef} = props;
  const myFunds = fundsInstances[pageName];
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [funds, setFunds] = useState<FundProfitDto[]>([]);
  const [totalsStats, setTotalStats] = useState<FundsProfitTotals>({} as FundsProfitTotals);
  const searchFundId = useRootSelector(myFunds.getSearchId);
  const isActive = useRootSelector(myFunds.getIsActive);
  const isCommercial = useRootSelector(myFunds.getIsCommercial);
  const pageIndex = useRootSelector(myFunds.getPageNumber);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalSize, setTotalSize] = useState<number>(0);
  const isAfterFirstRender = useAfterFirstRender();

  const dispatch = useRootDispatch();
  const {showToast} = useToast();

  useEffect(() => {
    updateRef.current = {update: () => getFunds({pageIndex, pageSize})};
    getFunds({pageIndex, pageSize});
  }, []);

  useEffect(() => {
    if (!isAfterFirstRender) return;
    getFunds({pageIndex, pageSize});
  }, [allDesiredMonths, searchFundId]);

  useEffect(() => {
    getTotalsStats();
  }, [allDesiredMonths, isCommercial, isActive]);

  useEffect(() => {
    if (!isAfterFirstRender) return;
    if (pageIndex) dispatch(myFunds.actions.setPageNumber(0));
    else getFunds({pageIndex, pageSize});
  }, [isCommercial, isActive]);

  useEffect(() => {
    updateRef.current = {update: () => getFunds({pageIndex, pageSize})};
  }, [allDesiredMonths, isCommercial, isActive, searchFundId]);

  const getFunds = async (paginationOptions: any) => {
    const options = createOptions(false, paginationOptions);
    if (!options) return;
    const searchFund = await getFund();
    try {
      const {data} = await profitService.getFunds(options as GetFundsParams);
      if (searchFund) reorderFunds(searchFund, data, setTotalSize);
      setFunds(data.items);
      setTotalSize(data.totalSize);
      setIsLoading(false);
    } catch (err) {
      showToast({type: toasts.error, description: ERROR_FUNDS_LIST});
    }
  };

  const getFund = async () => {
    if (!(startDate && endDate)) return;
    if (searchFundId) {
      try {
        const backConvertedDate = convertDefaultDate(endDate, 1)!;
        const {data} = await profitService.getFund(
          searchFundId,
          dayjs(startDate).format(DATE_API_FORMAT),
          dayjs(backConvertedDate).format(DATE_API_FORMAT),
        );
        return data;
      } catch (err) {
        return null;
      }
    }
    return null;
  };

  const getTotalsStats = async () => {
    const options = createOptions(true);
    if (!options) return;
    try {
      const response = await profitService.getTotals(options as GetFundsProfitParams);
      setTotalStats(response.data);
    } catch (err) {
      showToast({type: toasts.error, description: ERROR_TOTAL});
    }
  };

  const createOptions = (isProfit: boolean, paginationOptions?: any) => {
    if (!(startDate && endDate)) return null;
    const backConvertedDate = convertDefaultDate(endDate, 1)!;
    const baseOptions = {
      from: dayjs(startDate).format(DATE_API_FORMAT),
      to: dayjs(backConvertedDate).format(DATE_API_FORMAT),
      isActive,
      isCommercial: isCommercial,
      trackedOnly: !isCurrentPageFunds,
    };
    if (isProfit) return baseOptions;
    return {
      ...baseOptions,
      pageNumber: paginationOptions.pageIndex + 1,
      pageSize: paginationOptions.pageSize,
    };
  };

  const handleSelectFunds = (rowIndexes: number[]) => {
    dispatch(myFunds.actions.setSelectedFundsId(rowIndexes.map((index) => funds[index].fundId)));
  };

  const toggleIsStatsOpen = () => {
    setIsStatsOpen((prev) => !prev);
  };

  return (
    <div className={s.profit}>
      {isLoading ? (
        <div className="loaderContainer">
          <Loader />
        </div>
      ) : funds.length ? (
        <>
          <div className={s.profit__box}>
            <div className={s.profit__header} onClick={toggleIsStatsOpen}>
              <div className={s.profit__title}>Итого за выбранный период</div>
              <Icon
                className={classNames(s.profit__icon, {[s.icon_rotaded]: isStatsOpen})}
                name="arrow-fill"
                stroke
                width={12}
                height={12}
              />
            </div>
            {isStatsOpen && <ProfitInformation data={totalsStats} />}
          </div>
          <ProfitContext.Provider
            value={{allDesiredMonths, offset, setOffset, startDate, endDate, updateRef, funds, getTotalsStats}}
          >
            <TableWithExpanding>
              <TableWithPagination
                getData={getFunds}
                totalSize={totalSize}
                initialPaginationState={{pageIndex, pageSize}}
              >
                <TableWithSelection setSelectedItems={handleSelectFunds}>
                  <Table
                    fundsInstance={myFunds}
                    data={funds}
                    columns={columns}
                    className={'profitFunds'}
                    withPagination
                    SubComponent={SubTable}
                    searchId={searchFundId}
                  />
                </TableWithSelection>
              </TableWithPagination>
            </TableWithExpanding>
          </ProfitContext.Provider>
        </>
      ) : (
        <NoteFoundSearch title="Фонды не найдены" message="Попробуйте изменить ваш запрос или настройки профиля" />
      )}
    </div>
  );
};
