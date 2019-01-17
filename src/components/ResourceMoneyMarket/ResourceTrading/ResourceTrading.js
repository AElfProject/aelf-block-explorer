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
            menuIndex: this.props.menuIndex,
            buyVisible: false,
            sellVisible: false
        };
    }

    componentDidMount() {

    }

    handleBuyModalShow() {
        this.setState({
            buyVisible: true
        });
    }

    handleSellModalShow() {
        this.setState({
            sellVisible: true
        });
    }

    handleCancel = e => {
        this.setState({
            buyVisible: false,
            sellVisible: false
        });
    }

    render() {
        const {menuIndex, sellVisible, buyVisible} = this.state;
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
                                handleBuyModalShow={this.handleBuyModalShow.bind(this)}
                            />
                        </Col>
                        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                            <ResourceSell
                                handleSellModalShow={this.handleSellModalShow.bind(this)}
                                menuIndex={menuIndex}
                            />
                        </Col>
                    </Row>
                </div>
                <Modal
                    className='modal-display-box'
                    title="Resource buying"
                    destroyOnClose={false}
                    closable={false}
                    footer={null}
                    visible={buyVisible}
                    centered={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                >
                    <ResourceBuyModal
                        menuIndex={menuIndex}
                    />
                </Modal>
                <Modal
                    className='modal-display-box'
                    title="Resource selling"
                    destroyOnClose={false}
                    closable={false}
                    footer={null}
                    visible={sellVisible}
                    centered={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                >
                    <ResourceSellModal
                        menuIndex={menuIndex}
                    />
                </Modal>
            </div>
        );
    }
}