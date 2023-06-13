import * as signalR from '@microsoft/signalr';
import {createContext, ReactElement, useEffect, useState} from 'react';

import {useRootSelector, usersSelectors} from 'store';

import useSignalr from './useSignalr';
import useSignalrListeners from './useSignalrListeners';

type Props = {
  children: ReactElement;
};
const DISCONNECTED_STATUS = 'Disconnected';
export const SignalrContext = createContext<signalR.HubConnection | null>(null);

const SignalrProvider = ({children}: Props) => {
  const signalr = useSignalr();
  const signalrListenerService = useSignalrListeners();
  const [signalrInstance, setSignalrInstance] = useState<signalR.HubConnection | null>(null);
  const role = useRootSelector(usersSelectors.getRole);
  const isAuthorizedUser = useRootSelector(usersSelectors.getIsAuthorizedUser);
  const newToken = useRootSelector(usersSelectors.getUserToken);

  const establishСonnection = async () => {
    const instance = await signalr.init(newToken);
    if (instance) {
      await signalrListenerService.setSignalrListeners(instance);
      await instance?.start();
      setSignalrInstance(instance);
    }
  };

  const disconnectUnauthorizedUser = async () => {
    if (signalrInstance && !isAuthorizedUser) {
      (async () => {
        await signalrInstance.stop();
        setSignalrInstance(null);
      })();
    }
  };

  useEffect(() => {
    if (signalrInstance && signalrInstance.state === DISCONNECTED_STATUS && isAuthorizedUser) {
      establishСonnection();
    }
    return () => {
      disconnectUnauthorizedUser();
    };
  }, [newToken]);

  useEffect(() => {
    (async () => {
      if (isAuthorizedUser && !signalrInstance) {
        await establishСonnection();
      }
    })();
    return () => {
      disconnectUnauthorizedUser();
    };
  }, [role]);

  return <SignalrContext.Provider value={signalrInstance}>{children}</SignalrContext.Provider>;
};

export default SignalrProvider;
