import classNames from 'classnames';

import {Funds} from 'shared/components/Funds';

export const TrackedFunds = () => {
  return (
    <main>
      <div className={classNames('box')}>
        <Funds title="Отслеживаемые" pageName="tracked" />
      </div>
    </main>
  );
};
