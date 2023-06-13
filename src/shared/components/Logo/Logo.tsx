import classNames from 'classnames';
import {FC} from 'react';
import {Link} from 'react-router-dom';

import LogoIcon from 'assets/icons/logo.svg';
import {routes} from 'shared/constants/routes';

import s from './Logo.module.scss';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({className}) => {
  return (
    <div className={classNames(s.logo, className)}>
      <Link to={routes.home}>
        <div>
          <img src={LogoIcon} className={classNames(s.logo__image)} alt="" />
        </div>
      </Link>
    </div>
  );
};

export {Logo};
