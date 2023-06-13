import {useEffect, useCallback} from 'react';

export const useKeydownPress = (cb: React.EffectCallback, keyCode: number) => {
  const handleUserKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.keyCode === keyCode) {
      cb();
    }
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);
};
