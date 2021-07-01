import React, { FC } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import MainLayout from './components/MainLayout'
import store from './redux/store'

import './App.css';

/* TODO: Do I need a history object for BrowserRouter? Internet suggests yes */
const App: FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <MainLayout />
      </Switch>
    </BrowserRouter>
  </Provider>
);

export default App;
