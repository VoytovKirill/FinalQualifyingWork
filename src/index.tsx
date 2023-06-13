import {createRoot} from 'react-dom/client';

import {App} from 'App';
import {reportWebVitals} from 'reportWebVitals';

import 'assets/scripts/modernizr/modernizr-custom.js';
import 'assets/styles/general.scss';
import 'assets/styles/_reset.scss';

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
