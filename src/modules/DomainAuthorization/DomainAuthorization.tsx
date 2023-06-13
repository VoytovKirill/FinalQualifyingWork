import classNames from 'classnames';

import logo from 'assets/icons/logoIno.svg';
import {DomainAuthForm} from 'modules/DomainAuthorization/DomainAuthForm';
import {Cover} from 'shared/components/Cover';

import styles from './DomainAuthorization.module.scss';

export const DomainAuthorization = () => {
  return (
    <main className="screen">
      <section className={classNames(styles.authtorisation, styles.authtorisationStep1)}>
        <div className={styles.box}>
          <div className={styles.authtorisation__box}>
            <div className={styles.authtorisation__group}>
              <div className={classNames(styles.logo, styles.authtorisation__logo)}>
                <a className={styles.logo__link} href="#">
                  <div className={styles.logo__image}>
                    <img className={styles.imageBox__image} src={logo} alt="" />
                  </div>
                </a>
              </div>
              <h1 className={classNames(styles.title, styles.authtorisation__title)}>Доменная авторизация </h1>
              <DomainAuthForm />
            </div>
          </div>
          <Cover />
        </div>
      </section>
    </main>
  );
};
