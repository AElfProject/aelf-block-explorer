/**
 * @file context
 * @author atom-yang
 */
import React from 'react';

const globalConfig = {
  isMobile: false,
};

export const GlobalContext = React.createContext(globalConfig);

export const Contracts = React.createContext({});
