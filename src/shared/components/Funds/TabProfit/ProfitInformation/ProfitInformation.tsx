import {FC} from 'react';

import {FundsProfitTotals} from 'api/dto/FundsProfit';
import s from 'shared/components/Funds/Funds.module.scss';

import {Line} from './Line';

import {convertToFullWide} from '../../utils/utils';

interface ProfitInformationpProps {
  data: FundsProfitTotals;
}

export const ProfitInformation: FC<ProfitInformationpProps> = ({data}) => {
  return (
    <div className={s.profit__body}>
      <div className={s.profit__group}>
        <Line name="Прибыль" data={`${convertToFullWide(data.profit)} ₽`} />
        <Line name="Прибыль (%)" data={data.profitPercentage} />
      </div>
      <div className={s.profit__group}>
        <Line name="Выручка" data={`${convertToFullWide(data.income)} ₽`} />
        <Line name="ПЗ" data={`${convertToFullWide(data.directCosts)} ₽`} />
        <Line name="АЗ" data={`${convertToFullWide(data.administrativeCosts)} ₽`} />
      </div>
    </div>
  );
};
