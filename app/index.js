import React from 'react';
import { render } from 'react-dom';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { AUTH_USER } from './actions/types';
import reducers from './reducers';


const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');

// If we have a token consider user to be signed in
if (token) {
  store.dispatch({ type: AUTH_USER });
}


// const store = configureStore();
// const history = syncHistoryWithStore(browserHistory, store);

render(
  <AppContainer>
    <Root store={store} history={browserHistory} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NewRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
