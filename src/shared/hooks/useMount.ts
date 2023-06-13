import {useEffect} from 'react';

export function useMount(cb: React.EffectCallback) {
  useEffect(cb, []);
}
