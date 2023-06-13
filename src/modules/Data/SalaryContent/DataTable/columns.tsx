import {ColumnDef} from '@tanstack/react-table';
import {CellContext} from '@tanstack/table-core';

import {EmployeeDto} from 'api/dto/SalaryRates';

import {DataTableInput} from './DataTableInput';
import {Item} from './DataTableItem';
import {getColumnsData} from './utils';

export const getColumns = (year: number): ColumnDef<EmployeeDto>[] => {
  const columnsData = getColumnsData(year);

  return columnsData.map((column, index) => {
    return {
      accessorFn: (row: EmployeeDto) => (index ? row.salaryRates[index - 1] : row.employeeFullName),
      id: column.id,
      header: () => <Item text={column.name}/>,
      cell: (info: CellContext<EmployeeDto, unknown>) => {
        const {row, getValue, table} = info
        if (column.isAvailableForEdit) {
          return (
            <DataTableInput
              warning={row.original.isMissingSalaryRates && !index}
              mounthName={column.name}
              text={getValue()?.toString()}
              employeeId={row.original.employeeId}
              from={column.from as string}
              employeeFullName={row.original.employeeFullName}
              dataMeta={table.options.meta}
              isMissingSalaryRates={row.original.isMissingSalaryRates}
            />
          );
        } else {
          return <Item warning={row.original.isMissingSalaryRates && !index} text={getValue()?.toString()}/>;
        }
      },
    };
  });
};
