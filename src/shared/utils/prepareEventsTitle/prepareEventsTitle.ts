import {SourceType, event} from 'api/services/logsService';

export const prepareFilterTitle = (events: Array<event | SourceType>, eventsFilterTitle: string) => {
  const eventType = events.filter((event) => event.title === eventsFilterTitle);
  if (!eventType.length) {
    return null;
  } else {
    return eventType[0].type;
  }
};
