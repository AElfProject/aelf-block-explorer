/**
 * @author atom-yang
 */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import config from "../../common/config";
import { getContractNames } from "../../utils";
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
      to={`/${contracts[address] ? "contract" : "address"}/${address}`}
      title={`ELF_${address}_${config.viewer.chainId}`}
    >
      {`ELF_${address}_${config.viewer.chainId}`}
      {suffix}
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
