import {useLocation, useNavigate} from 'react-router';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {Tabs, TabsStyleAttributes} from 'shared/components/Tabs';

import {fundDetailsTabs} from './constants';
import s from './FundDetails.module.scss';

export const FundDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateAllFunds = () => {
    navigate(location.state.location);
  };

  return (
    <main className="screen">
      <div className={s.pageBack}>
        <div className="box">
          <div className={s.pageBack__box}>
            <Button
              className={s.pageBack__button}
              variants={[ButtonStyleAttributes.colorTransparent, ButtonStyleAttributes.reverse]}
              icon={<Icon className={s.reverse__icon} name="arrow-down" width={18} height={18} stroke={true} />}
              onClick={navigateAllFunds}
            >
              Назад
            </Button>
            <Tabs className={s.tabs} tabsStyle={TabsStyleAttributes.salary} tabs={fundDetailsTabs} />
          </div>
        </div>
      </div>
    </main>
  );
};
