import classNames from 'classnames';
import {FC} from 'react';

import {Icon} from 'shared/components/Icon';

import styles from '../DomainAuthForm.module.scss';

interface EyeIconProps {
  onToggle: () => void;
}

export const EyeIcon: FC<EyeIconProps> = ({onToggle}) => {
  return (
    <button
      className={classNames(styles.ctrlButton, styles.eyeButton, styles.form__inputButton)}
      type="button"
      onClick={onToggle}
    >
      <span className={styles.ctrlButton__container}>
        <span className={styles.ctrlButton__text}></span>
        <Icon fill stroke className="ctrl-button--icon" name="eye-cross" />
      </span>
    </button>
  );
};
