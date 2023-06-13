import {useRef} from 'react';
import {toast} from 'react-toastify';

import ErrorIcon from 'assets/icons/error.svg';
import SuccessIcon from 'assets/icons/success.svg';
import {ToastItem} from 'shared/components/Toast';
import {toasts} from 'shared/constants/toasts';

interface showToastProps {
  type: 'success' | 'undo' | 'error' | 'multiline';
  description: string | string[];
  multiline?: boolean;
  handleBtn?: () => void;
  onExpiration?: () => void;
}

const useToast = () => {
  const tostRef = useRef<any>(null);
  const showToast = ({type, description, handleBtn, multiline = false, onExpiration}: showToastProps) => {
    let isCancelled = false;

    const handleCancelToast = () => {
      isCancelled = true;
      handleBtn && handleBtn();
      toast.dismiss();
    };

    const handleToastTimeout = (isCancelled: boolean) => {
      if (!isCancelled) {
        onExpiration && onExpiration();
      }
    };

    switch (type) {
      case toasts.success:
        tostRef.current = toast(<ToastItem description={description} />, {
          theme: 'colored',
          icon: <img src={SuccessIcon} />,
          hideProgressBar: true,
        });
        break;
      case toasts.error:
        return (tostRef.current = toast.error(<ToastItem description={description} />, {
          theme: 'colored',
          icon: <img src={ErrorIcon} />,
          hideProgressBar: true,
        }));
        break;
      case toasts.undo:
        tostRef.current = toast(<ToastItem handleBtn={handleCancelToast} description={description} />, {
          theme: 'colored',
          icon: <img src={SuccessIcon} />,
          closeOnClick: true,
          onClose: () => handleToastTimeout(isCancelled),
        });
        break;
      case toasts.multiline:
        tostRef.current = toast(<ToastItem description={description} multiline={multiline} />, {
          theme: 'colored',
          style: {height: 'auto'},
          icon: <img src={SuccessIcon} />,
          hideProgressBar: true,
        });
        break;
    }
  };
  const dismiss = () => toast.dismiss();
  return {
    showToast,
    dismiss,
  };
};

export {useToast};
