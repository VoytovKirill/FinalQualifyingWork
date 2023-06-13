import {FC, FormEventHandler} from 'react';

import {fundService} from 'api/services/fundsService';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Modal, ModalStyle} from 'shared/components/Modal';
import {KeyCodes} from 'shared/constants/keycodes';
import {useKeydownPress} from 'shared/hooks';
import {useToast} from 'shared/hooks/useToast';
import {detailsInfoActions, useRootDispatch} from 'store';

import s from './DeleteExpensesForm.module.scss';

interface Props {
  name: string;
  close: () => void;
  fundId: number;
}

const SUCCESS_DELETE = 'Удаление доп. расхода произошло успешно';
const ERROR_DELETE = 'Произошла ошибка во время удаления доп. расхода';

export const DeleteExpensesForm: FC<Props> = ({name, close, fundId}) => {
  const {showToast} = useToast();
  const dispatch = useRootDispatch();

  useKeydownPress(close, KeyCodes.close);

  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    try {
      await fundService.deleteAddCostsByName(fundId, name);
      dispatch(detailsInfoActions.setDeleteExpenses(name));
      showToast({type: 'success', description: SUCCESS_DELETE});
      close();
    } catch (e) {
      showToast({type: 'error', description: ERROR_DELETE});
      close();
    }
  };

  return (
    <Modal modalStyle={ModalStyle.delete}>
      <form onSubmit={submit}>
        <div className={s.form__text}>Вы уверены, что хотите удалить строку с дополнительными расходами?</div>
        <div className={s.form__btnBox}>
          <Button className={s.form__btn} variants={[ButtonStyleAttributes.colorGreen]} type="submit">
            Да
          </Button>
          <Button
            className={s.form__btn}
            variants={[ButtonStyleAttributes.colorLightGreen]}
            onClick={close}
            type="button"
          >
            Нет
          </Button>
        </div>
      </form>
    </Modal>
  );
};
