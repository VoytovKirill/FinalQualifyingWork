import {FC} from 'react';
import {ToastContainer} from 'react-toastify';

import styles from './Toast.module.scss';

const Toast: FC = () => {
  return (
    <ToastContainer
      position="bottom-right"
      closeButton={false}
      autoClose={10000}
      className={styles.toastContainer}
      toastClassName={styles.toast}
      bodyClassName={styles.toast__body}
      progressClassName={styles.toast__progress}
    />
  );
};

export {Toast};
