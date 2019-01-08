/**
 * @file Redeem
 * @author zhouminghui
 * component Redeem
*/

import React, {PureComponent} from 'react';
import {Row, Col, Input, message} from 'antd';
import Button from '../../Button/Button';
import getConsensus from '../../../utils/getConsensus';
import getWallet from '../../../utils/getWallet';
import {transactionInfo} from '../../../utils';

import './Redeem.less';


export default class Redeem extends PureComponent {
    constructor(props) {
        super(props);
        console.log(this.props);
        if (localStorage.currentWallet != null) {
            this.wallet = getWallet(JSON.parse(localStorage.currentWallet).privateKey);
            this.consensus = getConsensus(this.wallet);
        }
        this.state = {
            publicKey: JSON.parse(localStorage.currentWallet).publicKey,
            contractPublicKey: this.props.publicKey,
            myVote: null,
            password: null
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
        this.props.handleClose();
        this.consensus.WithdrawByTransactionId(this.state.txId);
        message.success('Redemption success!');
    }

    render() {
        return (
            <div className='redeem'>
                <div className='redeem-step-1'>
                    <Row type='flex' align='middle'>
                        <Col span='10'>Node name: </Col>
                        <Col span='14'>{this.props.nodeName}</Col>
                    </Row>
                    <Row type='flex' align='middle'>
                        <Col span='10'>Quantity of redemption: </Col>
                        <Col span='14'>{this.state.myVote}</Col>
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
            </div>
        );
    }
}