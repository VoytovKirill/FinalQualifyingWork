import classNames from 'classnames';
import {FC, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {AccountDTO} from 'api/dto/Account';
import {Search} from 'modules/Roles/Search';
import {getEmployeeById} from 'modules/Roles/Search/utils';
import {Loader} from 'shared/components/Loader';
import {Account, mapAccountDtoToModel} from 'shared/models';
import {usersSelectors} from 'store';
import {rolesSelectors} from 'store/roles/selectors';

import styles from './Assignment.module.scss';
import {getActiveAccounts, getDeletedAccounts} from './utils';

import {DeletedUsersTable} from '../DeletedUsersTable';
import {RolesTable} from '../RolesTable';

export const Assignment: FC = () => {
  const accessToken = useSelector(usersSelectors.getUserToken);
  const checkedEmployeeId = useSelector(rolesSelectors.getCheckedEmployeeId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChanging, setChanging] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [activeAccounts, setActiveAccounts] = useState<Account[]>([]);
  const [deletedAccounts, setDeletedAccounts] = useState<Account[]>([]);

  const changing = () => {
    setChanging(!isChanging);
  };

  const unShiftData = (accounts: Account[], checkedEmployee: AccountDTO) => {
    const mappedEmployee = mapAccountDtoToModel(checkedEmployee);
    accounts.unshift({
      ...mappedEmployee,
      isAdditionalLineOfSearch: true,
    });
  };

  const setUpdatedData = async () => {
    const checkedEmployee = await getEmployeeById(checkedEmployeeId);
    const deletedAccounts = await getDeletedAccounts();
    const activeAccounts = await getActiveAccounts();
    if (checkedEmployee) {
      if (activeAccounts.find((account: Account) => account.id === checkedEmployeeId)) {
        unShiftData(activeAccounts, checkedEmployee);
        setIsActive(true);
      } else {
        unShiftData(deletedAccounts, checkedEmployee);
        setIsActive(false);
      }
    } else {
      setIsActive(true);
    }

    setDeletedAccounts(deletedAccounts);
    setActiveAccounts(activeAccounts);
  };

  const loadingData = async () => {
    setIsLoading(true);
    setUpdatedData();
    setIsLoading(false);
  };

  useEffect(() => {
    loadingData();
  }, []);

  useEffect(() => {
    setUpdatedData();
  }, [accessToken, isChanging, checkedEmployeeId]);

  return (
    <div className={classNames(styles.assignment__item, styles.assignment__item_help)}>
      <h2 className={styles.assignment__title}>Назначение роли </h2>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <>
          <Search />
          {isActive ? (
            <>
              <RolesTable accounts={activeAccounts} setChanging={changing} isActive={isActive} />
              <DeletedUsersTable accounts={deletedAccounts} setChanging={changing} isActive={isActive} />
            </>
          ) : (
            <>
              <DeletedUsersTable accounts={deletedAccounts} setChanging={changing} isActive={isActive} />
              <RolesTable accounts={activeAccounts} setChanging={changing} isActive={isActive} />
            </>
          )}
        </>
      )}
    </div>
  );
};
