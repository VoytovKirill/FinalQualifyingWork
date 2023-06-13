import {Table} from '@tanstack/react-table';
import classNames from 'classnames';
import {useState, FC, ChangeEvent} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';

interface Styles {
  readonly [key: string]: string;
}

type Props = {
  style: Styles;
  table: Table<any>;
};

export const PagesStepper: FC<Props> = ({style, table}) => {
  const [targetPage, setTargetPage] = useState<null | number>(null);
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const page = e.target.value ? Number(e.target.value) - 1 : null;
    setTargetPage(page);
  };
  const handleBtn = () => {
    if (targetPage !== null && table.getPageOptions().includes(targetPage)) {
      table.setPageIndex(targetPage);
    }
  };

  return (
    <div className={style.panel__stepper}>
      <span className={style.panel__text}> Перейти на страницу </span>
      <input type="text" pattern="^[ 0-9]+$" onChange={handleInput} className={style.panel__input} />

      <Button
        className={classNames(style.panel__btn, style.panel__btn_stepper)}
        onClick={handleBtn}
        variants={[ButtonStyleAttributes.colorLightGreen]}
        disabled={targetPage === null}
      >
        Перейти
      </Button>
    </div>
  );
};
