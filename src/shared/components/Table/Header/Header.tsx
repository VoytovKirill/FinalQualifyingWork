import {flexRender, Table} from '@tanstack/react-table';
import classNames from 'classnames';
import {FC, Key} from 'react';

type Props = {
  table: Table<any>;
  s: any;
  className: string;
};

export const TableHeader: FC<Props> = ({table, s, className}) => {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup: {id: Key | null | undefined; headers: any[]}) => (
        <div key={headerGroup.id} className={classNames(s.table__group)}>
          {headerGroup.headers.map((header) => (
            <div
              className={classNames(s.table__item, s.table__item_header, s[`table__item_${className}`])}
              key={header.id}
            >
              {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
