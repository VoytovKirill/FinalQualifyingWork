import classNames from 'classnames';
import {useEffect, useState} from 'react';

import {fundService} from 'api/services/fundsService';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';

import {IAboutProject, ITotalCosts} from '../constants';
import {GeneralFundInfo} from '../CostsTable/columns';
import s from '../FundDetails.module.scss';
import {Row} from '../Row';
import {AboutProject, CostsRow, mappingAboutProject, mappingCostsRows, prepareProjectDate} from '../utils';

enum UpdateType {
  budget = 'Бюджет',
  price = 'Стоимость по договору',
}

type Budget = {
  id: number;
  contractPrice: number | null;
  budget: number | null;
  text: string;
};

const ERROR_UPDATE = 'Произошла ошибка при обновлении бюджета или стоимости';

export const CostsCards = (props: GeneralFundInfo) => {
  const {
    startDate,
    endDate,
    contractPrice,
    budget,
    lifetimeTotalCosts,
    lifetimeAdministrativeCosts,
    lifetimeDirectCosts,
    lifetimeWorkTime,
    lifetimeAdditionalCosts,
    budgetDeviation,
    id,
    name,
  } = props;
  const [aboutProject, setAboutProject] = useState<IAboutProject[]>();
  const [totalCost, setTotalCost] = useState<ITotalCosts[]>();
  const {showToast} = useToast();

  useEffect(() => {
    const aboutProjectInfo: AboutProject = {
      startDate: prepareProjectDate(startDate),
      endDate: endDate ? prepareProjectDate(endDate) : '',
      contractPrice,
      budget,
    };
    setAboutProject(mappingAboutProject(aboutProjectInfo));

    const existenceBudgetDeviation = name.includes('(FP)') ? budgetDeviation : -1;
    const costsRow: CostsRow = {
      lifetimeWorkTime,
      lifetimeTotalCosts,
      lifetimeAdditionalCosts,
      lifetimeDirectCosts,
      lifetimeAdministrativeCosts,
      budgetDeviation: existenceBudgetDeviation || 0,
    };
    setTotalCost(mappingCostsRows(costsRow));
  }, [props]);

  const updateBudget = async ({id, contractPrice, budget, text}: Budget) => {
    const params = {
      contractPrice,
      budget,
    };
    try {
      await fundService.updateBudget(id, params);
      showToast({type: toasts.success, description: `${text} успешно обновлен(а)`});
    } catch (e) {
      showToast({type: toasts.error, description: ERROR_UPDATE});
    }
  };

  const onSubmitChanges = (data: number | string, name: string) => {
    if (name === UpdateType.budget) {
      const params = {
        id,
        contractPrice: null,
        budget: Number(data),
        text: UpdateType.budget,
      };
      updateBudget(params);
    }
    if (name === UpdateType.price) {
      const params = {
        id,
        contractPrice: Number(data),
        budget: null,
        text: UpdateType.price,
      };
      updateBudget(params);
    }
  };

  return (
    <div className={s.fundCard}>
      <div className="box">
        <div className={s.fundCard__group}>
          <div className={s.fundCard__item}>
            <h2 className={classNames(s.title, s.fundCard__title)}>О проекте </h2>
            <div className={s.fundCard__details}>
              {aboutProject?.map((row, index) => (
                <Row name={row.name} data={row.data} type={row.type} key={index} onSubmitChanges={onSubmitChanges} />
              ))}
            </div>
          </div>
          <div className={classNames(s.fundCard__item, s.fundCard__item_costs)}>
            <h2 className={classNames(s.title, s.fundCard__title)}>Общие затраты </h2>
            <div className={s.fundCard__details}>
              {totalCost?.map((row, index) => (
                <Row
                  withIcon={true}
                  className={row.className && row.className}
                  name={row.name}
                  data={row.data}
                  type={row.type}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
