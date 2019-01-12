/**
 * @file Redeem
 * @author zhouminghui
 * component Redeem
*/

import React, {PureComponent} from 'react';
import {Row, Col, Input, message, Spin} from 'antd';
import Button from '../../Button/Button';
import getConsensus from '../../../utils/getConsensus';
import getStateJudgment from '../../../utils/getStateJudgment';
import getWallet from '../../../utils/getWallet';
import {aelf} from '../../../utils';

import './Redeem.less';


export default class Redeem extends PureComponent {
    constructor(props) {
        super(props);
        console.log(this.props);
        if (localStorage.currentWallet != null) {
            this.wallet = getWallet(JSON.parse(localStorage.currentWallet).privateKey);
            this.consensus = getConsensus(this.props.contracts.CONSENSUSADDRESS, this.wallet);
        }
        this.state = {
            publicKey: JSON.parse(localStorage.currentWallet).publicKey,
            contractPublicKey: this.props.publicKey,
            myVote: null,
            password: null,
            loading: false
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

    changePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    getSubmit() {
        if (this.state.password == null) {
            message.error('Password cannot be empty');
            return;
        }
        const redeem = this.consensus.WithdrawByTransactionId(this.state.txId).hash;
        if (redeem) {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                message.info('No withdrawal and transfer operations during the voting lock period!');
                const state = aelf.chain.getTxResult(redeem);
                getStateJudgment(state.result.tx_status);
                this.setState({
                    loading: false
                });
                this.props.handleClose();
            }, 4000);
        }
    }

    render() {
        return (
            <div className='redeem'>
                <Spin
                    tip='In redemption, please wait...'
                    size='large'
                    spinning={this.state.loading}
                >
                    <div className='redeem-step-1'>
                        <Row type='flex' align='middle'>
                            <Col span='10'>Node name: </Col>
                            <Col span='14'>{this.props.nodeName}</Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span='10'>Quantity of redemption: </Col>
                            <Col span='14'>{this.state.myVote} ELF</Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span='10'>Password: </Col>
                            <Col span='14'>
                                <Input
                                    type='password'
                                    onChange={this.changePassword.bind(this)}
                                />
                            </Col>
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