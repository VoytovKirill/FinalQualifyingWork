import classNames from 'classnames';
import {MutableRefObject, FC, useEffect, useState} from 'react';

import {FondDto} from 'api/dto/Fund';
import {Loader} from 'shared/components/Loader';
import {NoteFoundSearch} from 'shared/components/NoteFoundSearch';
import {paginationSize} from 'shared/constants/pagination';
import {RequestStatus} from 'shared/constants/requestsStatus';
import {toasts} from 'shared/constants/toasts';
import {useAfterFirstRender} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';
import {convertDefaultDate} from 'shared/utils/prepareDate/convertDefaultDate';
import {useRootDispatch, useRootSelector} from 'store';
import {fundsInstances} from 'store/utils/fundSliceCreator';

import s from '../Funds.module.scss';
import {MonthHeader} from '../MonthHeader';
import {PaginationPanel} from '../PaginationPanel';
import {TableLineHeader} from '../TableLineHeader';
import {TableLineItem} from '../TableLineItem';
import {prepareAllFunds, reorderFunds} from '../utils/utils';

// eslint-disable-next-line
import {fundService, GetFundsParams} from 'api/services/fundsService';

export enum MonthClassNames {
  oneMonth = 'reportOneMonth',
  twoMonth = 'reportTwoMonth',
  threeMonth = 'reportThreeMonth',
  fourMonth = 'reportFourMonth',
}

const numberMonth = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
};

interface TabCostsProps {
  pageName: 'fonds' | 'tracked';
  isDetailed: boolean;
  startDate: string | null;
  endDate: string | null;
  isCurrentPageFunds: boolean;
  offset: number;
  setOffset: (offset: number) => void;
  allDesiredMonths: string[];
  updateRef: MutableRefObject<any>;
}

