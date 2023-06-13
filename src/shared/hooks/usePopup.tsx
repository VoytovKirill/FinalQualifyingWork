import {useCallback, useState} from 'react';

export interface PopupContextType {
  handleOpen: () => void;
  handleClose: () => void;
  openPopup: boolean;
}

export function usePopup(): PopupContextType {
  const [openPopup, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    openPopup,
    handleOpen,
    handleClose,
  };
}
