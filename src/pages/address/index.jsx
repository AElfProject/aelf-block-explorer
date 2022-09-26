/**
 * @file account list
 * @author atom-yang
 */
import React from 'react';
import Bread from 'page-components/Address/Bread';
import HolderList from 'page-components/Address/HolderList';
import withNoSSR from 'utils/withNoSSR';
require('./index.less');

const AccountList = () => (
  <div className="account-list main-container">
    <Bread title="Account List" />
    <HolderList symbol="ELF" />
  </div>
);

export default React.memo(withNoSSR(AccountList));