export const TabCosts: FC<TabCostsProps> = ({
  pageName,
  isDetailed,
  startDate,
  endDate,
  setOffset,
  offset,
  allDesiredMonths,
  isCurrentPageFunds,
  updateRef,
}) => {
  const myFunds = fundsInstances[pageName];
  const selectedFundsId = useRootSelector(myFunds.getSelectedFundsId);
  const searchFundId = useRootSelector(myFunds.getSearchId);
  const isActive = useRootSelector(myFunds.getIsActive);
  const isCommercial = useRootSelector(myFunds.getIsCommercial);
  const paginationNumber = useRootSelector(myFunds.getPageNumber);
  const [funds, setFunds] = useState<FondDto[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [monthClassName, setMonthClassName] = useState(MonthClassNames.oneMonth);
  const [isAllFundsSelected, setIsAllFundsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isAfterFirstRender = useAfterFirstRender();

  const dispatch = useRootDispatch();
  const {showToast} = useToast();

  useEffect(() => {
    updateRef.current = {update: () => getFunds()};
  }, []);

  useEffect(() => {
    if (!funds.length) return;
    if (selectedFundsId.length === funds.length) {
      setIsAllFundsSelected(true);
    } else {
      setIsAllFundsSelected(false);
    }
  }, [selectedFundsId]);

  useEffect(() => {
    switch (allDesiredMonths.length) {
      case numberMonth.one:
        setMonthClassName(MonthClassNames.oneMonth);
        break;
      case numberMonth.two:
        setMonthClassName(MonthClassNames.twoMonth);
        break;
      case numberMonth.three:
        setMonthClassName(MonthClassNames.threeMonth);
        break;
      case numberMonth.four:
        setMonthClassName(MonthClassNames.fourMonth);
        break;
      default:
        setMonthClassName(MonthClassNames.fourMonth);
    }
  }, [allDesiredMonths]);

  useEffect(() => {
    getFunds();
  }, [allDesiredMonths, isDetailed, searchFundId]);

  useEffect(() => {
    if (!isAfterFirstRender) return;
    if (paginationNumber) dispatch(myFunds.actions.setPageNumber(0));
    else getFunds();
  }, [isCommercial, isActive]);

  useEffect(() => {
    if (!isAfterFirstRender) return;
    getFunds();
  }, [paginationNumber]);

  const getFunds = async () => {
    if (!(startDate && endDate)) return;
    const backConvertedDate = convertDefaultDate(endDate, 1)!;
    const option = {
      from: new Date(startDate).toISOString(),
      to: new Date(backConvertedDate).toISOString(),
      pageNumber: paginationNumber + 1,
      pageSize: paginationSize,
      isActive,
      isCommercial,
      trackedOnly: !isCurrentPageFunds,
      includeDetailedCosts: isDetailed,
    };
    loadFunds(option);
  };

  const loadFunds = async (option: GetFundsParams) => {
    const searchFund = await loadFundById();
    try {
      const {data} = await fundService.getFunds(option);
      if (searchFund) reorderFunds(searchFund, data, setTotalSize);
      else setTotalSize(data.totalSize);
      setIsLoading(false);
      setFunds(prepareAllFunds(data.items, allDesiredMonths.length));
    } catch (err: any) {
      if (err.response.status === RequestStatus.BAD_REQUEST) {
        showToast({type: toasts.error, description: err.message});
        return null;
      }
    }
  };

  const loadFundById = async () => {
    if (!(startDate && endDate)) return;
    if (searchFundId) {
      try {
        const backConvertedDate = convertDefaultDate(endDate, 1)!;
        const response = await fundService.getFundById(
          searchFundId,
          new Date(startDate).toISOString(),
          new Date(backConvertedDate).toISOString(),
          isDetailed,
        );
        return response.data;
      } catch (err: any) {
        return null;
      }
    }
    return null;
  };

  const changePaginationNumber = (tableIndex: number) => {
    dispatch(myFunds.actions.setPageNumber(tableIndex));
    dispatch(myFunds.actions.setSelectedFundsId([]));
  };

  const toggleAllFundsSelected = () => {
    if (!funds) return;
    if (!isAllFundsSelected) {
      const fundsId = funds.map((fund: FondDto) => fund.id);
      dispatch(myFunds.actions.setSelectedFundsId(fundsId));
    } else {
      dispatch(myFunds.actions.setSelectedFundsId([]));
    }
    setIsAllFundsSelected((prevState) => !prevState);
  };

  const toggleFundSelected = (id: number) => {
    const filteredId = selectedFundsId.filter((itemId: number) => itemId !== id);
    if (filteredId.length < selectedFundsId.length) {
      dispatch(myFunds.actions.setSelectedFundsId(filteredId));
    } else {
      dispatch(myFunds.actions.setSelectedFundsId([...selectedFundsId, id]));
    }
  };

  return isLoading ? (
    <div className="loaderContainer">
      <Loader />
    </div>
  ) : funds.length ? (
    <div className={classNames(s.report, s[monthClassName], {[s.reportDetail]: isDetailed})}>
      <div className="box">
        <MonthHeader allMonths={allDesiredMonths} offset={offset} setOffset={setOffset} maxCountOfShownColumns={4} />
        <div className={s.scroll}>
          <TableLineHeader
            months={allDesiredMonths}
            toggleAllSelected={toggleAllFundsSelected}
            isAllSelected={isAllFundsSelected}
          />
          {funds.map((fund) => (
            <TableLineItem
              allMonths={allDesiredMonths}
              isDetailed={isDetailed}
              key={fund.id}
              fund={fund}
              offset={offset}
              startDate={startDate}
              endDate={endDate}
              toggleFundId={toggleFundSelected}
              selectedFunds={selectedFundsId}
              pageName={pageName}
              searchFundId={searchFundId}
            />
          ))}
        </div>
        <PaginationPanel
          currentPage={paginationNumber}
          changePaginationNumber={changePaginationNumber}
          totalSize={totalSize}
        />
      </div>
    </div>
  ) : (
    <NoteFoundSearch title="Фонды не найдены" message="Попробуйте изменить ваш запрос или настройки профиля" />
  );
};
