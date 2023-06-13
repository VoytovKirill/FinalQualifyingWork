import {ColumnDef} from '@tanstack/react-table';

import {formatCurrentsy} from 'shared/utils/formatCurrentsy';

export const getColumns = (columnsData: Array<string | number>[], headerList: string[]): ColumnDef<any>[] => {
  const mounthHeadersArray = headerList?.map((item, index) => item.split(' ')[0]);

  const columns = columnsData[0]
    ? columnsData[0].map((_: string | number, index: number) => {
      return {
        accessorFn: (row: string[]) => row[index],
        id: String(index),
        header: () => <>{mounthHeadersArray[index]} </>,
        cell: ({getValue}: any) => {
          const value = getValue();
          return <>{typeof value === 'string' ? value : formatCurrentsy(value)}</>;
        },
      };
    })
    : [];

  return columns as any[];
};
