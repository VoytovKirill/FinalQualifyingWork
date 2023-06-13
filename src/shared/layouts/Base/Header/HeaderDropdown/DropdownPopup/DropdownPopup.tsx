import classNames from 'classnames';
import {FC} from 'react';
import {useNavigate} from 'react-router-dom';

import {Icon} from 'shared/components/Icon';
import {RequestStatus} from 'shared/constants/requestsStatus';
import {routes} from 'shared/constants/routes';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';
import {authAsyncActions, authSelectors, useRootDispatch, useRootSelector} from 'store';

import s from './DropdownPopup.module.scss';

interface DropPopupProps {
  closePopup: () => void;
}

export const DropdownPopup: FC<DropPopupProps> = ({closePopup}) => {
  const isLoading = useRootSelector(authSelectors.getLoadingAuth);
  const dispatch = useRootDispatch();
  const navigate = useNavigate();
  const {showToast} = useToast();

  const logout = async () => {
    dispatch(authAsyncActions.logout())
      .then(() => {
        closePopup();
        navigate(routes.auth);
      })
      .catch((err) => {
        if (err.response.status === RequestStatus.BAD_REQUEST)
          showToast({type: toasts.error, description: err.message});
      });
  };

  const openSettingProfile = () => {
    navigate(routes.profile);
    closePopup();
  };

  return (
    <div className={classNames(s.popup)}>
      <div className={s.popup__box}>
        <button className={classNames(s.popup__item, s.popup__button)} onClick={openSettingProfile}>
          Настройки профиля
        </button>
        <button className={classNames(s.popup__item, s.popup__button)} onClick={logout} disabled={isLoading}>
          <Icon className={s.popup__icon} name="exit" width={17} height={15} stroke />
          Выход
        </button>
      </div>
    </div>
  );
};
('');
