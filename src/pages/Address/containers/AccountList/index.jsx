/**
 * @file account list
 * @author atom-yang
 */
import React from 'react';
import Bread from '../../components/Bread';
import HolderList from '../../components/HolderList';

const AccountList = () => (
  <div className="account-list main-container">
    <Bread title="Account List" />
    <HolderList symbol="ELF" />
  </div>
);

export default React.memo(AccountList);
