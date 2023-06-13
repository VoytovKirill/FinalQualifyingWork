import * as signalR from '@microsoft/signalr';
import {useContext, useMemo} from 'react';

import {env} from 'shared/constants/env';

import {SignalrContext} from './provider';

// ориентируемся на время жизни access токена - 10 минут
const retryTimes = [0, 2000, 10000, 30000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000];

const useSignalr = () => {
  const client = useContext(SignalrContext);

  const init = async (newToken: string) => {
    if (!client) {
      if (!env.HUB_URL) throw new Error('Not defined hub url');
      else {
        return new signalR.HubConnectionBuilder()
          .withUrl(env.HUB_URL, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => newToken,
          })
          .withAutomaticReconnect(retryTimes)
          .build();
      }
    } else {
      return client;
    }
  };

  const start = async () => {
    await client?.start();
  };

  const stop = async () => {
    try {
      client?.stop();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const invoke = async (message: string, ...args: any) => {
    try {
      await client?.invoke(message, ...args);
    } catch (err) {
      await client?.start();
      await client?.invoke(message, ...args);
    }
  };

  return useMemo(() => {
    return {
      init,
      start,
      stop,
      invoke,
    };
  }, [client]);
};

export default useSignalr;
