import React from 'react';
import { render } from 'react-dom';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import reducers from './reducers';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(
  applyMiddleware(reduxThunk)
));



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
