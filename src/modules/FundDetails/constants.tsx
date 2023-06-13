import classNames from 'classnames';

import {StatisticsDataModels} from 'shared/components/Funds/monthData';

import s from './FundDetails.module.scss';
import {RowType} from './Row';

export interface IAboutProject {
  name: string;
  data: string | number;
  type: RowType;
}

export interface ITotalCosts extends IAboutProject {
  className?: string;
}

export const aboutProjectRows: IAboutProject[] = [
  {name: 'Дата начала', data: '', type: RowType.text},
  {name: 'Дата окончания', data: '', type: RowType.text},
  {name: 'Стоимость по договору', data: 0, type: RowType.edit},
  {name: 'Бюджет', data: 0, type: RowType.edit},
];

export const totalCostsRows = [
  {
    name: 'Затрачено часов',
    data: 0,
    type: RowType.text,
  },
  {
    className: s.fundCard__detailsLine_expenses,
    name: 'Всего затрат',
    data: 0,
    type: RowType.color,
  },
  {
    className: s.fundCard__detailsLine_expenses,
    name: 'Доп. расходы',
    data: 0,
    type: RowType.color,
  },
  {
    className: classNames(s.fundCard__detailsLine_expenses, s.fundCard__detailsLine_success),
    name: 'Прямые затраты',
    data: 0,
    type: RowType.color,
  },
  {
    className: classNames(s.fundCard__detailsLine_expenses, s.fundCard__detailsLine_ap),
    name: 'АР',
    data: 0,
    type: RowType.color,
  },
  {
    className: s.fundCard__detailsLine_warning,
    name: 'Отклонение от бюджета',
    data: 0,
    type: RowType.color,
  },
];

export const mockData: StatisticsDataModels = {
  dateFrom: new Date(),
  dateTo: new Date(),
  monthWorkTime: '-',
  expenses: '-',
};

import {ProfitTab} from './ProfitTab';
import {CostsTab} from './СostsTab';

export const fundDetailsTabs = [
  {
    name: 'Затраты',
    content: <CostsTab />,
    pathRoute: '',
  },
  {
    name: 'Прибыль',
    content: <ProfitTab />,
    pathRoute: 'profit',
  },
];
