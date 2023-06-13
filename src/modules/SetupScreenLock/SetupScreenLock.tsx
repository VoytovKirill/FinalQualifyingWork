import classNames from 'classnames';
import {FC, useEffect} from 'react';
import {useNavigate} from 'react-router';

import {Cover} from 'shared/components/Cover';
import {Logo} from 'shared/components/Logo';
import {ScreenLockCodesForm, FormStyle} from 'shared/components/ScreenLockCodesForm';
import {routes} from 'shared/constants/routes';
import {profileActions, useRootDispatch, useRootSelector, profileSelectors, profileAsyncActions} from 'store';

import style from './SetupScreenLock.module.scss';

export const SetupScreenLock: FC = () => {
  const isFirstLogin = useRootSelector(profileSelectors.getIsFirstLogin);
  const navigate = useNavigate();
  const dispatch = useRootDispatch();

  const skipSetup = () => {
    dispatch(profileActions.setIsFirstLogin(false));
    navigate(routes.home);
  };

  const setPinCode = async (pin: string) => {
    await dispatch(profileAsyncActions.enableScreenLock(pin));
    navigate(routes.home);
  };

  useEffect(() => {
    if (!isFirstLogin) {
      skipSetup();
    }
  }, []);

  return (
    <main className={classNames('screen', style.wrapper)}>
      <section className={style.setup}>
        <div className={style.setup__container}>
          <Logo />
          <h2 className={style.setup__heading}>Включение автоблокировки </h2>
          <p className={style.setup__textcontent}>
            Для обеспечения дополнительной безопасности вы можете включить автоблокировку экрана. При переходе в спящий
            режим экран приложения будет заблокирован. Чтобы разблокировать экран, потребуется ввести код-пароль.
          </p>
          <ScreenLockCodesForm skipSetup={skipSetup} formStyle={FormStyle.afterAuth} onAccept={setPinCode} />
          <Cover />
        </div>
      </section>
    </main>
  );
};
