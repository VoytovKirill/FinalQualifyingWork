import classNames from 'classnames';
import {FC, ReactElement, HTMLProps} from 'react';
import {Navigate, Route, Routes, useLocation} from 'react-router';
import {Link} from 'react-router-dom';

import {usePathname} from 'shared/hooks';

export enum TabsStyleAttributes {
  salary = 'salary',
  profile = 'profile',
  fundsProfit = 'fundsProfit',
}

interface TabsProps extends HTMLProps<HTMLDivElement> {
  tabsStyle?: TabsStyleAttributes;
  tabs: Array<{
    name: string;
    content: ReactElement;
    pathRoute: string;
  }>;
}

import s from './Tabs.module.scss';

export const Tabs: FC<TabsProps> = ({tabs, tabsStyle = '', ...props}) => {
  const activePath = usePathname();
  const activeTab = tabs.filter((tab) => activePath.includes(tab.pathRoute) && tab.pathRoute != '')[0]?.pathRoute || '';
  const location = useLocation();

  return (
    <div {...props} className={classNames(props.className, s.tabs, s[tabsStyle])}>
      <div className={s.tabs__body}>
        <div className={s.tabs__container}>
          {tabs.map((tab, index) => (
            <Link
              to={tab.pathRoute}
              key={index}
              state={location.state}
              className={classNames(s.tabs__tab, {
                [s.tabs__tab_isActive]: tab.pathRoute === activeTab,
              })}
            >
              {tab.name}
            </Link>
          ))}
        </div>
        <Routes>
          {tabs.map((tab, index) => (
            <Route key={index} path={tab.pathRoute} element={tabs[index].content} />
          ))}
          <Route path="*" element={<Navigate to={tabs[0].pathRoute} />} />
        </Routes>
      </div>
    </div>
  );
};
