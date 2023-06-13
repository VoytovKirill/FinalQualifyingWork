import classNames from 'classnames';
import {FC} from 'react';
import {useLocation} from 'react-router-dom';

import {FileFormat} from 'api/dto/Reports';
import {reportsService} from 'api/services/reportsService';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {getUtf8FileName, saveFile} from 'shared/components/Funds/utils/utils';
import {Icon} from 'shared/components/Icon';
import {useToast} from 'shared/hooks/useToast';
import {convertDefaultDate} from 'shared/utils/prepareDate/convertDefaultDate';
import {detailInfoSelectors, useRootSelector} from 'store';

import s from '../FundDetails.module.scss';

export const TabHeading: FC<{title?: string}> = ({title}) => {
  const startDate = useRootSelector(detailInfoSelectors.getStartDate);
  const endDate = useRootSelector(detailInfoSelectors.getEndDate);
  const isActive = useRootSelector(detailInfoSelectors.getIsActive);
  const isCommercial = useRootSelector(detailInfoSelectors.getIsCommercial);
  const isHourly = useRootSelector(detailInfoSelectors.getIsHourly);
  const location = useLocation();
  const fundId = location.state.id;
  const {showToast} = useToast();

  const exportDetailsInfo = async () => {
    try {
      const backConvertedDate = convertDefaultDate(endDate, 1);
      const response = await reportsService.getReportByFundId(
        {
          from: startDate,
          to: backConvertedDate!,
        },
        fundId,
        FileFormat.OpenXml,
      );
      saveFile(
        new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        getUtf8FileName(response.headers['content-disposition']),
      );
    } catch (e) {
      showToast({type: 'error', description: 'Произошла ошибка во время скачивания файла'});
    }
  };

  return (
    <>
      <div className={s.pageHeading}>
        <div className="box">
          <div className={s.pageHeading__group}>
            <div className={s.pageHeading__group}>
              <h2 className={classNames(s.title, s.pageHeading__title)}>{title} </h2>
              <div className={s.pageHeading__tags}>
                {isActive && <span className={s.pageHeading__tags_item}>Активный</span>}
                {!isActive && <span className={s.pageHeading__tags_item}>Архивный</span>}
                {isCommercial && <span className={s.pageHeading__tags_item}>Коммерческий</span>}
                {!isCommercial && <span className={s.pageHeading__tags_item}>Внутренний</span>}
                {isHourly && <span className={s.pageHeading__tags_item}>Почасовой</span>}
                {!isHourly && <span className={s.pageHeading__tags_item}>Фиксированный</span>}
              </div>
            </div>
            <Button
              className={s.pageHeading__button}
              variants={[ButtonStyleAttributes.colorLightGreen, ButtonStyleAttributes.reverse]}
              icon={<Icon name="export" stroke width={17} height={17} />}
              onClick={exportDetailsInfo}
            >
              Экспортировать
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
