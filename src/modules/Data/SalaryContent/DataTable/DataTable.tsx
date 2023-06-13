import {getCoreRowModel, useReactTable} from '@tanstack/react-table';
import classNames from 'classnames';
import {FC, useEffect, useState} from 'react';

import {salaryService} from 'api';
import {EmployeeDto} from 'api/dto/SalaryRates';
import {ApiFailedResponseError} from 'api/types/ApiResponseError';
import {TableBody} from 'shared/components/Table/Body';
import {ControlPanel} from 'shared/components/Table/ControlPanel';
import {TableHeader} from 'shared/components/Table/Header';
import s from 'shared/components/Table/Table.module.scss';
import {toasts} from 'shared/constants/toasts';
import {usePaginationOptions} from 'shared/hooks/usePaginationOptions';
import {useToast} from 'shared/hooks/useToast';
import {salaryRatesFiltersSelectors, useRootSelector} from 'store';

import {getColumns} from './columns';

const className = 'partners';

interface DataTableProps {
  date: string;
}

interface SalaryRate {
  employeeId: number;
  employeeFullName: string;
  isMissingSalaryRates: boolean;
  salaryRates: Array<number | null>
  isAdditionalLineOfSearch?: boolean;
}

const ERROR_MESSAGE = 'Не удалось получить ставки партнера';

export const Table: FC<DataTableProps> = ({date}) => {
  const isFired = useRootSelector(salaryRatesFiltersSelectors.getIsFired);
  const year = useRootSelector(salaryRatesFiltersSelectors.getYearFilter);
  const checkedEmployeeId = useRootSelector(salaryRatesFiltersSelectors.getCheckedEmployeeId);
  const search = useRootSelector(salaryRatesFiltersSelectors.getSearch);

  const [salaryRates, setSalaryRates] = useState<SalaryRate[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [fullNameOfFoundItem, setFullNameOfFoundItem] = useState('');
  const {showToast} = useToast();

  const paginationTableOptions = usePaginationOptions({
    initialPaginationState: {
      pageIndex: 0,
      pageSize: 50,
    },
    totalSize,
    getData: getRates,
  });

  const table = useReactTable({
    columns: getColumns(year),
    data: salaryRates,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      year: year,
      updateData: () => {
        updateSalaryRatesAfterChangeRate();
      },
    },

    ...paginationTableOptions,
  });

  useEffect(() => {
    updateSalaryRates();
  }, [year, isFired, checkedEmployeeId]);

  async function updateSalaryRatesAfterChangeRate() {
    await getRates(table.getState().pagination);
  }
  async function updateSalaryRates() {
    if (table.getPageCount()) table.setPageIndex(0);
    await getRates(table.getState().pagination);
  }

  async function getRates(options: {pageIndex: number; pageSize: number}) {
    const checkedEmployeSalaryRates = await getEmployeeSalaryRates();
    let newTotalSize = totalSize;
    try {
      const {data} = await salaryService.getSalaryRates(year, isFired, options.pageIndex, options.pageSize);
      let items = data.items;
      newTotalSize = data.totalSize;
      if (checkedEmployeeId && search) {
        const newSalaryRates: SalaryRate[] = [...items];
        if (checkedEmployeSalaryRates?.employeeFullName)
          setFullNameOfFoundItem(checkedEmployeSalaryRates.employeeFullName);
        if (checkedEmployeSalaryRates)
          newSalaryRates.unshift({
            ...checkedEmployeSalaryRates,
            isAdditionalLineOfSearch: true,
          });
        items = [...newSalaryRates];
        newTotalSize = Number(newTotalSize) + 1;
      } else {
        setFullNameOfFoundItem('');
      }
      setSalaryRates(items);
      setTotalSize(newTotalSize);
    } catch (err) {
      if (err instanceof ApiFailedResponseError) showToast({type: toasts.error, description: err.response?.data.title});
    }
  }

  const getEmployeeSalaryRates = async () => {
    if (checkedEmployeeId) {
      try {
        const {data} = await salaryService.getSalaryRatesByEmployeeId(year, checkedEmployeeId);
        return data;
      } catch (err) {
        showToast({type: toasts.error, description: ERROR_MESSAGE});
        return null;
      }
    }
    return null;
  };

  return (
    <>
      <div className={classNames(s.table, s.table_partners)}>
        <div className={s.table__box}>
          <div className={classNames(s.table__line, s.table__line_header)}>
            <TableHeader table={table} s={s} className={className} />
          </div>
          <TableBody
            table={table}
            disabled={isFired}
            className={className}
            s={s}
            fullnameOfFoundItem={fullNameOfFoundItem}
          />
        </div>
      </div>
      <ControlPanel<EmployeeDto> table={table} />
    </>
  );
};
