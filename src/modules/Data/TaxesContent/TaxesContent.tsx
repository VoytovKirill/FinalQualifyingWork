import {FC, useEffect, useState} from 'react';

import {ratesService} from 'api';
import {RateInfo, RateType} from 'api/dto/Rate';
import {ApiFailedResponseError} from 'api/types/ApiResponseError';
import {Table} from 'shared/components/Table';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';

import {columns} from './columns';
import s from './TaxesContent.module.scss';
import {Form} from './TaxesForm';

interface TaxesContentProps {
  type: RateType;
}

export const TaxesContent: FC<TaxesContentProps> = ({type}) => {
  const [rateHistory, setRateHistory] = useState<RateInfo[]>([]);
  const {showToast} = useToast();

  useEffect(() => {
    getRateHistory(type);
  }, [type]);
  const getRateHistory = async (type: RateType) => {
    try {
      const {data} = await ratesService.getRateHistory(type);
      setRateHistory(data);
    } catch (err) {
      if (err instanceof ApiFailedResponseError) {
        showToast({type: toasts.error, description: err.response?.data.title});
      }
    }
  };

  return (
    <div className={s.rates}>
      <div className={s.rates__group}>
        <div className={s.rates__item}>
          <h2 className={s.rates__title}>История изменений</h2>
          <Table className="rates" columns={columns} data={rateHistory} />
        </div>
        <Form type={type} getRateHistory={getRateHistory} />
      </div>
    </div>
  );
};
