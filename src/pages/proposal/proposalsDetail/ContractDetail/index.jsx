/**
 * @file desc list
 * @author atom-yang
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { If, Then } from 'react-if';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Divider, Tooltip, Row, Col, Tag } from 'antd';
import config, { API_PATH } from 'constants/viewerApi';
import { request } from 'utils/request';
import { base64ToHex, getContractURL } from 'page-components/Proposal/common/utils';
import { PRIMARY_COLOR } from 'constants';
import { getContract } from 'utils/utils';
const { viewer } = config;

function getContractName(address) {
  return request(
    API_PATH.GET_CONTRACT_NAME,
    {
      address,
    },
    { method: 'GET' },
  );
}

const ContractDetail = (props) => {
  const { aelf, contractAddress, contractMethod, contractParams, createdBy, ...rest } = props;
  const [name, setName] = useState('');
  const [params, setParams] = useState(contractParams);
  useEffect(() => {
    getContractName(contractAddress)
      .then((data) => {
        setName(data.name);
      })
      .catch(() => {
        setName('');
      });
    if (createdBy === 'SYSTEM_CONTRACT') {
      setParams(JSON.stringify(JSON.parse(contractParams), null, 2));
    } else if (contractParams) {
      getContract(aelf, contractAddress)
        .then((contract) => {
          const decoded = contract[contractMethod].unpackPackedInput(base64ToHex(contractParams));
          setParams(JSON.stringify(decoded, null, 2));
        })
        .catch((e) => {
          console.error(e);
          // message.error(e.message || 'Chain server is not reachable');
        });
    } else {
      setParams(JSON.stringify(null, null, 2));
    }
  }, [contractAddress]);

  return (
    <Card
      {...rest}
      title={
        <span>
          Contract Details
          <Tooltip title="Specific information about the contract invoked by the proposal">
            <QuestionCircleOutlined className="gap-left main-color" />
          </Tooltip>
        </span>
      }>
      <If condition={!!name}>
        <Then>
          <>
            <Row>
              <Col sm={4} xs={24}>
                <span className="sub-title">Contract Name</span>
              </Col>
              <Col sm={20} xs={24}>
                {name}
              </Col>
            </Row>
            <Divider />
          </>
        </Then>
      </If>
      <Row>
        <Col sm={4} xs={24}>
          <span className="sub-title">Contract Address</span>
        </Col>
        <Col sm={20} xs={24}>
          <a href={getContractURL(contractAddress)} target="_blank" rel="noopener noreferrer">
            {`ELF_${contractAddress}_${viewer.chainId}`}
          </a>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col sm={4} xs={24}>
          <span className="sub-title">Contract Method Name</span>
        </Col>
        <Col sm={20} xs={24}>
          <Tag color={PRIMARY_COLOR}>{contractMethod}</Tag>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col sm={4} xs={24}>
          <span className="sub-title">Contract Params</span>
        </Col>
        <Col sm={20} xs={24}>
          <pre className="view-params">{params}</pre>
        </Col>
      </Row>
    </Card>
  );
};

ContractDetail.propTypes = {
  aelf: PropTypes.shape({
    chain: PropTypes.object,
  }).isRequired,
  contractAddress: PropTypes.string.isRequired,
  contractMethod: PropTypes.string.isRequired,
  contractParams: PropTypes.string.isRequired,
  createdBy: PropTypes.oneOf(['USER', 'SYSTEM_CONTRACT']).isRequired,
};

export default ContractDetail;
