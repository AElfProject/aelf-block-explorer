/**
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import config from 'constants/viewerApi';
import { getContractNames } from 'utils/utils';
const AddressLink = (props) => {
  const { address, suffix } = props;
  const [contracts, setContracts] = useState({});
  useEffect(() => {
    getContractNames()
      .then((res) => setContracts(res))
      .catch((err) => console.error(err));
  }, []);
  return (
    <Link
      href={`/${contracts[address] ? 'contract' : 'address'}/${address}`}
      title={`ELF_${address}_${config.viewer.chainId}`}>
      <a>
        {`ELF_${address}_${config.viewer.chainId}`}
        {suffix}
      </a>
    </Link>
  );
};

AddressLink.propTypes = {
  address: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  suffix: PropTypes.any,
};

AddressLink.defaultProps = {
  suffix: null,
};

export default AddressLink;
