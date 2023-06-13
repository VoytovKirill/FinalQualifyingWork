import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import {AutoBlockTimer} from 'shared/components/AutoBlockTimer';
import {Notifications} from 'shared/components/Notifications';
import {ResponseInterceptor} from 'shared/components/ResponseInterceptor';
import {Toast} from 'shared/components/Toast';
import store from 'store';

import {AppRoutes} from './AppRoutes';
import {SignalrProvider} from './shared/utils/signalr';

export const App = () => {
  return (
    <Provider store={store}>
      <SignalrProvider>
        <BrowserRouter>
          <ResponseInterceptor />
          <AutoBlockTimer />
          <AppRoutes />
          <Notifications />
          <Toast />
        </BrowserRouter>
      </SignalrProvider>
    </Provider>
  );
};
