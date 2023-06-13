import {useEffect, useRef} from 'react';

export const useAfterFirstRender = () => {
  const isAfterFirstRender = useRef(false);

  useEffect(() => {
    isAfterFirstRender.current = true;
  }, []);

  return isAfterFirstRender.current;
};
