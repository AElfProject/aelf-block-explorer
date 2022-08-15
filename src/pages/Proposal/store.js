/**
 * @file redux store
 * @author atom-yang
 */

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";

export const store = createStore(
  {},
  composeWithDevTools(applyMiddleware(reduxThunk))
);
