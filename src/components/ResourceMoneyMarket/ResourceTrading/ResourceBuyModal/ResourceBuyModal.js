/**
 * @file ResourceBuyModal
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Spin, message} from 'antd';
import {resourceAddress} from '../../../../../config/config';
import {aelf} from '../../../../utils';
import getFees from '../../../../utils/getFees';
import getMenuName from '../../../../utils/getMenuName';
import getEstimatedValueELF from '../../../../utils/getEstimatedValueELF';
import addressOmit from '../../../../utils/addressOmit';
import getStateJudgment from '../../../../utils/getStateJudgment';
import './ResourceBuyModal.less';

export default class ResourceBuyModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuIndex: this.props.menuIndex,
            currentWallet: this.props.currentWallet || null,
            serviceCharge: 0,
            resourceContract: this.props.resourceContract,
            menuName: getMenuName(this.props.menuIndex),
            ELFValue: null,
            buyNum: this.props.buyNum,
            loading: false
        };
    }

    componentDidMount() {
        const {buyNum, menuName, resourceContract} = this.state;
        getEstimatedValueELF(menuName, buyNum, resourceContract, 'Buy').then(result => {
            let ELFValue = Math.abs(Math.ceil(result));
            let buyRes = ELFValue;
            ELFValue += getFees(ELFValue) + 1;
            if (ELFValue !== 0) {
                this.setState({
                    ELFValue,
                    menuName,
                    serviceCharge: getFees(buyRes) + 1
                });
            }
            else {
                this.setState({
                    ELFValue,
                    menuName,
                    serviceCharge: getFees(buyRes) + 1
                });
            }
        });
    }


    getBuyRes() {
        const {currentWallet, menuName, ELFValue} = this.state;
        this.setState({
            loading: true
        });
        window.NightElf.api({
            appName: 'hzzTest',
            method: 'INIT_AELF_CONTRACT',
            // hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                address: currentWallet.address,
                contractName: 'resource',
                contractAddress: resourceAddress
            }
        }).then(result => {
            console.log(ELFValue);
            if (result.error === 0) {
                window.NightElf.api({
                    appName: 'hzzTest',
                    method: 'CALL_AELF_CONTRACT',
                    hostname: 'aelf.io',
                    chainId: 'AELF',
                    payload: {
                        contractName: 'resource',
                        contractAddress: resourceAddress,
                        method: 'BuyResource',
                        params: [menuName, ELFValue]
                    }
                }).then(result => {
                    console.log('>>>>>>>>>>>>>>>>>>>', result);
                    if (result.error === 0) {
                        setTimeout(() => {
                            aelf.chain.getTxResult(result.result.hash, (error, result) => {
                                getStateJudgment(result.result.tx_status, result.result.tx_info.TxId);
                                this.props.onRefresh();
                                this.setState({
                                    loading: false
                                });
                                this.props.handleCancel();
                            });
                        }, 4000);
                    }
                });
            }
            else {
                message.error(result.errorMessage.message, 5);
            }
        });
    }

    render() {
        const {serviceCharge, menuName, buyNum, ELFValue, currentWallet} = this.state;
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
                        <Col span={16}>{ELFValue + 1}</Col>
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
