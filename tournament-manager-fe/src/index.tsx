import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';

import Main from './containers/main/main';
import { LocalizationProvider } from './assets/localization/localizationProvider';
const styles = require('./style/index.scss');

const store = configureStore();
LocalizationProvider.RegisterProvider('hr');

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('root'),
);
