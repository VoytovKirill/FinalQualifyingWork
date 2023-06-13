import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {FondDto, AdditionalStatsDto} from 'api/dto/Fund';
import {fundService} from 'api/services/fundsService';
import {ApiFailedResponseError} from 'api/types/ApiResponseError';
import {Button} from 'shared/components/Button';
import {AdditionalExpenses} from 'shared/components/Funds/AdditionalExpenses';
import {EmployeeItem} from 'shared/components/Funds/EmployeeItem';
import s from 'shared/components/Funds/Funds.module.scss';
import {ParseMonths} from 'shared/components/Funds/ParseMonths';
import {TotalExpenses} from 'shared/components/Funds/TotalExpenses';
import {Warning} from 'shared/components/Funds/Warning';
import {Icon} from 'shared/components/Icon';
import {RadioButton} from 'shared/components/RadioButton';
import {Roles} from 'shared/constants/roles';
import {routes} from 'shared/constants/routes';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {convertDefaultDate} from 'shared/utils/prepareDate/convertDefaultDate';
import {useRootSelector, usersSelectors} from 'store';

import {prepareFundEmployee, prepareAdditionalExpenses} from '../utils/utils';

interface TableLineItemProps {
  fund: FondDto;
  warning?: boolean;
  offset: number;
  startDate: string | null;
  endDate: string | null;
  toggleFundId: (id: number) => void;
  isDetailed: boolean;
  selectedFunds: number[];
  allMonths: string[];
  pageName: string;
  searchFundId: number | null;
}

export const TableLineItem = (props: TableLineItemProps) => {
  const {fund, offset, startDate, endDate, toggleFundId, selectedFunds, isDetailed, allMonths, searchFundId} = props;
  const {name, totalStats, monthStats, id, budgetDifference, missingSalaryRates} = fund;
  const [isChecked, setIsChecked] = useState(false);
  const [activeFond, setActiveFond] = useState(false);
  const [additionalStats, setAdditionalStats] = useState<AdditionalStatsDto>();
  const navigate = useNavigate();
  const userRole = useRootSelector(usersSelectors.getRole);
  const {showToast} = useToast();
  const location = useLocation();

  const addRemoveActiveClass = () => {
    setActiveFond((prevState) => !prevState);
  };

  const getStats = async () => {
    const backConvertedDate = convertDefaultDate(endDate, 1);
    try {
      const response =
        userRole !== Roles.manager
          ? await fundService.getFullAdditionalStats(id, startDate, backConvertedDate)
          : await fundService.getAdditionalStats(id, startDate, backConvertedDate);
      setAdditionalStats(response.data);
    } catch (err) {
      if (err instanceof ApiFailedResponseError) showToast({type: toasts.error, description: err.response?.data.title});
    }
  };

  const navigateDetailedFund = () => {
    navigate(routes.fund, {state: {id, location: location.pathname}});
  };

  const onChangeToggleFunds = () => {
    toggleFundId(id);
    setIsChecked((prevState) => !prevState);
  };

  useEffect(() => {
    if (activeFond) getStats();
  }, [activeFond, endDate]);

  useEffect(() => {
    if (selectedFunds.find((id) => id === fund.id)) setIsChecked(true);
    else setIsChecked(false);
  }, [selectedFunds]);

  return (
    <div className={classNames(s.report__line, activeFond ? s.isActive : null)}>
      <div className={classNames(s.report__group, {[s.report__groupSearch]: fund.id === searchFundId})}>
        <div
          className={classNames(s.report__item, s.report__itemName, missingSalaryRates ? s.report__itemWarning : null)}
        >
          <div className={s.report__subitem}>
            <RadioButton handleChange={onChangeToggleFunds} isChecked={isChecked} name="toggleFundId" />
            <Button
              className={classNames(s.ctrlButtonIcon, s.report__buttonCollapse)}
              icon={<Icon fill className={s.ctrlButton__icon} height={4} width={8} name="arrow-fill" />}
              onClick={addRemoveActiveClass}
            />
          </div>
          <div className={s.report__subitem}>
            <div className={s.report__project} onClick={navigateDetailedFund}>
              <span className={classNames(s.report__projectName, s.report__projectName_link)}>{name} </span>
              {isDetailed && (
                <>
                  <span className={classNames(s.report__projectText, s.report__projectTextExpenses)}>
                    Прямые затраты
                  </span>
                  <span className={classNames(s.report__projectText, s.report__projectTextAp)}>АР</span>
                </>
              )}
            </div>
            {missingSalaryRates ? <Warning /> : null}
          </div>
        </div>
        <ParseMonths months={monthStats} offset={offset} isDetailed={isDetailed} />
        <TotalExpenses
          costs={{
            budgetDifference,
            ...totalStats,
          }}
          isDetailed={isDetailed}
        ></TotalExpenses>
      </div>
      {activeFond && (
        <div className={s.report__collapse}>
          {additionalStats?.employeeStats &&
            prepareFundEmployee(additionalStats.employeeStats, allMonths.length).map((user, index) => (
              <EmployeeItem key={user.fullName + index} offset={offset} user={user} />
            ))}
          {additionalStats?.additionalCosts && (
            <AdditionalExpenses
              costs={prepareAdditionalExpenses(additionalStats.additionalCosts, allMonths.length)}
              totalCosts={additionalStats?.totalAdditionalCosts}
              offset={offset}
            />
          )}
        </div>
      )}
    </div>
  );
};
