/**
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import config from 'constants/viewerApi';
const AddressLink = (props) => {
  const { address, suffix } = props;

  return (
    <>
      <Link href={`/address/${address}`} title={`ELF_${address}_${config.viewer.chainId}`}>
        {`ELF_${address}_${config.viewer.chainId}`}
      </Link>
      {suffix}
    </>
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
