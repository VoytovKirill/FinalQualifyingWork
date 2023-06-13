import classNames from 'classnames';
import dayjs from 'dayjs';
import {FC, useEffect, useState, useRef} from 'react';

import {salaryService} from 'api';
import {ApiFailedResponseError, Errors, ErrorType, Warning} from 'api/types/ApiResponseError';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {Modal} from 'shared/components/Modal';
import {DELAY_BEFORE_SENDING_REQUEST, DELAY_SENDING_REQUEST, INTERVAL_UPDATE_PROGRESS} from 'shared/constants/import';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';

import {ErrorInformation} from './ErrorInformation';
import s from './Import.module.scss';

enum ImportStatus {
  default = 'default',
  inUploadProcess = 'inUploadProcess',
}

interface ImportProps {
  changeLastUpdate: (date: string) => void;
}

interface ErrorResponse {
  errors: Errors;
  type: ErrorType;
}

export const Import: FC<ImportProps> = ({changeLastUpdate}) => {
  const [importStatus, setImportStatus] = useState<ImportStatus>(ImportStatus.default);
  const [lastImportDate, setLastImportDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<Blob>(new Blob());
  const [isError, setIsError] = useState<boolean>(false);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors | null>(null);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const progressTimeoutId = useRef<NodeJS.Timeout | undefined>(undefined);
  const errorTitle = useRef<string>('');
  const errorData = useRef<string[]>([]);

  const {showToast} = useToast();

  useEffect(() => {
    getDateImport();
  }, []);

  useEffect(() => {
    setIsError(false);
    setIsWarning(false);
    setErrors(null);
    setWarnings([]);
    setProgress(0);
    let intervalId: NodeJS.Timer | null = null;
    let timeoutId: NodeJS.Timer | null = null;
    if (importStatus === ImportStatus.inUploadProcess) {
      intervalId = setInterval(() => {
        setProgress((prev) => prev + 10);
      }, INTERVAL_UPDATE_PROGRESS);
      timeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
      }, DELAY_BEFORE_SENDING_REQUEST);
      progressTimeoutId.current = setTimeout(() => {
        sendData(file);
      }, DELAY_SENDING_REQUEST);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      if (progressTimeoutId.current) {
        clearTimeout(progressTimeoutId.current);
        progressTimeoutId.current = undefined;
      }
    };
  }, [importStatus, file]);

  const getDateImport = async () => {
    try {
      const response = await salaryService.getLastImportDate();
      setLastImportDate(dayjs(response.data.date).locale('ru').format('DD MMMM YYYY'));
    } catch (err) {
      if (err instanceof ApiFailedResponseError) showToast({type: toasts.error, description: err?.response?.data.description});
    }
  };

  const sendData = async (value: Blob) => {
    try {
      setLoading(true);
      const response = await salaryService.import(value, setProgress);
      setLastImportDate(dayjs(response.data.date).locale('ru').format('DD MMMM YYYY'));
      changeLastUpdate(new Date().toString());
      if (response.data.errors.length) {
        setIsWarning(true);
        response.data.errors.forEach((item: {description: string, errorValues: string, errorKey: string}) => {
          const {description, errorValues, errorKey} = item
          setWarnings((prev) => [
            ...prev,
            {descriptions: [description], errorValues: [errorValues], errorKey: [errorKey]},
          ]);
        });
      }
    } catch (err) {
      setIsError(true);
      if (err instanceof ApiFailedResponseError) {
        const error: ErrorResponse = err.response?.data;
        const {errors, type} = error;
        setErrors(errors || null);
        switch (type) {
          case ErrorType.General:
            setErrors((prev) => ({...prev, descriptions: ['Неизвестная ошибка']}));
            break;
          case ErrorType.Validation:
            if (errors) setErrors((prev) => ({...prev, descriptions: [...errors.fileName]}));
            break;
        }
        if (err.response?.status === 413) setErrors({descriptions: ['Максимально допустимый размер файла 5 МБ']});
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelSending = () => {
    setProgress(0);
    setImportStatus(ImportStatus.default);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files[0]);
    setImportStatus(ImportStatus.inUploadProcess);
  };

  const onErrorTextClick = (e: React.SyntheticEvent<EventTarget>) => {
    if (!(e.target instanceof HTMLElement)) return;
    const info: string = e.target.dataset.info || '';
    if (info.includes('Cells')) errorTitle.current = 'Адреса ячеек';
    if (info.includes('Employees')) errorTitle.current = 'Ненайденные партнёры';
    if (warnings) {
      const currentWarning = warnings.find((warning: Warning) => warning.errorKey.includes(info));
      if (currentWarning) errorData.current = currentWarning.errorValues;
    }
    if (errors) errorData.current = errors[info];
    if (errorData.current.length) setIsModalOpen(true);
  };

  const closeMenu = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className={s.ratesImport}>
        <div className={s.box}>
          <div className={s.ratesImport__box}>
            <div
              className={classNames(
                {[s.ratesImport__start]: importStatus === ImportStatus.default},
                {[s.ratesImport__upload]: importStatus === ImportStatus.inUploadProcess},
                {[s.ratesImport__uploadFail]: isError || isWarning},
              )}
            >
              {importStatus === ImportStatus.default ? (
                <>
                  <div className={s.ratesImport__content}>
                    <h2 className={classNames(s.title, s.ratesImport__title)}>Ставки сотрудников </h2>
                    <p className={s.ratesImport__text}>Загружены {lastImportDate}</p>
                  </div>
                  <div className={s.inputFile}>
                    <input onChange={onChangeInput} className={s.inputFile__field} accept=".xlsx" type="file" />
                    <Button
                      className={s.inputFile__button}
                      variants={[ButtonStyleAttributes.colorGreen, ButtonStyleAttributes.reverse]}
                      disabled={loading}
                      icon={<Icon name="import" width={17} height={18} stroke />}
                    >
                      Импортировать
                    </Button>
                  </div>
                </>
              ) : (
                <h2 className={classNames(s.title, s.ratesImport__title)}>Ставки сотрудников </h2>
              )}
              {importStatus === ImportStatus.inUploadProcess && (
                <>
                  <div className={s.ratesImport__progress}>
                    <div className={s.ratesImport__progressBar}>
                      <div
                        className={classNames(s.ratesImport__progressFill, {
                          [s.ratesImport__progressFillWarning]: isWarning,
                        })}
                        style={{width: `${progress}%`}}
                      ></div>
                    </div>
                    <p className={s.ratesImport__text}>Идет загрузка данных</p>
                    <div
                      className={classNames(s.ratesImport__text, s.ratesImport__progressError, {
                        [s.ratesImport__progressWarning]: isWarning,
                      })}
                    >
                      <Icon name="attention" width={25} height={25} stroke></Icon>
                      <div>
                        <div className={s.ratesImport__errorContainer}>
                          {warnings?.map((warning: Warning) => {
                            return warning?.descriptions?.map((item: string) => {
                              const warningInfo = item.match(/[^\(]+(?=\))/g) || [];
                              return (
                                <span
                                  key={item}
                                  className={classNames(s.ratesImport__textError, {
                                    [s.ratesImport__textWarning]: isWarning,
                                  })}
                                >
                                  {item.match(/^[^\$]+/)}
                                  <span data-info={warningInfo[warningInfo?.length - 1]} onClick={onErrorTextClick}>
                                    {item.match(/\[([^[\]]+)\]/)?.[1]}
                                  </span>
                                </span>
                              );
                            });
                          })}
                          {errors?.descriptions?.map((item: string) => {
                            const errorInfo = item.match(/[^\(]+(?=\))/g) || [];
                            return (
                              <span key={item} className={s.ratesImport__textError}>
                                {item.match(/^[^\$]+/)}
                                <span data-info={errorInfo[errorInfo?.length - 1]} onClick={onErrorTextClick}>
                                  {item.match(/[^\[]+(?=\])/)}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                        {isError ? <span>Исправьте ошибки в данных и импортируйте измененный файл</span> : null}
                      </div>
                    </div>
                  </div>
                  <div className={classNames(s.ratesImport__uploadAction)}>
                    {isError || isWarning ? (
                      <div className={s.inputFile}>
                        <input onChange={onChangeInput} className={s.inputFile__field} accept=".xlsx" type="file" />
                        <Button
                          disabled={loading}
                          className={s.inputFile__button}
                          variants={[ButtonStyleAttributes.colorGreen, ButtonStyleAttributes.reverse]}
                          icon={<Icon name="import" width={17} height={18} stroke />}
                        >
                          Импортировать
                        </Button>
                      </div>
                    ) : (
                      <Button
                        disabled={progress === 100}
                        onClick={cancelSending}
                        variants={[ButtonStyleAttributes.colorGreen]}
                      >
                        Отменить
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal>
          <ErrorInformation onClose={closeMenu} title={errorTitle.current} data={errorData.current} />
        </Modal>
      )}
    </>
  );
};
