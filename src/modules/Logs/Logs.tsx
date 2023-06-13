import {FC, useEffect, useState} from 'react';

import {SourceType, event, logsService} from 'api/services/logsService';
import {Search} from 'modules/Logs/Search';
import {getAccountList} from 'modules/Logs/Search/utils';
import {DatePicker} from 'shared/components/DatePicker';
import {DatePickerType} from 'shared/components/DatePicker/DatePicker';
import {Dropdown} from 'shared/components/Dropdown';
import {NoteFoundSearch} from 'shared/components/NoteFoundSearch';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {prepareDate} from 'shared/utils/prepareDate/prepareDate';
import {useRootDispatch, useRootSelector} from 'store';
import {logsActions} from 'store/logs';
import {logsSelectors} from 'store/logs/selectors';

import s from './Logs.module.scss';
import {LogsTable} from './LogsTable';

interface PropsItem {
  text: string;
  index: number;
  closePopup: () => void;
  previousValue: string;
}

export const Logs: FC = () => {
  const eventFilterTitle = useRootSelector(logsSelectors.getEventsFilterTitle);
  const sourceFilterTitle = useRootSelector(logsSelectors.getSourceFilterTitle);
  const [isNotFoundShow, setIsNotFoundShow] = useState(false);
  const startDate = useRootSelector(logsSelectors.getStartDate);
  const endDate = useRootSelector(logsSelectors.getEndDate);
  const [events, setEvents] = useState<event[]>([]);
  const [sources, setSources] = useState<SourceType[]>([]);
  const dispatch = useRootDispatch();
  const [eventFilter, setEventFilter] = useState(eventFilterTitle);
  const [sourceFilter, setSourceFilter] = useState(sourceFilterTitle);
  const startDatePicker = startDate ? new Date(startDate) : null;
  const endDatePicker = endDate ? new Date(endDate) : null;
  const {showToast} = useToast();

  useEffect(() => {
    Promise.all([logsService.getEventList(), getAccountList(), logsService.getSourceList()])
      .then(([{data: res}, employees, sources]) => {
        dispatch(logsActions.setEvents(res));
        setEvents(res);
        dispatch(logsActions.setEmployeeList(employees));
        dispatch(logsActions.setSources(sources));
        setSources(sources);
      })
      .catch((err) => showToast({type: toasts.error, description: err.message}));
  }, []);

  const getEventsFilters = () => {
    const eventsTitle = events.map((event) => event.title);
    return ['Все', ...eventsTitle];
  };
  const getSourcesFilters = () => {
    const sourceTitles = sources.map((source) => source.title);
    return ['Все', ...sourceTitles];
  };

  const setDate = (dates: [Date, Date]): void => {
    const [start, end] = dates;
    dispatch(logsActions.setStartDate(prepareDate(start, 'YYYY-MM-DD')));
    dispatch(logsActions.setEndDate(prepareDate(end, 'YYYY-MM-DD')));
  };

  const renderEventsFilterItem = ({text = '', index, closePopup}: PropsItem) => {
    const handleClick = () => {
      setEventFilter(text);
      dispatch(logsActions.setEventsFilterTitle(text));
      closePopup();
    };
    return (
      <button key={index} onClick={handleClick}>
        {text}
      </button>
    );
  };

  const renderSourceFilterItem = ({text = '', index, closePopup}: PropsItem) => {
    const handleClick = () => {
      setSourceFilter(text);
      dispatch(logsActions.setSourceFilterTitle(text));
      closePopup();
    };
    return (
      <button key={index} onClick={handleClick}>
        {text}
      </button>
    );
  };
  return (
    <>
      <h2 className={s.logs__heading}>События</h2>
      <Search setIsNotFoundShow={setIsNotFoundShow} />
      <div className={s.logs__filters}>
        <div className={s.logs__datePicker}>
          <DatePicker
            type={DatePickerType.range}
            startDate={startDatePicker}
            endDate={endDatePicker}
            setDate={setDate}
            isShowMonth={false}
          />
        </div>
        <Dropdown
          textButton={eventFilter}
          renderItem={renderEventsFilterItem}
          items={getEventsFilters()}
          stylePrefix="events"
        />
        <Dropdown
          textButton={sourceFilter}
          renderItem={renderSourceFilterItem}
          items={getSourcesFilters()}
          stylePrefix="sources"
        />
      </div>
      {!isNotFoundShow && <LogsTable />}
      {isNotFoundShow && (
        <NoteFoundSearch title="Партнёр не найден" message="Попробуйте изменить ваш запрос или настройки профиля" />
      )}
    </>
  );
};
