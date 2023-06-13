import {LisnernerObject} from 'typings/global';

export function setListener<T extends LisnernerObject>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']>
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
  }
}

export function removeListener<T extends LisnernerObject>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']>
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
  }
}
