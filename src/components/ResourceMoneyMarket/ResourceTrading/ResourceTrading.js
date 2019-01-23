/**
 * @file Resource Trading
 * @author zhouminghui
 * Purchase and Sell of Resources
*/

import React, {PureComponent} from 'react';
import {Row, Col, Modal} from 'antd';
import ResourceBuy from './ResourceBuy/ResourceBuy';
import ResourceSell from './ResourceSell/ResourceSell';
import ResourceBuyModal from './ResourceBuyModal/ResourceBuyModal';
import ResourceSellModal from './ResourceSellModal/ResourceSellModal';
import './ResourceTrading.less';

export default class ResourceTrading extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentWallet: this.props.currentWallet || null,
            menuIndex: this.props.menuIndex,
            voteContracts: this.props.voteContracts,
            buyVisible: false,
            sellVisible: false,
            buyNum: null,
            sellNum: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.currentWallet) {
            return {
                currentWallet: props.currentWallet
            };
        }

        if (props.menuIndex !== state.menuIndex) {
            return {
                menuIndex: props.menuIndex
            };
        }

        return null;
    }

    handleBuyModalShow(e) {
        this.setState({
            buyVisible: true,
            buyNum: e
        });
    }

    handleSellModalShow(e) {
        this.setState({
            sellVisible: true,
            sellNum: e
        });
    }

    handleCancel = e => {
        this.setState({
            buyVisible: false,
            sellVisible: false
        });
    }

    render() {
        const {menuIndex, sellVisible, buyVisible, currentWallet, voteContracts, buyNum, sellNum} = this.state;
        return (
            <div className='resource-trading'>
                <div className='resource-trading-head'>
                    Transaction
                </div>
                <div className='resource-trading-body'>
                    <Row>
                        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                            <ResourceBuy
                                menuIndex={menuIndex}
                                currentWallet={currentWallet}
                                handleBuyModalShow={this.handleBuyModalShow.bind(this)}
                                voteContracts={voteContracts}
                            />
                        </Col>
                        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                            <ResourceSell
                                handleSellModalShow={this.handleSellModalShow.bind(this)}
                                currentWallet={currentWallet}
                                menuIndex={menuIndex}
                            />
                        </Col>
                    </Row>
                </div>
                <Modal
                    className='modal-display-box'
                    title="Resource buying"
                    destroyOnClose={true}
                    closable={false}
                    footer={null}
                    visible={buyVisible}
                    centered={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                >
                    <ResourceBuyModal
                        currentWallet={currentWallet}
                        menuIndex={menuIndex}
                        buyNum={buyNum}
                        voteContracts={voteContracts}
                        handleCancel={this.handleCancel}
                    />
                </Modal>
                <Modal
                    className='modal-display-box'
                    title="Resource selling"
                    destroyOnClose={true}
                    closable={false}
                    footer={null}
                    visible={sellVisible}
                    centered={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                >
                    <ResourceSellModal
                        currentWallet={currentWallet}
                        menuIndex={menuIndex}
                        voteContracts={voteContracts}
                        sellNum={sellNum}
                        handleCancel={this.handleCancel}
                    />
                </Modal>
            </div>
        );
    }
}