import {FC} from 'react';

import {Assignment} from './Assignment';
import {Info} from './Info';
import styles from './Roles.module.scss';

export const Roles: FC = () => {
  return (
    <div className={styles.roles}>
      <Assignment />
      <Info />
    </div>
  );
};
