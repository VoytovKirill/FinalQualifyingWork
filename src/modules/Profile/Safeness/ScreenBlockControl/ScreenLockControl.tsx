import classNames from 'classnames';
import {FC, useState} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {ScreenLockCodesForm, FormStyle} from 'shared/components/ScreenLockCodesForm';
import {Switch, SwitchStyleAttributes} from 'shared/components/Switch';
import {useRootDispatch, useRootSelector, profileSelectors, profileAsyncActions} from 'store';

import s from '../Safeness.module.scss';

export const ScreenLockControl: FC = () => {
  const isScreenLockEnabled = useRootSelector(profileSelectors.getIsScreenLockEnabled);
  const dispatch = useRootDispatch();
  const [isSwitched, setSwitched] = useState<boolean>(isScreenLockEnabled);
  const [isShowChangeBtn, setIsShowChangeBtn] = useState<boolean>(isScreenLockEnabled);
  const [isShowCodesForm, setIsShowCodesForm] = useState<boolean>(false);

  const handleSwitch = () => {
    if (isSwitched) {
      dispatch(profileAsyncActions.disableScreenLock());
      setIsShowCodesForm(false);
      setIsShowChangeBtn(false);
    } else {
      setIsShowCodesForm(true);
    }
    setSwitched(!isSwitched);
  };

  return (
    <>
      <Switch
        leftText="Автоблокировка экрана"
        initialState={isScreenLockEnabled}
        styleSwitch={SwitchStyleAttributes.profile}
        className={s.safeness__switch}
        onChange={handleSwitch}
      />
      <p className={classNames(s.safeness__paragraf, s.safeness__paragraf_autoBlock)}>
        При переходе в спящий режим экран приложения будет заблокирован. Чтобы разблокировать экран, потребуется ввести
        код-пароль.
      </p>
      {isShowChangeBtn && (
        <Button
          variants={[ButtonStyleAttributes.colorGreen]}
          onClick={() => {
            setIsShowChangeBtn(false);
            setIsShowCodesForm(true);
          }}
        >
          Изменить код-пароль
        </Button>
      )}

      {isShowCodesForm && (
        <ScreenLockCodesForm
          formStyle={FormStyle.profile}
          onAccept={() => {
            setIsShowChangeBtn(true);
            setIsShowCodesForm(false);
          }}
        />
      )}
    </>
  );
};
