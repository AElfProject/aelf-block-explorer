/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-10-20 13:39:34
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 14:36:49
 * @FilePath: /aelf-block-explorer/src/components/AddressLink/index.tsx
 * @Description: link to address
 */
import React from 'react';
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
