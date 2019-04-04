/**
 * @file Redeem
 * @author zhouminghui
 * component Redeem
*/

import React, {PureComponent} from 'react';
import {Row, Col, message, Spin} from 'antd';
import Button from '../../../../../components/Button/Button';
import getStateJudgment from '../../../../../utils/getStateJudgment';
import {aelf} from '../../../../../utils';

import './Redeem.less';


export default class Redeem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            txId: null,
            myVote: null,
            password: null,
            loading: false,
            contracts: this.props.contracts,
            nightElf: this.props.nightElf,
            currentWallet: JSON.parse(localStorage.currentWallet)
        };
    }

    componentDidMount() {
        this.getRedeemInfo();
    }

    getRedeemInfo() {
        this.setState({
            myVote: this.props.myVote,
            txId: this.props.txId
        });
    }

    getSubmit() {
        const {contracts, nightElf, currentWallet} = this.state;
        const wallet = {
            address: currentWallet.address
        };
        nightElf.chain.contractAtAsync(
            contracts.consensusDPoS,
            wallet,
            (err, result) => {
                if (result) {
                    this.getRedeem(result);
                }
            }
        );
    }

    getRedeem(result) {
        const {txId} = this.state;
        result.WithdrawByTransactionId(txId, (error, result) => {
            if (result.error && result.error !== 0) {
                message.error(result.errorMessage.message, 3);
                this.props.handleClose();
                return;
            }
            if (result) {
                const transactionId = result.result ? result.result.TransactionId : result.TransactionId;
                this.setState({
                    loading: true
                });
                setTimeout(() => {
                    aelf.chain.getTxResult(transactionId, (error, result) => {
                        if (result.Status === 'Mined') {
                            this.props.onRefresh();
                        }
                        getStateJudgment(result.Status, transactionId);
                        this.setState({
                            loading: false
                        });
                        this.props.handleClose();
                    });
                }, 4000);
            }
        });
    }

    render() {
        return (
            <div className ='redeem'>
                <Spin
                    tip='In redemption, please wait...'
                    size='large'
                    spinning={this.state.loading}
                >
                    <div className='redeem-step-1'>
                        <Row type='flex' align='middle'>
                            <Col span={10}>Node name: </Col>
                            <Col span={14}>{this.props.nodeName}</Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span={10}>Quantity of redemption: </Col>
                            <Col span={14}>{this.state.myVote} ELF</Col>
                        </Row>
                    </div>
                    <div className='vote-step1-button'>
                        <Button
                            title='Cancel'
                            style={{background: '#868483'}}
                            click={this.props.handleClose}
                        />
                        <Button
                            title='Submit'
                            click={this.getSubmit.bind(this)}
                        />
                    </div>
                </Spin>
            </div>
        );
    }
}