import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import store from '../store';
import App from './App';

function Root() {
  return (
        <HashRouter>
            <Provider store = {store}>
                <App />
            </Provider>
        </HashRouter>
  );
}

export default Root;
