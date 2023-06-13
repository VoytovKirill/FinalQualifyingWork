import classNames from 'classnames';
import {useEffect, useState} from 'react';

import {applicationService} from 'api';
import {ApiFailedResponseError} from 'api/types/ApiResponseError';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Loader} from 'shared/components/Loader';
import {Logo} from 'shared/components/Logo';
import {Stepper} from 'shared/components/Stepper';
import {StepItem} from 'shared/components/Stepper/StepItem';
import {Toast} from 'shared/components/Toast';
import {toasts} from 'shared/constants/toasts';
import {useToast} from 'shared/hooks/useToast';

import s from './AuthorizationApplication.module.scss';

enum AuthorizationApplicationStatus {
  created = 'created',
  notCreated = 'notCreated',
  empty = 'empty',
}

const AuthorizationApplication = () => {
  const [statusApplication, setStatusApplication] = useState(AuthorizationApplicationStatus.empty);
  const [isLoading, setIsLoading] = useState(true);
  const {showToast} = useToast();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await applicationService.check();
      if (response.data.isRequestCreated) {
        setStatusApplication(AuthorizationApplicationStatus.created);
      } else {
        setStatusApplication(AuthorizationApplicationStatus.notCreated);
      }
      setIsLoading(false);
    } catch (err) {
      if (err instanceof ApiFailedResponseError) {
        showToast({type: toasts.error, description: err.message});
      }
    }
  };

  const sendAuthorizationApplication = async () => {
    try {
      await applicationService.create();
      setStatusApplication(AuthorizationApplicationStatus.created);
    } catch (err) {
      if (err instanceof ApiFailedResponseError) showToast({type: toasts.error, description: err.response?.data.title});
    }
  };

  return (
    <main className="screen">
      <section className={classNames(s.authtorisation, s.authtorisation_step3)}>
        <div className="box">
          <div className={s.authtorisation__box}>
            <div className={s.authtorisation__group}>
              {!isLoading && <Logo className={s.authtorisation__logo} />}

              {isLoading && (
                <div className={s.loaderContainer}>
                  <Loader />
                </div>
              )}

              <h1
                className={classNames(s.title, s.authtorisation__title, {
                  [s.authtorisation__title_bigmargin]: statusApplication === AuthorizationApplicationStatus.created,
                })}
              >
                {statusApplication !== AuthorizationApplicationStatus.created && !isLoading && 'Заявка'}
                {!(statusApplication !== AuthorizationApplicationStatus.created) &&
                  !isLoading &&
                  'Регистрация завершена'}
              </h1>
              <div className={s.text}>
                {statusApplication !== AuthorizationApplicationStatus.created && !isLoading && (
                  <p>Необходимо отправить заявку на получение доступа к системе INO.Fundreport. </p>
                )}

                {statusApplication === AuthorizationApplicationStatus.created && !isLoading && (
                  <p>
                    Заявка успешно подана. Письмо с результатом будет отправлено на почту в течение двух рабочих дней.
                  </p>
                )}
              </div>
              {statusApplication !== AuthorizationApplicationStatus.created && !isLoading && (
                <div className={s.authtorisation__buttons}>
                  <Button
                    onClick={sendAuthorizationApplication}
                    className={s.button}
                    variants={[ButtonStyleAttributes.colorGreen]}
                    type="button"
                    disabled={statusApplication === AuthorizationApplicationStatus.empty}
                  >
                    Отправить заявку
                  </Button>
                </div>
              )}
            </div>
          </div>
          {!isLoading && (
            <Stepper modifierStep="Third">
              <StepItem modifier="Done" text="Введите ваш доменный логин и пароль" stepText="Шаг 1" />
              <StepItem
                modifier="Done"
                text="Это дополнительный уровень безопасности, который гарантирует, что доступ к вашей учётной записи сможете получить только вы, даже если ваш пароль стал известен кому-то ещё"
                stepText="Шаг 2"
              />
              <StepItem
                modifier={statusApplication !== AuthorizationApplicationStatus.created ? 'Active' : 'Done'}
                text="Заявка будет обработана администратором"
                stepText="Шаг 3"
              />
            </Stepper>
          )}
          <Toast />
        </div>
      </section>
    </main>
  );
};

export {AuthorizationApplication};
