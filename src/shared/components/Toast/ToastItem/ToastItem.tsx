import {FC} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';

interface ToastItemProps {
  handleBtn?: () => void;
  description: string;
}

const ToastItem: FC<ToastItemProps> = ({handleBtn, description}) => {
  return (
    <p>
      {description}
      {handleBtn && (
        <Button variants={[ButtonStyleAttributes.colorGreen]} onClick={handleBtn}>
          {' '}
          Отменить{' '}
        </Button>
      )}
    </p>
  );
};

export {ToastItem};
