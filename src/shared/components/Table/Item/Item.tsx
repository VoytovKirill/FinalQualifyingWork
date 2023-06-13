import classNames from 'classnames';
import {FC} from 'react';

import {getEventStyle} from 'shared/utils/events';

import s from './Item.module.scss';

interface TableItemProps {
  eventType?: number;
  text?: string | number;
}

export const TableItem: FC<TableItemProps> = ({eventType, text = ''}) => {
  const eventStyle = typeof eventType === 'number' ? getEventStyle(eventType) : null;
  const className = classNames({
    [s.event]: eventStyle,
    [s[`event_${eventStyle}`]]: eventStyle,
  });
  return (
    <div className={className}>
      <span>{text}</span>
    </div>
  );
};
