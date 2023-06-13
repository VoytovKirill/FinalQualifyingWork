import {FC} from 'react';

import {Logo} from 'shared/components/Logo';
import {Modal, ModalStyle} from 'shared/components/Modal';

import style from './BlockedScreen.module.scss';
import {CodeForm} from './CodeForm';


export const BlockedScreen: FC = () => {
  return (
    <div className={style.screen}>
      <main className="box">
        <Modal modalStyle={ModalStyle.blockedScreen}>
          <section className={style.setup}>
            <div className={style.setup__container}>
              <Logo className={style.setup__logo} />
              <h2 className={style.setup__heading}>Экран заблокирован</h2>
              <CodeForm />
            </div>
          </section>
        </Modal>
      </main>
    </div>
  );
};
