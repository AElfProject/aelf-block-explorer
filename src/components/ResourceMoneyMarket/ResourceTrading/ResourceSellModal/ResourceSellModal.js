/**
 * @file ResourceBuyModal
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Spin} from 'antd';
import {aelf} from '../../../../utils';
import getMenuName from '../../../../utils/getMenuName';
import getEstimatedValueELF from '../../../../utils/getEstimatedValueELF';
import addressOmit from '../../../../utils/addressOmit';
import getResource from '../../../../utils/getResource';
import getWallet from '../../../../utils/getWallet';
import getStateJudgment from '../../../../utils/getStateJudgment';
import getFees from '../../../../utils/getFees';
import './ResourceSellModal.less';

export default class ResourceSellModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuIndex: this.props.menuIndex,
            currentWallet: this.props.currentWallet,
            sellNum: this.props.sellNum,
            serviceCharge: 0,
            menuName: null,
            loading: false
        };
    }

    componentDidMount() {
        const {menuIndex, currentWallet, sellNum} = this.state;
        let actualPayment = parseInt(
            getEstimatedValueELF(getMenuName(menuIndex), currentWallet.privateKey, sellNum)
        , 10);
        const fees = getFees(actualPayment);
        let elfValue = actualPayment + fees;
        this.setState({
            menuName: getMenuName(menuIndex),
            elfValue: elfValue,
            serviceCharge: fees,
            actualPayment
        });
    }

    getSellRes() {
        const {currentWallet, menuName, actualPayment} = this.state;
        this.wallet = getWallet(currentWallet.privateKey);
        this.resource = getResource(this.wallet);
        const hash = this.resource.SellResource(menuName, actualPayment).hash;
        console.log(hash);
        this.setState({
            loading: true
        });
        setTimeout(() => {
            const state = aelf.chain.getTxResult(hash);
            // TODO:状态判断后的刷新放在之后在做
            // if (state.result.tx_status === 'Mined') {
            //     this.props.onRefresh();
            // }
            getStateJudgment(state.result.tx_status, hash);
            this.setState({
                loading: false
            });
            this.props.handleCancel();
        }, 4000);
    }

    render() {
        const {serviceCharge, menuName, currentWallet, sellNum, actualPayment} = this.state;
        return (
            <div className='modal'>
                <Spin
                    size='large'
                    spinning={this.state.loading}
                >
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>地址信息</Col>
                        <Col span={16}>{addressOmit(currentWallet.address)}</Col>
                    </Row>
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>卖出{menuName}数量</Col>
                        <Col span={16}>{sellNum}</Col>
                    </Row>
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>ELF</Col>
                        <Col span={16}>{actualPayment}</Col>
                    </Row>
                    <div className='service-charge'>
                        *手续费: {serviceCharge} ELF
                    </div>
                    <div
                        className='modal-button'
                        style={{background: '#cc2828'}}
                        onClick={this.getSellRes.bind(this)}
                    >
                        Sell
                    </div>
                    <div className='modal-tip'>
                        * To avoid price fluctuations leading to transaction failure, please
                        complete the transaction within 30 seconds.
                    </div>
                </Spin>
            </div>
        );
    }
}