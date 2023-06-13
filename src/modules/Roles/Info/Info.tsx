import classNames from 'classnames';
import {FC} from 'react';

import styles from './Info.module.scss';

export const Info: FC = () => {
  return (
    <div className={classNames(styles.info__item, styles.info__item_help)}>
      <h2 className={styles.info__title}>Справка по ролям </h2>
      <div className={styles.info__help}>
        <div className={styles.info__help_item}>
          <h6 className={styles.info__help_title}>Аккаунт-менеджер</h6>
          <p className={styles.info__help_text}>Имеет доступ к отчётам и информации о фондах</p>
        </div>
        <div className={styles.info__help_item}>
          <h6 className={styles.info__help_title}>Администратор</h6>
          <p className={styles.info__help_text}>
            Имеет такой же доступ как и аккаунт плюс возможность управлять данными
          </p>
        </div>
      </div>
    </div>
  );
};
