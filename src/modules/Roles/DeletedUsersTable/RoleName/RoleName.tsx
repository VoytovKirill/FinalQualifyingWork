import classNames from 'classnames';

import {Icon} from 'shared/components/Icon';
import iconStyle from 'shared/components/Icon/Icon.module.scss';

import s from './RoleName.module.scss';

export const RoleName = ({info}: any) => {
  return (
    <div className={s.role}>
      {info.getValue()}
      <Icon className={classNames(iconStyle.arrowDown, s.role__icon)} stroke width={28} height={28} name="arrow-down" />
    </div>
  );
};
