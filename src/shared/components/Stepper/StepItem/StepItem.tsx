import classNames from 'classnames';
import {FC} from 'react';

import styles from './StepItem.module.scss';

import {Icon} from '../../Icon';

interface StepItemProps {
  text?: string;
  modifier?: string;
  stepText?: string;
}

export const StepItem: FC<StepItemProps> = ({text = '', modifier = '', stepText = ''}) => {
  return (
    <div className={classNames(styles.steps__item, styles[`steps__item${modifier}`])}>
      <div className={styles.steps__title}>
        <span className={styles.steps__icon}>
          {modifier === 'Done' ? <Icon height={20} width={20} stroke name="check" /> : null}
        </span>
        {stepText}
      </div>
      <div className={styles.steps__text}>
        <p>{text}</p>
      </div>
    </div>
  );
};
