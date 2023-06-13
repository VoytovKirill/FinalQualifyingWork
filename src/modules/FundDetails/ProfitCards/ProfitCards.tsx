import classNames from 'classnames';

import {formatCurrentsy} from 'shared/utils/formatCurrentsy';

import {CalculationProfitForm, CalculationProfitFormType} from '../CalculationProfitForm';
import s from '../FundDetails.module.scss';
import {Row, RowType} from '../Row';
import {GeneralIncomeInfoType} from '../utils';

type Props = GeneralIncomeInfoType & {getGeneralInfo: any; triggerTable: any};

export const ProfitCards = (props: Props) => {
  const {
    income,
    directCosts,
    administrativeCosts,
    profit,
    profitPercentage,
    getGeneralInfo,
    triggerTable,
    additionalCosts,
  } = props;

  const totalProfitRows = {
    revenue: {
      className: s.fundCard__detailsLine_coast,
      text: 'Выручка',
      value: income ? `${formatCurrentsy(income)} ₽` : '-',
      type: RowType.text,
    },
    directCosts: {
      className: s.fundCard__detailsLine_coast,
      text: 'ПЗ',
      value: directCosts ? `${formatCurrentsy(directCosts)} ₽` : '-',
      type: RowType.color,
    },
    administrativeCosts: {
      className: classNames(s.fundCard__detailsLine_coast),
      text: '+АЗ',
      value: administrativeCosts ? `${formatCurrentsy(administrativeCosts)} ₽` : '-',
      type: RowType.color,
    },
    additionalCosts: {
      className: s.fundCard__detailsLine_coast,
      text: 'Доп. расходы',
      value: additionalCosts ? `${formatCurrentsy(additionalCosts)} ₽` : '-',
      type: RowType.text,
    },
    profit: {
      className: classNames(s.fundCard__detailsLine_profit, s.fundCard__detailsLine_success),
      text: 'Прибыль',
      value: profit ? `${formatCurrentsy(profit)} ₽` : '-',
      type: RowType.color,
    },
    percentageProfit: {
      className: classNames(s.fundCard__detailsLine_profit, s.fundCard__detailsLine_success),
      text: 'Прибыль (%)',
      value: profitPercentage ? `${formatCurrentsy(profitPercentage)}` : '-',
      type: RowType.color,
    },
  };

  return (
    <div className={s.fundCard}>
      <div className="box">
        <div className={classNames(s.fundCard__group)}>
          <div className={classNames(s.fundCard__item)}>
            <CalculationProfitForm
              getGeneralInfo={getGeneralInfo}
              type={CalculationProfitFormType.detailedFund}
              updateTable={triggerTable}
            />
          </div>
          <div className={classNames(s.fundCard__item, s.fundCard__item_costs)}>
            <h2 className={classNames(s.title, s.fundCard__title)}>Общая прибыль </h2>
            <div className={classNames(s.fundCard__details, s.fundCard__details_profit)}>
              {Object.keys(totalProfitRows).map((key, index) => {
                const row = totalProfitRows[key as keyof typeof totalProfitRows];
                return (
                  <Row
                    className={row.className}
                    name={row.text}
                    data={row.value}
                    type={row.type}
                    key={index}
                    withIcon={false}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
