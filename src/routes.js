import React from "react";
import { Route } from "react-router-dom";

import HomePage from "./pages/Home";
import BlocksPage from "./pages/Blocks";
import TxsPage from "./pages/Txs";
import ApplicationPage from "./pages/Applications";

export default () => [
  <Route exact path="/" component={HomePage} key="index" />,
  <Route path="/blocks" component={BlocksPage} key="blocks" />,
  <Route path="/txs" component={TxsPage} key="transcations" />,
  <Route path="/apps" component={ApplicationPage} key="apps" />
];
