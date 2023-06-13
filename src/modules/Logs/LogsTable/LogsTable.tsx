import {FC, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {LogDTO} from 'api/dto/Logs';
import {logsService} from 'api/services/logsService';
import {ApiFailedResponseError} from 'api/types/ApiResponseError';
import {Loader} from 'shared/components/Loader';
import {NoteFoundSearch} from 'shared/components/NoteFoundSearch';
import {TableWithPagination} from 'shared/components/TableWithPagination';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {Logs, mapLogsDtoToModel} from 'shared/models/Logs';
import {endDateTimeZone, startDateTimeZone} from 'shared/utils/prepareDate/prepareDate';
import {prepareFilterTitle} from 'shared/utils/prepareEventsTitle/prepareEventsTitle';
import {logsSelectors, useRootSelector} from 'store';
import {usersSelectors} from 'store/user/selectors';

import {columns} from './сolumns';

const paginationParams = {
  pageIndex: 0,
  pageSize: 50,
};

export const LogsTable: FC = () => {
  const [logs, setLogs] = useState<Logs[]>([]);
  const accessToken = useSelector(usersSelectors.getUserToken);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const eventTypes = useRootSelector(logsSelectors.getEvents);
  const sourceTypes = useRootSelector(logsSelectors.getSourceeList);
  const startDate = useRootSelector(logsSelectors.getStartDate);
  const endDate = useRootSelector(logsSelectors.getEndDate);
  const accountId = useRootSelector(logsSelectors.getAccountId);
  const eventsFilterTitle = useRootSelector(logsSelectors.getEventsFilterTitle);
  const sourceFilterTitle = useRootSelector(logsSelectors.getSourceFilterTitle);
  const {showToast} = useToast();

  const initialLogsPage = async () => {
    await getLogs(paginationParams);
  };

  useEffect(() => {
    initialLogsPage();
  }, []);

  const getLogs = async (options: {pageIndex: number; pageSize: number}) => {
    if (eventTypes.length !== 0) {
      try {
        const params = {
          accountId,
          pageNumber: options.pageIndex + 1,
          pageSize: options.pageSize,
          dateFrom: startDateTimeZone(startDate),
          dateTo: endDateTimeZone(endDate),
          eventType: prepareFilterTitle(eventTypes, eventsFilterTitle),
          logSource: prepareFilterTitle(sourceTypes, sourceFilterTitle),
        };

        const {
          data: {items, totalSize},
        } = await logsService.getFilteredLogs(params);
        const _logs = items.map((logsItem: LogDTO) => mapLogsDtoToModel(logsItem, eventTypes));
        setLogs(_logs);
        setTotalSize(totalSize);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof ApiFailedResponseError)
          showToast({type: toasts.error, description: err.response?.data.title});
      }
    }
  };

  useEffect(() => {
    getLogs(paginationParams);
  }, [accessToken, endDate, accountId, eventsFilterTitle, sourceFilterTitle, eventTypes]);
  return (
    <>
      {isLoading && (
        <div className="loaderContainer">
          <Loader />
        </div>
      )}

      {!logs.length && !isLoading && (
        <NoteFoundSearch title="Логи не найдены" message="Попробуйте изменить ваш запрос или настройки фильтров" />
      )}

      {!!logs.length && (
        <TableWithPagination
          className="logs"
          getData={getLogs}
          columns={columns}
          data={logs}
          totalSize={totalSize}
          initialPaginationState={paginationParams}
        />
      )}
    </>
  );
};
