/**
 * @file ResourceBuyModal
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Spin} from 'antd';
import {aelf} from '../../../../utils';
import getFees from '../../../../utils/getFees';
import getMenuName from '../../../../utils/getMenuName';
import getEstimatedValueELF from '../../../../utils/getEstimatedValueELF';
import addressOmit from '../../../../utils/addressOmit';
import getResource from '../../../../utils/getResource';
import getWallet from '../../../../utils/getWallet';
import getStateJudgment from '../../../../utils/getStateJudgment';
import './ResourceBuyModal.less';

export default class ResourceBuyModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuIndex: this.props.menuIndex,
            currentWallet: this.props.currentWallet || null,
            serviceCharge: 0,
            menuName: null,
            elfValue: null,
            buyNum: this.props.buyNum,
            loading: false
        };
    }

    componentDidMount() {
        const {menuIndex, currentWallet, buyNum} = this.state;
        let actualPayment = Math.ceil(
            getEstimatedValueELF(getMenuName(menuIndex), currentWallet.privateKey, buyNum)
        );
        const fees = getFees(actualPayment);
        let elfValue = actualPayment + fees;
        this.setState({
            menuName: getMenuName(menuIndex),
            elfValue: elfValue,
            serviceCharge: fees,
            actualPayment
        });
    }

    getBuyRes() {
        const {currentWallet, menuName, elfValue} = this.state;
        this.wallet = getWallet(currentWallet.privateKey);
        this.resource = getResource(this.wallet);
        new Promise((resolve, reject) => {
            const hash = this.resource.BuyResource(menuName, elfValue).hash;
            resolve(hash);
        }).then(result => {
            console.log(result);
            this.setState({
                loading: true
            });
            setTimeout(() => {
                new Promise((resolve, reject) => {
                    const state = aelf.chain.getTxResult(result);
                    resolve(state);
                }).then(result => {
                    getStateJudgment(result.result.tx_status, result);
                    this.setState({
                        loading: false
                    });
                    this.props.handleCancel();
                });
            }, 4000);
        });
    }

    render() {
        const {serviceCharge, menuName, buyNum, elfValue, currentWallet} = this.state;
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
                        <Col span={8} style={{color: '#c8c7c7'}}>买入{menuName}数量</Col>
                        <Col span={16}>{buyNum}</Col>
                    </Row>
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>ELF</Col>
                        <Col span={16}>{elfValue}</Col>
                    </Row>
                    <div className='service-charge'>
                        *手续费: {serviceCharge} ELF
                    </div>
                    <div
                        className='modal-button'
                        style={{background: '#007130'}}
                        onClick={this.getBuyRes.bind(this)}
                    >Buy</div>
                    <div className='modal-tip'>
                        * To avoid price fluctuations leading to transaction failure, please
                        complete the transaction within 30 seconds.
                    </div>
                </Spin>
            </div>
        );
    }
}
