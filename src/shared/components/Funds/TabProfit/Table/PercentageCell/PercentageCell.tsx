import {FC, useContext, useState} from 'react';

import {CalculationProfitForm, CalculationProfitFormType} from 'modules/FundDetails/CalculationProfitForm';
import {Button, ButtonStyleAttributes} from 'shared/components/Button';
import {Icon} from 'shared/components/Icon';
import {Modal, ModalStyle} from 'shared/components/Modal';

import s from './PercentageCell.module.scss';

import {ProfitContext} from '../../TabProfit';

interface PercentageCellProps {
  data: number;
  fundId: number;
}

export const PercentageCell: FC<PercentageCellProps> = ({data, fundId}) => {
  const {updateRef, startDate, endDate, getTotalsStats} = useContext(ProfitContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <div>
        <div>{data}%</div>
        <div className={s.wrapper}>
          <Button
            onClick={toggleModalOpen}
            className={s.button}
            variants={[ButtonStyleAttributes.icon]}
            icon={<Icon name="plus" width={16} height={16} fill />}
          />
        </div>
      </div>
      {isModalOpen && (
        <Modal modalStyle={ModalStyle.calculation}>
          <Button
            onClick={toggleModalOpen}
            className={s.close}
            icon={<Icon name="cross" stroke width={12} height={12} />}
          />
          <CalculationProfitForm
            id={fundId}
            type={CalculationProfitFormType.allFundProfit}
            onClose={toggleModalOpen}
            startDate={startDate}
            endDate={endDate}
            updateTable={updateRef.current.update}
            getGeneralInfo={getTotalsStats}
          />
        </Modal>
      )}
    </>
  );
};
