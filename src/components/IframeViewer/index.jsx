/**
 * @file contract viewer
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import useLocation from 'react-use/lib/useLocation';
import IFrame from '../IFrame';
import {
  rand16Num,
} from '../../utils/utils';
import './index.less';

const IframeViewer = (props) => {
  const {
    match = {},
    defaultUrl,
  } = props;
  const {
    address = '',
  } = match.params || {};

  const location = useLocation();
  const [url, setUrl] = useState('');

  function onChange(href) {
    window.history.replaceState(
      window.history.state,
      '',
      `${location.origin}${location.pathname}?#${encodeURIComponent(href)}`,
    );
  }

  useEffect(() => {
    const {
      hash,
    } = location;
    if (hash) {
      setUrl(decodeURIComponent(hash).substring(1));
    } else {
      const newUrl = `${defaultUrl}?random=${rand16Num(8)}`;
      setUrl(newUrl);
    }
  }, [
    location.hash,
  ]);

  return (
    <div
      className="explorer-viewer-iframe"
    >
      <IFrame
        url={url}
        onChange={onChange}
      />
    </div>
  );
};

export default IframeViewer;
