/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-11-04 17:08:34
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-11-04 17:27:17
 * @Description: file content
 */
import { applyMiddleware, createStore } from "redux";
import rootReducer from "../reducers";
import reduxThunk from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(reduxThunk));
export default store;
