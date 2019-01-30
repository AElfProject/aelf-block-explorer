/**
 * @file Redeem
 * @author zhouminghui
 * component Redeem
*/

import React, {PureComponent} from 'react';
import {Row, Col, Input, message, Spin} from 'antd';
import Button from '../../Button/Button';
import getStateJudgment from '../../../utils/getStateJudgment';
import {aelf} from '../../../utils';

import './Redeem.less';


export default class Redeem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            txId: null,
            myVote: null,
            password: null,
            loading: false,
            contracts: this.props.contracts
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
        const {txId, contracts} = this.state;
        window.NightElf.api({
            appName: 'hzzTest',
            method: 'CALL_AELF_CONTRACT',
            chainId: 'AELF',
            payload: {
                contractName: 'consensus',
                contractAddress: contracts.CONSENSUSADDRESS,
                method: 'WithdrawByTransactionId',
                params: [txId]
            }
        }).then(result => {
            console.log(result);
            this.setState({
                loading: true
            });
            setTimeout(() => {
                const state = aelf.chain.getTxResult(result.result.hash);
                if (state.result.tx_status === 'Mined') {
                    this.props.onRefresh();
                }
                getStateJudgment(state.result.tx_status, result.result.hash);
                this.setState({
                    loading: false
                });
                this.props.handleClose();
            }, 4000);
        });
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