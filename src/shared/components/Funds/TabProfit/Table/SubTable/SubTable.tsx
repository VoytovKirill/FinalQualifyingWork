import classNames from 'classnames';
import {useContext, useEffect, useState} from 'react';

import {profitService} from 'api/services/profitService';
import s from 'shared/components/Funds/Funds.module.scss';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';

import {MonthHeader} from '../../../MonthHeader';
import {ProfitContext} from '../../TabProfit';
import {Row} from '../Row';

const maxCountOfShownColumns = 10;
const ERROR_MESSAGE = 'Произошла ошибка получения данных';

export type ProfitType = (number | null)[];

export const SubTable = ({row}: {row: any}) => {
  const {allDesiredMonths, offset, setOffset, startDate, endDate, funds} = useContext(ProfitContext);
  const [data, setData] = useState({incomes: [] as ProfitType, profits: [] as ProfitType});
  const [isLoading, setIsLoadign] = useState<boolean>(true);
  const {showToast} = useToast();

  useEffect(() => {
    getProfit();
  }, [startDate, endDate, funds]);

  const getProfit = async () => {
    if (!(startDate && endDate)) return;
    try {
      const response = await profitService.getFundProfit(row.fundId, startDate, endDate);
      setData(response.data);
      setIsLoadign(false);
    } catch (err) {
      showToast({type: toasts.error, description: ERROR_MESSAGE});
    }
  };

  return !isLoading ? (
    <div className={s.profit__wrapper}>
      <div className={classNames(s.profit__monthHeader)}>
        <MonthHeader
          allMonths={allDesiredMonths}
          offset={offset}
          setOffset={setOffset}
          showPeriodText={false}
          maxCountOfShownColumns={maxCountOfShownColumns}
        />
      </div>
      <Row offset={offset} maxCountOfShownColumns={maxCountOfShownColumns} name="Выручка" data={data.incomes} />
      <Row offset={offset} maxCountOfShownColumns={maxCountOfShownColumns} name="Прибыль" data={data.profits} />
    </div>
  ) : (
    <></>
  );
};
