import {FC} from 'react';
import {useSelector} from 'react-redux';

import {translateRole} from 'shared/utils/role';
import {usersSelectors} from 'store';

import s from './PersonalData.module.scss';

import {PersonalDataForm} from '../PersonalDataForm';

export const PersonalData: FC = () => {
  const role = useSelector(usersSelectors.getRole);
  const roleString = translateRole(role);

  return (
    <div className={s.personalData}>
      <h2>Личные данные</h2>
      <p className={s.personalData__role}>{`Роль ${roleString}`}</p>
      <PersonalDataForm />
    </div>
  );
};
