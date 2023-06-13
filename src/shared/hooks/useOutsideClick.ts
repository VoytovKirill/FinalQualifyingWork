import {RefObject, useEffect, useRef} from 'react';

import {setListener, removeListener} from 'shared/utils';

const defaultEvents = ['mousedown', 'touchstart'];

export const useOutsideClick = <Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: Event) => void,
  events: string[] = defaultEvents,
) => {
  const savedCallback = useRef(onClickAway);

  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);

  useEffect(() => {
    const handler = (event: any) => {
      const {current: el} = ref;
      el && !el.contains(event.target) && savedCallback.current(event);
    };
    events.forEach((eventName: string) => setListener(document, eventName, handler));

    return () => {
      events.forEach((eventName: string) => removeListener(document, eventName, handler));
    };
  }, [events, ref]);
};
