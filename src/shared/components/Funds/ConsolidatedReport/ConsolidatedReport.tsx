import classNames from 'classnames';

import {Button} from 'shared/components/Button';
import s from 'shared/components/Funds/Funds.module.scss';
import {Icon} from 'shared/components/Icon';

export const ConsolidatedReport = () => {
  return (
    <Button
      className={classNames(s.ctrlButtonColorPale, s.ctrlButtonReverse, s.pageHeading__button)}
      type={'button'}
      icon={<Icon stroke name="doc" height={17} width={17} className={s.ctrlButton__icon} />}
    >
      Сводный отчёт
    </Button>
  );
};
