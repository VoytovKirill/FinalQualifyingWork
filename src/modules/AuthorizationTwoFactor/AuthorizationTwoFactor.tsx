import classNames from 'classnames';

import {Logo} from 'shared/components/Logo';
import {Stepper} from 'shared/components/Stepper';
import {StepItem} from 'shared/components/Stepper/StepItem';

import s from './AuthorizationTwoFactor.module.scss';
import {TwoFactorForm} from './TwoFactorForm';

const AuthorizationTwoFactor = () => {
  return (
    <main className="screen">
      <section className={classNames(s.authtorisation, s.authtorisation_step2)}>
        <div className="box">
          <div className={s.authtorisation__box}>
            <div className={s.authtorisation__group}>
              <Logo className={s.authtorisation__logo} />
              <h1 className={classNames(s.title, s.authtorisation__title)}>Двухфакторная аутентификация </h1>
              <ul className={s.authtorisation__list}>
                <li className={s.authtorisation__listItem}>
                  Скачайте приложение <span>Google Authenticator</span>
                </li>
                <li className={s.authtorisation__listItem}>Откройте приложение и выберете Настроить аккаунт</li>
                <li className={s.authtorisation__listItem}>
                  Нажмите <span>Сканировать штрихкод</span>
                </li>
              </ul>
              <TwoFactorForm />
            </div>
            <Stepper modifierStep="Second">
              <StepItem modifier="Done" text="Введите ваш доменный логин и пароль" stepText="Шаг 1" />
              <StepItem
                modifier="Active"
                text="Это дополнительный уровень безопасности, который гарантирует, что доступ к вашей учётной записи сможете получить только вы, даже если ваш пароль стал известен кому-то ещё"
                stepText="Шаг 2"
              />
              <StepItem text="Заявка будет обработана администратором" stepText="Шаг 3" />
            </Stepper>
          </div>
        </div>
      </section>
    </main>
  );
};

export {AuthorizationTwoFactor};
