/**
 * @file chain info
 * @author atom-yang
 */
import React from "react";
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Card,
    Divider
} from "antd";
import { CHAIN_ID } from '@src/constants';
import './index.less';

const gutter = [
    {
        sm: 16,
        md: 16
    },
    {
        sm: 16,
        md: 16
    }
];

const ChainInfo = props => {
    const {
        chainId,
        blockHeight,
        unconfirmedBlockHeight,
        totalAccounts,
        totalTxs,
        localAccounts,
        localTxs
    } = props;
    return (
        <Row className="home-chain-info" gutter={gutter}>
            <Col sm={12} md={8}>
                <Card  className="gap-bottom" title="Block Height" bordered={false}>
                    <p className="home-chain-info-text">{blockHeight && blockHeight.toLocaleString()}</p>
                </Card>
                <Card title="Unconfirmed Blocks" bordered={false}>
                    <p className="home-chain-info-text">{unconfirmedBlockHeight && unconfirmedBlockHeight.toLocaleString()}</p>
                </Card>
            </Col>
            <Col sm={12} md={8}>
                <Card title="Total Transactions" className="home-chain-info-min-height" bordered={false}>
                    <h4 className="home-chain-info-sub-title">All Chains</h4>
                    <p className="home-chain-info-text">{totalTxs && totalTxs.toLocaleString()}</p>
                    <Divider />
                    <h4 className="home-chain-info-sub-title">{chainId} Chain</h4>
                    <p className="home-chain-info-text">{localTxs && localTxs.toLocaleString()}</p>
                </Card>
            </Col>
            <Col sm={12} md={8}>
                <Card title="Total Accounts" className="home-chain-info-min-height" bordered={false}>
                    <h4 className="home-chain-info-sub-title">All Chains</h4>
                    <p className="home-chain-info-text">{totalAccounts && totalAccounts.toLocaleString()}</p>
                    <Divider />
                    <h4 className="home-chain-info-sub-title">{chainId} Chain</h4>
                    <p className="home-chain-info-text">{localAccounts && localAccounts.toLocaleString()}</p>
                </Card>
            </Col>
        </Row>
    );
};

ChainInfo.propTypes = {
  chainId: PropTypes.string,
  blockHeight: PropTypes.number.isRequired,
  unconfirmedBlockHeight: PropTypes.number.isRequired,
  totalTxs: PropTypes.number.isRequired,
  localTxs: PropTypes.number.isRequired,
  totalAccounts: PropTypes.number.isRequired,
  localAccounts: PropTypes.number.isRequired
};

ChainInfo.defaultProps = {
    chainId: CHAIN_ID
}

export default React.memo(ChainInfo);
