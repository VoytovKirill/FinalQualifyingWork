import {ExpandedState, getExpandedRowModel} from '@tanstack/react-table';
import {cloneElement, FC, isValidElement, ReactElement, useState} from 'react';

interface TableWithExpandingProps {
  children: ReactElement<{options: any}>;
  options?: any;
}

export const TableWithExpanding: FC<TableWithExpandingProps> = ({children, options}) => {
  const [expanded, setExpanded] = useState<ExpandedState>();

  const expandingOptions = {
    state: {
      expanded,
    },
    getRowCanExpand: () => true,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
  };

  if (isValidElement(children)) {
    return cloneElement(children, {
      options: {...options, ...expandingOptions, state: {...options?.state, ...expandingOptions.state}},
    });
  }
  return null;
};
