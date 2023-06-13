import classNames from 'classnames';
import {ChangeEvent, FC} from 'react';
import {useLocation, useNavigate} from 'react-router';

import {Button} from 'shared/components/Button';
import s from 'shared/components/Funds/Funds.module.scss';
import {Icon} from 'shared/components/Icon';
import {RadioButton} from 'shared/components/RadioButton';
import {routes} from 'shared/constants/routes';

interface HeaderCellProps {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  onClick?: () => void;
  isExpanded?: boolean;
  id?: number;
  header: boolean;
}

export const HeaderCell: FC<HeaderCellProps> = ({checked, onChange, name, onClick, isExpanded, id, header}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateDetailedFund = () => {
    if (header) return;
    navigate(routes.fund, {state: {id, location: location.pathname}});
  };

  return (
    <div className={classNames(s.report__item, s.report__itemName)}>
      <div className={s.report__subitem}>
        <RadioButton handleChange={onChange} isChecked={checked} />
        {onClick && (
          <Button
            className={classNames(s.ctrlButtonIcon, s.report__buttonCollapse)}
            icon={
              <Icon
                fill
                className={classNames(s.ctrlButton__icon, {[s.icon_rotaded]: isExpanded})}
                height={4}
                width={8}
                name="arrow-fill"
              />
            }
            onClick={onClick}
          />
        )}
      </div>
      <div className={s.report__subitem}>
        <div className={s.report__project} onClick={navigateDetailedFund}>
          <span className={classNames(s.report__projectName, s.report__projectName_link)}>{name} </span>
        </div>
      </div>
    </div>
  );
};
