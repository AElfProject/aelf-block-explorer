import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "mobx-react";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";

import "./index.less";

import App from "./App";

// @TODO: compose mst store to make app running.
render(
  <LocaleProvider locale={zh_CN}>
    <Provider store={}>
    <Router>
      <App />
    </Router>
    </Provider>
  </LocaleProvider>,
  document.querySelector("#app")
);
