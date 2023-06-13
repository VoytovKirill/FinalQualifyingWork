import {useState} from 'react';

import {normsService} from 'api';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {Tabs, TabsStyleAttributes} from 'shared/components/Tabs';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';

import {salaryTabs} from './constants';
import s from './Data.module.scss';
import {ApiFailedResponseError} from '../../api/types/ApiResponseError';

const ERROR_MESAGE = 'Возникла ошибка при обновлении норм часов';

export const Data = () => {
  const {showToast} = useToast();
  const [loading, setLoading] = useState(false);

  const synchronizeNorms = async () => {
    try {
      setLoading(true);
      const data = [];
      const {
        data: {descriptionForMonthNorm, descriptionForMonthNormPersonal},
      } = await normsService.synchronization();
      if (descriptionForMonthNorm) data.push(descriptionForMonthNorm);
      if (descriptionForMonthNormPersonal) data.push(...descriptionForMonthNormPersonal);
      if (data.length) {
        showToast({
          type: toasts.multiline,
          multiline: true,
          description: data,
        });
      } else {
        showToast({
          type: toasts.success,
          description: 'Изменения не вносились',
        });
      }
    } catch (err) {
      if (err instanceof ApiFailedResponseError) {
        if (Number(err.status) === 405) {
          showToast({type: toasts.error, description: ERROR_MESAGE});
        }
        showToast({type: toasts.error, description: err.response?.data.detail || ERROR_MESAGE});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="screen">
      <div className="page-heading">
        <div className={s.wrapper}>
          <Button
            disabled={loading}
            onClick={synchronizeNorms}
            className={s.salary__button}
            variants={[ButtonStyleAttributes.colorPale, ButtonStyleAttributes.reverse]}
            icon={<Icon name="update" stroke width={15} height={15} />}
          >
            Обновить норму часов
          </Button>
          <Tabs className={s.profile__tabs} tabsStyle={TabsStyleAttributes.salary} tabs={salaryTabs} />
        </div>
      </div>
    </main>
  );
};
