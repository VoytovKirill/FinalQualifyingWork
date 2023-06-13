import {ColumnDef} from '@tanstack/react-table';

import {FundProfitDto} from 'api/dto/FundsProfit';
import {convertToFullWide} from 'shared/components/Funds/utils/utils';

import {HeaderCell} from './HeaderCell';
import {PercentageCell} from './PercentageCell';

export const columns: ColumnDef<FundProfitDto>[] = [
  {
    accessorFn: (row) => row.name,
    id: 'name',
    header: ({table}) => (
      <HeaderCell
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        name="Название"
        header
      />
    ),
    cell: ({row, getValue}) => (
      <HeaderCell
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        name={getValue<string>()}
        onClick={row.getCanExpand() ? row.getToggleExpandedHandler() : undefined}
        isExpanded={row.getIsExpanded()}
        id={row.original.fundId}
        header={false}
      />
    ),
  },
  {
    accessorFn: (row) => row.income,
    id: 'income',
    header: () => <div>Выручка</div>,
    cell: ({getValue}) => <div>{convertToFullWide(getValue<number>())}</div>,
  },
  {
    accessorFn: (row) => row.directCosts,
    id: 'directCosts',
    header: () => <div>ПЗ</div>,
    cell: ({getValue}) => <div>{convertToFullWide(getValue<number>())}</div>,
  },
  {
    accessorFn: (row) => row.administrativeCosts,
    id: 'administrativeCosts',
    header: () => <div>+АЗ</div>,
    cell: ({getValue}) => <div>{convertToFullWide(getValue<number>())}</div>,
  },
  {
    accessorFn: (row) => row.profit,
    id: 'profit',
    header: () => <div>Прибыль</div>,
    cell: ({getValue}) => <div>{convertToFullWide(getValue<number>())}</div>,
  },
  {
    accessorFn: (row) => row.profitPercentage,
    id: 'profitPercentage',
    header: () => <div>Прибыль (%)</div>,
    cell: ({getValue, row}) => <PercentageCell data={getValue<number>()} fundId={row.original.fundId} />,
  },
] as ColumnDef<FundProfitDto>[];
