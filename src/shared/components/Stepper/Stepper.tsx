import classNames from 'classnames';
import {FC, ReactNode} from 'react';

import styles from './Stepper.module.scss';

interface StepperProps {
  modifierStep?: string;
  children: ReactNode;
}

export const Stepper: FC<StepperProps> = ({modifierStep = 'First', children}) => {
  return (
    <div className={classNames(styles.steps, styles[`steps${modifierStep}`])}>
      <div className={styles.steps__box}>
        {children}
        <div className={styles.steps__decor}>
          <div className={styles.stepsDecorItem}></div>
          <div className={styles.stepsDecorItem}></div>
          <div className={styles.stepsDecorItem}></div>
        </div>
      </div>
    </div>
  );
};
