/**
 * @file App container
 * @author atom-yang
 */
import React, { useEffect, lazy, Suspense, useState } from "react";
import { Switch, HashRouter, Redirect, Route } from "react-router-dom";
import useLocation from "react-use/lib/useLocation";
const ContractInfo = lazy(() => import("./containers/ContractInfo"));
const ContractList = lazy(() => import("./containers/ContractList"));
const AccountList = lazy(() => import("./containers/AccountList"));
const AccountInfo = lazy(() => import("./containers/AccountInfo"));
const TokenList = lazy(() => import("./containers/TokenList"));
const TokenInfo = lazy(() => import("./containers/TokenInfo"));
import { sendMessage, getContractNames } from "../../common/utils";
import { Contracts } from "./common/context";

const App = () => {
  const fullPath = useLocation();
  const [contracts, setContracts] = useState({});
  useEffect(() => {
    sendMessage({
      href: fullPath.href,
    });
  }, [fullPath.href]);
  useEffect(() => {
    getContractNames()
      .then((res) => setContracts(res))
      .catch((err) => console.error(err));
  }, []);
  return (
    <Contracts.Provider value={contracts}>
      <HashRouter>
        <Suspense>
          <Switch>
            <Route exact path='/address' element={AccountList} />

            <Route path='/address/:address?/:symbol?' element={AccountInfo} />

            <Route exact path='/contract' element={ContractList} />

            <Route
              path='/contract/:address?/:codeHash?'
              element={ContractInfo}
            />

            <Route exact path='/token' element={TokenList} />

            <Route path='/token/:symbol' element={TokenInfo} />

            <Redirect to='/address' />
          </Switch>
        </Suspense>
      </HashRouter>
    </Contracts.Provider>
  );
};

export default App;
