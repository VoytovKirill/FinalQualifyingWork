import {Logo} from 'shared/components/Logo';
import {Navigation} from 'shared/components/Navigation';
import {UserBar} from 'shared/layouts/Base/Header/UserBar';

import s from './Header.module.scss';

const Header = () => {
  return (
    <header className={s.header}>
      <div className={s.header__box}>
        <div className={s.header__container}>
          <div className={s.header__group}>
            <Logo className={s.header__logo} />
            <Navigation className={s.header__nav} />
          </div>
          <UserBar className={s.header__userBar} />
        </div>
      </div>
    </header>
  );
};

export {Header};
