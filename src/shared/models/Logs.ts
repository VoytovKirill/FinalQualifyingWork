import {LogDTO} from 'api/dto/Logs';
import {getDate, getTime} from 'shared/utils/date';
import {getEventTitle} from 'shared/utils/events';
import {translateRole} from 'shared/utils/role';

export interface Logs {
  source: string;
  date: string;
  time: string;
  role: string;
  event: number;
  eventString: string;
  eventDescription: string;
}

export function mapLogsDtoToModel(logs: LogDTO, eventsType: {type: number; title: string}[]): Logs {
  const {account, createdDateTime, description, event, ...props} = logs;
  const source = account ? `${account.firstName} ${account.lastName}` : 'Система';
  const role = account ? account.role : null;

  return {
    ...props,
    date: getDate(createdDateTime),
    time: getTime(createdDateTime),
    eventString: getEventTitle(eventsType, event),
    event,
    eventDescription: description,
    source,
    role: translateRole(role),
  };
}
