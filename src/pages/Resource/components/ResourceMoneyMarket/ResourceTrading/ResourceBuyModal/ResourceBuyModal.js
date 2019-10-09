/**
 * @file ResourceBuyModal
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Spin, message} from 'antd';
import {aelf} from '../../../../../../utils';
import getFees from '../../../../../../utils/getFees';
import getMenuName from '../../../../../../utils/getMenuName';
import getEstimatedValueELF from '../../../../../../utils/getEstimatedValueELF';
import addressOmit from '../../../../../../utils/addressOmit';
import getStateJudgment from '../../../../../../utils/getStateJudgment';
import config from '@config/config';
import {SYMBOL, ELF_DECIMAL, TEMP_RESOURCE_DECIMAL} from '@src/constants';
import {thousandsCommaWithDecimal} from '@utils/formater';
import './ResourceBuyModal.less';

export default class ResourceBuyModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuIndex: this.props.menuIndex,
            currentWallet: this.props.currentWallet || null,
            serviceCharge: 0,
            tokenConverterContract: this.props.tokenConverterContract,
            tokenContract: this.props.tokenContract,
            menuName: getMenuName(this.props.menuIndex),
            ELFValue: null,
            buyNum: this.props.buyNum,
            loading: false,
            nightElf: this.props.nightElf,
            contracts: this.props.contracts
        };
    }

    componentDidMount() {
        const {buyNum, menuName, tokenConverterContract, tokenContract} = this.state;
        console.log('buyNum', buyNum);
        // todo: the code here are repeat
        getEstimatedValueELF(menuName, buyNum, tokenConverterContract, tokenContract).then(result => {
            let ELFValue = Math.abs(Math.floor(result));
            ELFValue += getFees(ELFValue);
            if (ELFValue !== 0) {
                this.setState({
                    ELFValue,
                    menuName,
                    serviceCharge: getFees(ELFValue)
                });
            }
            else {
                this.setState({
                    ELFValue,
                    menuName,
                    serviceCharge: getFees(buyRes)
                });
            }
        });
    }


    getBuyRes() {
        const {currentWallet, nightElf, contracts} = this.state;
        this.props.maskClosable();
        const wallet = {
            address: currentWallet.address
        };
        this.setState({
            loading: true
        });
        nightElf.chain.contractAt(
            contracts.tokenConverter,
            wallet,
            (err, result) => {
                console.log('err, result', err, result);
                if (result) {
                    this.requestBuy(result);
                }
            }
        );
    }

    requestBuy(result) {
        const {menuName, buyNum} = this.state;
        console.log('buyNum * config.ELF_DECIMAL', buyNum, config.ELF_DECIMAL);
        const payload = {
            symbol: menuName,
            amount: buyNum * config.ELF_DECIMAL
        };
        console.log('result', result);
        console.log('payload', payload);
        result.Buy(payload, (error, result) => {
            if (result.error && result.error !== 0) {
                message.error(result.errorMessage.message, 3);
                this.props.handleCancel();
                return;
            }
            else {
                this.setState({
                    loading: true
                });
                const transactionId = result.result ? result.result.TransactionId : result.TransactionId;
                setTimeout(() => {
                    console.log('transactionId', transactionId);
                    aelf.chain.getTxResult(transactionId, (error, result) => {
                        // todo: 没有将token合约的approve方法添加到白名单时，发交易在这里会出错
                        console.log('result', result);
                        getStateJudgment(result.Status, transactionId);
                        this.props.onRefresh();
                        this.setState({
                            loading: false
                        });
                        this.props.handleCancel();
                        this.props.unMaskClosable();
                    });
                }, 4000);
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
                        <Col span={8} style={{color: '#c8c7c7'}}>Address</Col>
                        <Col span={16}>{addressOmit(currentWallet.address)}</Col>
                    </Row>
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>Buy{menuName}Quantity</Col>
                        <Col span={16}>{thousandsCommaWithDecimal(buyNum)}</Col>
                    </Row>
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>ELF</Col>
                        <Col span={16}>{thousandsCommaWithDecimal(ELFValue)}</Col>
                    </Row>
                    <div className='service-charge'>
                        *Service Charge: {thousandsCommaWithDecimal(serviceCharge)} ELF
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
