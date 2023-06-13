import classNames from 'classnames';
import {FC, useRef, useState} from 'react';

import {FileFormat} from 'api/dto/Reports';
import {fundService} from 'api/services/fundsService';
import {reportsService} from 'api/services/reportsService';
import {ErrorInformation} from 'modules/Data/SalaryContent/Import/ErrorInformation';
import {RequestStatus} from 'shared/constants/requestsStatus';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {DATE_API_FORMAT, prepareDate} from 'shared/utils/prepareDate/prepareDate';
import {SearchListItem} from 'typings/global';

import {Button} from '../../Button';
import {Icon} from '../../Icon';
import {Modal} from '../../Modal';
import s from '../Funds.module.scss';
import {getUtf8FileName, mappingTrackedFundsInfo, saveFile} from '../utils/utils';

export enum TrackType {
  'track',
  'untrack',
}

interface ActionsProps {
  trackType: TrackType;
  selectedFunds: number[];
  startDate: Date | null;
  endDate: Date | null;
  clearSelectedFunds: () => void;
  updateFundsList: () => void;
  shortFundsList: SearchListItem[];
}

export const Actions: FC<ActionsProps> = ({
  trackType,
  selectedFunds,
  endDate,
  startDate,
  clearSelectedFunds,
  shortFundsList,
  updateFundsList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalTitle = useRef<string>('');
  const modalContent = useRef<string[]>([]);
  const {showToast} = useToast();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const manageFundsTracking = async () => {
    if (trackType === TrackType.track) {
      await trackFunds();
    } else {
      await untrackFunds();
      await updateFundsList();
    }
    clearSelectedFunds();
    if (modalContent.current.length) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const trackFunds = async () => {
    try {
      const response = await fundService.trackFund(selectedFunds);
      const trackedFunds = Object.keys(response.data.errors);

      modalTitle.current = 'Уже отслеживается';
      modalContent.current = mappingTrackedFundsInfo(trackedFunds, shortFundsList);
    } catch (err: any) {
      if (err.response.status === RequestStatus.BAD_REQUEST) {
        showToast({type: toasts.error, description: err.message});
      }
    }
  };

  const untrackFunds = async () => {
    try {
      await fundService.untrackFund(selectedFunds);
      modalContent.current = [];
    } catch (err: any) {
      if (err.response.status === RequestStatus.BAD_REQUEST) {
        showToast({type: toasts.error, description: err.message});
      }
    }
  };

  const onExportClick = async () => {
    if (!selectedFunds.length) {
      modalTitle.current = 'Ни один фонд не был выбран. Пожалуйста, укажите фонд(ы)';
      modalContent.current = [];
      setIsModalOpen(true);
      return;
    }

    await exportFunds();
    clearSelectedFunds();
  };

  const exportFunds = async () => {
    const from = prepareDate(startDate, DATE_API_FORMAT);
    const to = prepareDate(endDate, DATE_API_FORMAT);

    if (!(from && to)) return;

    const response = await reportsService.getFundsReport({from, to}, selectedFunds, FileFormat.OpenXml);

    saveFile(
      new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      getUtf8FileName(response.headers['content-disposition']),
    );
  };

  return (
    <div className={s.wrapper1}>
      <Button
        className={classNames(s.ctrlButtonColorGreen, s.ctrlButtonReverse, s.filter__button)}
        type={'button'}
        icon={
          <Icon
            fill
            className={s.ctrlButton__icon}
            height={12}
            width={12}
            name={trackType === TrackType.track ? 'plus' : 'minus'}
          />
        }
        onClick={manageFundsTracking}
      >
        Отслеживать
      </Button>
      <Button
        className={classNames(s.ctrlButtonColorLightGreen, s.ctrlButtonReverse, s.filter__button)}
        type={'button'}
        icon={<Icon stroke className={s.ctrlButton__icon} height={17} width={17} name="export" />}
        onClick={onExportClick}
      >
        Экспортировать
      </Button>
      {isModalOpen && (
        <Modal>
          <ErrorInformation onClose={closeModal} title={modalTitle.current} data={modalContent.current} />
        </Modal>
      )}
    </div>
  );
};
