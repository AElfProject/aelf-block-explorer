/**
 * @file contract viewer
 * @author atom-yang
 */
import React, { useEffect, useState, useRef } from 'react';
import useLocation from 'react-use/lib/useLocation';
import IFrame from '../../components/IFrame';
import { rand16Num } from '../../utils/utils';

const DEFAULT_URL = '/viewer/address.html#/address';

const Address = (props) => {
  const {
    match,
  } = props;
  const location = useLocation();
  const {
    id: address = '',
  } = match.params;
  const ll = useRef(location);
  ll.current = location;
  const [url, setUrl] = useState(`${DEFAULT_URL}${address ? `/${address}` : ''}`);
  function onChange(href) {
    window.history.replaceState(
      window.history.state,
      '',
      `${ll.current.origin}${ll.current.pathname}?#${encodeURIComponent(href)}`,
    );
  }

  useEffect(() => {
    const {
      hash,
    } = location;
    if (hash) {
      setUrl(decodeURIComponent(hash).substring(1));
    } else {
      setUrl(`${DEFAULT_URL}${address ? `/${address}` : ''}?random=${rand16Num(8)}`);
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

export default Address;
