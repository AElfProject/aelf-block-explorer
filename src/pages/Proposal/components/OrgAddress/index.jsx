/**
 * @file org address
 * @author atom-yang
 */
import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import config from "../../../../common/config";
import { setCurrentOrg } from "../../actions/proposalDetail";
import "./index.less";

const OrgAddress = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orgAddress, proposalType } = props;
  function handleClick() {
    dispatch(
      setCurrentOrg({
        orgAddress,
        proposalType,
      })
    );
    navigate(`/apply/${orgAddress}`);
  }
  return (
    <Button
      className='text-ellipsis org-address-btn'
      type='link'
      onClick={handleClick}
      title={`ELF_${orgAddress}_${config.viewer.chainId}`}
    >
      {`ELF_${orgAddress}_${config.viewer.chainId}`}
    </Button>
  );
};

OrgAddress.propTypes = {
  orgAddress: PropTypes.string.isRequired,
  proposalType: PropTypes.string.isRequired,
};

export default React.memo(OrgAddress);
