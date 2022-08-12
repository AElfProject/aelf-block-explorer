/**
 * @file header
 * @author atom-yang
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  If,
  Then,
} from 'react-if';
import {
  Tag,
  Divider,
  Tooltip,
} from 'antd';
import {
  LinkIcon,
} from '../../common/Icon';
import './index.less';
import AddressLink from '../AddressLink';

const Header = (props) => {
  const {
    author,
    isSystemContract,
    contractName,
  } = props;
  return (
    <div className="contract-viewer-header">
      <If condition={contractName && +contractName !== -1}>
        <Then>
          <>
            <h2>
              <Tooltip title={contractName} placement="topLeft">
                {contractName}
              </Tooltip>
            </h2>
            <Divider />
          </>
        </Then>
      </If>
      <div className="contract-viewer-header-desc">
        <If condition={!!author}>
          <Then>
            <div className="contract-viewer-header-desc-item">
              <div className="gap-right">Author:</div>
              <div>
                <AddressLink address={author} suffix={<LinkIcon />} />
              </div>
            </div>
          </Then>
        </If>
        <div className="contract-viewer-header-desc-item">
          <div className="gap-right">Contract Type:</div>
          <Tag color={isSystemContract ? 'green' : 'blue'}>{isSystemContract ? 'System' : 'User'}</Tag>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  author: PropTypes.string,
  isSystemContract: PropTypes.bool.isRequired,
  contractName: PropTypes.string,
};
Header.defaultProps = {
  author: false,
  contractName: '',
};

export default Header;
