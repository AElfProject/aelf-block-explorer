import React from "react";
import { Route } from "react-router-dom";

import HomePage from "./pages/Home/Home";
import BlocksPage from "./pages/Blocks/Blocks";
import BlockDetailPage from "./pages/BlockDetail";
import AddressPage from "./pages/Address";
import TxsPage from "./pages/Txs/Txs";
import TxsDetailPage from "./pages/TxsDetail";
import ApplicationPage from "./pages/Applications";

export default () => [
  <Route exact path="/" component={HomePage} key="index" />,
  <Route path="/blocks" exact component={BlocksPage} key="blocks" />,
  <Route path="/block/:id" component={BlockDetailPage} key="blockdetail" />,
  // <Route path="/address" exact component={AddressPage} key="address" />,
  <Route path="/address/:id" component={AddressPage} key="address" />,
  <Route path="/txs" exact component={TxsPage} key="transcations" />,
  <Route path="/txs/block" component={TxsPage} key="txsblock" />,
  <Route path="/tx/:id" component={TxsDetailPage} key="txsdetail" />,
  <Route path="/apps" component={ApplicationPage} key="apps" />
];
