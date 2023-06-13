import {cloneElement, FC, isValidElement, ReactElement, useEffect, useState} from 'react';

interface TableWithSelection {
  children: ReactElement<{options: any}>;
  options?: any;
  setSelectedItems?: (rowIndexes: number[]) => void;
}

export const TableWithSelection: FC<TableWithSelection> = ({children, options, setSelectedItems}) => {
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    setSelectedItems && setSelectedItems(Object.keys(rowSelection).map(Number));
  }, [rowSelection]);

  const selectionOptions = {
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  };

  if (isValidElement(children)) {
    return cloneElement(children, {
      options: {...options, ...selectionOptions, state: {...options?.state, ...selectionOptions.state}},
    });
  }
  return null;
};
