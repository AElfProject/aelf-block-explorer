/**
 * @file App container
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import {
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import useLocation from 'react-use/lib/useLocation';
import ContractInfo from './containers/ContractInfo';
import ContractList from './containers/ContractList';
import AccountList from './containers/AccountList';
import AccountInfo from './containers/AccountInfo';
import TokenList from './containers/TokenList';
import TokenInfo from './containers/TokenInfo';
import {
  sendMessage,
  getContractNames,
} from '../../common/utils';
import {
  Contracts,
} from './common/context';

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
      <Switch>
        <Route exact path="/address">
          <AccountList />
        </Route>
        <Route path="/address/:address?/:symbol?">
          <AccountInfo />
        </Route>
        <Route exact path="/contract">
          <ContractList />
        </Route>
        <Route path="/contract/:address?/:codeHash?">
          <ContractInfo />
        </Route>
        <Route exact path="/token">
          <TokenList />
        </Route>
        <Route path="/token/:symbol">
          <TokenInfo />
        </Route>
        <Redirect to="/address" />
      </Switch>
    </Contracts.Provider>
  );
};

export default App;
