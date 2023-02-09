/**
 * @author atom-yang
 */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import addressFormat from "../../utils/addressFormat";

const AddressLink = (props) => {
  const { address: prefixAddress, suffix, hash } = props;
  const address = addressFormat(prefixAddress) + hash ?? "";
  return (
    <>
      <Link to={`/address/${address}`} title={`${address}`}>
        {`${address}`}
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
