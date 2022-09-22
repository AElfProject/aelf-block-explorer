/**
 * @author atom-yang
 */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import config from "../../common/config";

const AddressLink = (props) => {
  const { address, suffix } = props;

  return (
    <>
      <Link
        to={`/address/${address}`}
        title={`ELF_${address}_${config.viewer.chainId}`}
      >
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
