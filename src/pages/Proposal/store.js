/**
 * @file redux store
 * @author atom-yang
 */

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import root from './reducers';

export const store = createStore(
  root,
  {},
  composeWithDevTools(applyMiddleware(reduxThunk)),
);
