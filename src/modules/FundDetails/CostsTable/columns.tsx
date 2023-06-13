import {ColumnDef} from '@tanstack/react-table';

import {Item} from 'modules/Data/SalaryContent/DataTable';
import {Item as FundItem} from 'modules/FundDetails/Item';
import {StatisticsDataModels} from 'shared/components/Funds/monthData';

export interface GeneralFundInfo {
  id: number;
  startDate: string;
  endDate: string | null;
  name: string;
  contractPrice: number;
  budget: number;
  isActive: boolean;
  status: number;
  totalWorkTime: number;
  expenses: number;
  lifetimeWorkTime: number;
  lifetimeTotalCosts: number;
  lifetimeAdditionalCosts: number;
  lifetimeAdministrativeCosts: number;
  lifetimeDirectCosts: number;
  budgetDeviation: number;
}

export interface FundInfo {
  id?: number;
  type: string;
  expenses: number | string;
  name: string;
  statisticsDataModels: StatisticsDataModels[];
  totalWorkTime: number | string;
  isMissingSalaryRate: boolean;
  isAdditionalCosts?: boolean;
}

export enum ColumnsType {
  oneMonth = 'oneMonth',
  twoMonths = 'twoMonths',
  threeMonths = 'threeMonths',
  fourMonths = 'fourMonths',
}

export const getColumns = (type: ColumnsType) => {
  const columns: ColumnDef<FundInfo>[] = [
    {
      accessorFn: (row) => row.name,
      id: 'name',
      header: () => <Item text="Название" />,
      cell: (info) => {
        return <Item text={info.getValue<string>()} warning={info.row.original.isMissingSalaryRate} />;
      },
    },
    {
      accessorFn: (row) => row.statisticsDataModels[0],
      id: 'firstMonth',
      header: () => <FundItem hours="Часы" expenses="Затраты" />,
      cell: (info) => {
        const {getValue} = info;
        return (
          <FundItem
            hours={getValue<StatisticsDataModels>().monthWorkTime.toLocaleString()}
            expenses={getValue<StatisticsDataModels>().expenses.toLocaleString()}
            statisticsDataModels={getValue<StatisticsDataModels>()}
            name={info.row.original.name}
          />
        );
      },
    },
    {
      accessorFn: (row) => row.statisticsDataModels[1],
      id: 'secondMonth',
      header: () => <FundItem hours="Часы" expenses="Затраты" />,
      cell: (info) => {
        const {getValue} = info;
        return (
          <FundItem
            hours={getValue<StatisticsDataModels>().monthWorkTime.toLocaleString()}
            expenses={getValue<StatisticsDataModels>().expenses.toLocaleString()}
            statisticsDataModels={getValue<StatisticsDataModels>()}
            name={info.row.original.name}
          />
        );
      },
    },
    {
      accessorFn: (row) => row.statisticsDataModels[2],
      id: 'thirdMonth',
      header: () => <FundItem hours="Часы" expenses="Затраты" />,
      cell: (info) => {
        const {getValue} = info;
        return (
          <FundItem
            hours={getValue<StatisticsDataModels>().monthWorkTime.toLocaleString()}
            expenses={getValue<StatisticsDataModels>().expenses.toLocaleString()}
            statisticsDataModels={getValue<StatisticsDataModels>()}
            name={info.row.original.name}
          />
        );
      },
    },
    {
      accessorFn: (row) => row.statisticsDataModels[3],
      id: 'fourthMonth',
      header: () => <FundItem hours="Часы" expenses="Затраты" />,
      cell: (info) => {
        const {getValue} = info;
        return (
          <FundItem
            hours={getValue<StatisticsDataModels>().monthWorkTime.toLocaleString()}
            expenses={getValue<StatisticsDataModels>().expenses.toLocaleString()}
            statisticsDataModels={getValue<StatisticsDataModels>()}
            name={info.row.original.name}
          />
        );
      },
    },
    {
      accessorFn: (row) => row,
      id: 'totalExpenses',
      header: () => <FundItem hours="Часы" expenses="Затраты" />,
      cell: (info) => {
        const {getValue} = info;
        return (
          <FundItem
            hours={getValue<FundInfo>().totalWorkTime.toLocaleString()}
            expenses={getValue<FundInfo>().expenses?.toLocaleString()}
            isAdditionalExpenses={getValue<FundInfo>().isAdditionalCosts}
            name={info.row.original.name}
          />
        );
      },
    },
  ];

  switch (type) {
    case ColumnsType.oneMonth:
      columns.splice(2, 3);
      break;
    case ColumnsType.twoMonths:
      columns.splice(3, 2);
      break;
    case ColumnsType.threeMonths:
      columns.splice(4, 1);
      break;
  }

  return columns;
};
