/**
 * @file contract viewer
 * @author atom-yang
 */
import React from 'react';
import IframeViewer from '../../components/IframeViewer';

const DEFAULT_URL = '/viewer/address.html#/contract';

const Viewer = (props) => (
  <IframeViewer
    {...props}
    defaultUrl={DEFAULT_URL}
  />
);

export default Viewer;
