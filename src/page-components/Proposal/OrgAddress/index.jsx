/**
 * @file org address
 * @author atom-yang
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import config from 'constants/viewerApi';
import { setCurrentOrg } from 'redux/features/proposal/proposalDetail';
import { proposalModifyAction } from 'redux/features/proposal/proposalModify';
require('./index.less');

const OrgAddress = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orgAddress, proposalType } = props;
  function handleClick() {
    dispatch(
      proposalModifyAction(
        setCurrentOrg({
          orgAddress,
          proposalType,
        }),
      ),
    );
    router.push(`/proposal/apply/${orgAddress}`);
  }
  return (
    <Button
      className="text-ellipsis org-address-btn"
      type="link"
      onClick={handleClick}
      title={`ELF_${orgAddress}_${config.viewer.chainId}`}>
      {`ELF_${orgAddress}_${config.viewer.chainId}`}
    </Button>
  );
};

OrgAddress.propTypes = {
  orgAddress: PropTypes.string.isRequired,
  proposalType: PropTypes.string.isRequired,
};

export default React.memo(OrgAddress);
