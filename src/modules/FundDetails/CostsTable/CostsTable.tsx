import {getCoreRowModel, useReactTable, ColumnDef, flexRender} from '@tanstack/react-table';
import classNames from 'classnames';
import {FC, Fragment, useEffect, useState} from 'react';

import {Cell} from 'shared/components/Table/';
import {TableHeader} from 'shared/components/Table/Header';
import s from 'shared/components/Table/Table.module.scss';
import {Roles} from 'shared/constants/roles';
import {detailInfoSelectors, useRootSelector, usersSelectors} from 'store';

import {FundInfo, getColumns, ColumnsType} from './columns';

interface TableProps {
  allMonths: string[];
  offset: number;
  data?: [];
  setOffset: (offset: number) => void;
}

enum RowType {
  common = 'common',
  persone = 'persone',
  additional = 'additional',
}

const className = 'fund';

export const CostsTable: FC<TableProps> = ({allMonths, offset, setOffset}) => {
  const tableData = useRootSelector(detailInfoSelectors.getTableData);
  const [columnType, setColumnType] = useState<ColumnDef<FundInfo>[]>(getColumns(ColumnsType.oneMonth));
  const [filteredData, setFilteredData] = useState<FundInfo[]>(tableData);
  const userRole = useRootSelector(usersSelectors.getRole);
  useEffect(() => {
    switch (allMonths.length) {
      case 1:
        setColumnType(getColumns(ColumnsType.oneMonth));
        break;
      case 2:
        setColumnType(getColumns(ColumnsType.twoMonths));
        break;
      case 3:
        setColumnType(getColumns(ColumnsType.threeMonths));
        break;
      default:
        setColumnType(getColumns(ColumnsType.fourMonths));
        break;
    }

    setOffset(0);
  }, [allMonths]);

  useEffect(() => {
    const filterByOffset = (arr: any[]) => {
      return arr.filter((item, index) => index >= offset && index < offset + 4);
    };

    const filteredDataType = tableData.filter((item) => {
      if (userRole === Roles.manager) return item.type !== RowType.persone;
      return item;
    });

    const filteredDataUpdated = filteredDataType.map((item) => {
      return {...item, statisticsDataModels: filterByOffset(item.statisticsDataModels)};
    });

    setFilteredData(filteredDataUpdated);
  }, [offset]);

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  const table = useReactTable({
    columns: columnType,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
  });

  const {rows} = table.getRowModel();

  return (
    <div className={classNames(s.table, s.table_fund)}>
      <div className={s.table__box}>
        <div className={classNames(s.table__line, s.table__line_header)}>
          <TableHeader table={table} s={s} className={className} />
        </div>
        {table.getRowModel().rows.map((row: any, index) => (
          <div
            key={row.id}
            className={classNames(s.table__line, {[s['table__line-warning']]: row.original.isMissingSalaryRate})}
          >
            <Fragment key={row.id}>
              <div key={row.id} className={classNames(s.table__line)}>
                <div key={row.id} className={classNames(s.table__group)}>
                  {row.getVisibleCells().map((cell: Cell) => (
                    <div
                      className={classNames(s.table__item, s[`table__item_${className}`], s.table__lineWarning)}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              </div>
              {row.original.type === RowType.common && rows[index + 1]?.original.type === RowType.persone && (
                <div className={s.table__line_separator}>Партнёры</div>
              )}
              {row.original.type !== RowType.additional && rows[index + 1]?.original.type === RowType.additional && (
                <div className={s.table__line_separator}>Дополнительные расходы</div>
              )}
            </Fragment>
          </div>
        ))}
      </div>
    </div>
  );
};
