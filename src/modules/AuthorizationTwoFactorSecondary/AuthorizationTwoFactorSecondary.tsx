import classNames from 'classnames';
import {useState} from 'react';
import {useNavigate} from 'react-router';

import {TwoFactorSecondaryForm} from 'modules/AuthorizationTwoFactorSecondary/TwoFactorSecondaryForm/TwoFactorSecondaryForm';
import {Cover} from 'shared/components/Cover';
import {Logo} from 'shared/components/Logo';
import {routes} from 'shared/constants/routes';
import {profileSelectors, useRootSelector} from 'store';

import styles from './AuthorizationTwoFactorSecondary.module.scss';

export const AuthorizationTwoFactorSecondary = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean | null>(null);
  const isResponseFromProfile = useRootSelector(profileSelectors.getIsRestoryTfa);
  const navigate = useNavigate();

  const closeMenu = () => {
    if (isResponseFromProfile) navigate(routes.profile);
    setIsModalOpen(false);
  };

  const openMenu = () => {
    setIsModalOpen(true);
  };

  return (
    <main className="screen">
      <section className={classNames(styles.authtorisation, styles.authtorisation_step2)}>
        <div className="box">
          <div className={styles.authtorisation__box}>
            <div className={styles.authtorisation__group}>
              <Logo className={styles.authtorisation__logo} />
              <h1 className={classNames(styles.title, styles.authtorisation__title)}>Двухфакторная аутентификация </h1>
              <span className={styles.lostAccess} onClick={openMenu}>
                Нет доступа к приложению
              </span>
              <TwoFactorSecondaryForm isModalOpen={isModalOpen} closeMenu={closeMenu} />
            </div>
          </div>
          <Cover />
        </div>
      </section>
    </main>
  );
};
