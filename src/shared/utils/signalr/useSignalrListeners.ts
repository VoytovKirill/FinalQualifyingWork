import {HubConnection} from '@microsoft/signalr';
import {useContext, useMemo, useRef} from 'react';

import {SignalrMessages} from 'shared/constants/signalrMessages';
import {authAsyncActions, profileActions, useRootDispatch, notificationsAsyncActions} from 'store';

import {SignalrContext} from './provider';
import {isTokenResponse} from './utiles';

const useSignalrListeners = () => {
  const client = useContext(SignalrContext);
  const listenersRef = useRef<{[key: string]: Array<Function>}>({});
  const dispatch = useRootDispatch();

  const on = (event: string, callback: (...args: unknown[]) => void): void => {
    if (!listenersRef.current[event]) {
      listenersRef.current[event] = [];
    }
    listenersRef.current[event].push(callback);
  };

  const emit = (signalrInstance: HubConnection, event: string, ...args: unknown[]) => {
    if (!listenersRef.current[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    listenersRef.current[event].forEach(function (listener) {
      signalrInstance?.on(event, (...args) => {
        listener(...args);
      });
    });
  };
  // TODO вынести в отдельный компонент логику слушателей
  const setSignalrListeners = (signalrInstance: HubConnection) => {
    listenersRef.current = {};

    on(SignalrMessages.LISTEN_SCREEN_LOCK, (data) => {
      if (isTokenResponse(data)) dispatch(authAsyncActions.screenLock(data));
    });
    on(SignalrMessages.LISTEN_SCREEN_UNLOCK, (data) => {
      dispatch(authAsyncActions.unLock(data as {accessToken: string; attemptsLeft?: number | null | undefined}));
    });
    on(SignalrMessages.SCREEN_LOCK_NOTIFICATION, (data) => {
      dispatch(profileActions.setIsScreenLockEnabled(Boolean(data)));
    });
    on(SignalrMessages.RECEIVE_USER_REQUEST_NOTIFICATION, (data) => {
      dispatch(notificationsAsyncActions.loadNotifications());
    });

    emit(signalrInstance, SignalrMessages.LISTEN_SCREEN_LOCK);
    emit(signalrInstance, SignalrMessages.LISTEN_SCREEN_UNLOCK);
    emit(signalrInstance, SignalrMessages.SCREEN_LOCK_NOTIFICATION);
    emit(signalrInstance, SignalrMessages.RECEIVE_USER_REQUEST_NOTIFICATION);
  };

  return useMemo(() => ({setSignalrListeners, on}), [client]);
};
export default useSignalrListeners;
