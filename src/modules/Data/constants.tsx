import {RateType} from 'api/dto/Rate';

import {SalaryContent} from './SalaryContent';
import {TaxesContent} from './TaxesContent';

export const salaryTabs = [
  {
    name: 'Зарплата',
    content: <SalaryContent />,
    pathRoute: '',
  },
  {
    name: 'Cтавка налога',
    content: <TaxesContent type={RateType.tax} />,
    pathRoute: 'rate',
  },
  {
    name: 'Доля ПР',
    content: <TaxesContent type={RateType.productionCosts} />,
    pathRoute: 'pr',
  },
];
