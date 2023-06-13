import {FC} from 'react';

import {Button, ButtonStyleAttributes} from 'shared/components/Button';

interface ToastItemProps {
  handleBtn?: () => void;
  description: string | string[];
  multiline?: boolean;
}

const ToastItem: FC<ToastItemProps> = ({handleBtn, description, multiline}) => {
  const item =
    typeof description == 'object' && multiline
      ? description.map((item, index) => <div key={index}>{item}</div>)
      : description;
  return (
    <p>
      {item}
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
