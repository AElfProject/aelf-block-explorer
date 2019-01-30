/**
 * @file Vote
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import getHexNumber from '../../../utils/getHexNumber';
import {Row, Col, Select, Input, message, Spin} from 'antd';
import getStateJudgment from '../../../utils/getStateJudgment';
import {aelf} from '../../../utils';
import './Vote.less';
import Button from '../../Button/Button';

const Option = Select.Option;

export default class Vote extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            period: null,
            votes: null,
            buttonTitle: 'Next',
            step: true,
            password: null,
            balance: null,
            publicKey: this.props.publicKey,
            contracts: this.props.contracts,
            currentWallet: JSON.parse(localStorage.currentWallet),
            loading: false
        };
    }

    componentDidMount() {
        const {currentWallet, contracts} = this.state;
        window.NightElf.api({
            appName: 'hzzTest',
            method: 'CALL_AELF_CONTRACT',
            chainId: 'AELF',
            payload: {
                contractAddress: contracts.TOKENADDRESS,
                contractName: 'token',
                method: 'BalanceOf',
                params: [currentWallet.address]
            }
        }).then(result => {
            this.setState({
                balance: getHexNumber(result.result.return)
            });
        });
    }

    // 获取所选周期
    handleChange(value) {
        this.setState({
            period: value
        });
    }

    changeVotes(e) {
        this.setState({
            votes: e.target.value
        });
    }

    changePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    getNextStep() {
        const {contracts} = this.state;
        let reg = /^[0-9]*$/;
        if (this.state.step) {
            if (!reg.test(this.state.votes)) {
                message.error('Number of votes must be numeric');
                return;
            }
            else if (parseFloat(this.state.votes, 10) > parseFloat(this.state.balance, 10)) {
                message.warning('More votes than available assets');
                return;
            }
            else if (this.state.period == null) {
                message.error('Please select lock period');
                return;
            }

            this.setState({
                step: false,
                buttonTitle: 'Submit'
            });
        }
        else {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'CALL_AELF_CONTRACT',
                chainId: 'AELF',
                payload: {
                    contractAddress: contracts.CONSENSUSADDRESS,
                    contractName: 'consensus',
                    method: 'Vote',
                    params: [this.state.publicKey, this.state.votes, this.state.perio]
                }
            }).then(result => {
                console.log(result);
                this.setState({
                    loading: true
                });
                setTimeout(() => {
                    message.info('No withdrawal and transfer operations during the voting lock period!');
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
    }

    render() {
        return (
            <div className='vote-inside'>
                <Spin

                    tip='Send a poll request......'
                    size='large'
                    spinning={this.state.loading}
                >
                    <div
                        className='vote-step-1'
                        style={this.state.step ? {display: 'block'} : {display: ' none'}}
                    >
                        <Row type='flex' align='middle'>
                            <Col span='6'>Node name: </Col>
                            <Col span='18'>{this.props.nodeName}</Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span='10'>Available voting amount: </Col>
                            <Col span='14'>{this.state.balance}</Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span='8'>Number of votes: </Col>
                            <Col span='16'>
                                <Input
                                    addonAfter='ELF'
                                    placeholder='Minimum number of votes 1 ELF'
                                    onChange={this.changeVotes.bind(this)}
                                />
                            </Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span='6'>Voting cycle: </Col>
                            <Col span='18'>
                                <Select
                                    placeholder='Voting cycles do not support withdrawal and transfer operations'
                                    optionFilterProp='children'
                                    onChange={this.handleChange.bind(this)}
                                >
                                    <Option value='90' >90 days</Option>
                                    <Option value='180' >180 days</Option>
                                    <Option value='365' >365 days</Option>
                                    <Option value='730' >730 days</Option>
                                    <Option value='1095' >1095 days</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    <div
                        className='vote-step-2'
                        style={this.state.step ? {display: 'none'} : {display: ' block'}}
                    >
                        <Row type='flex' align='middle'>
                            <Col span='8'>Transaction name: </Col>
                            <Col span='16'>Node voting</Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span='8'>Node name: </Col>
                            <Col span='16'>{this.props.nodeName}</Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span='8'>Number of votes: </Col>
                            <Col span='16'>{this.state.votes} ELF</Col>
                        </Row>
                        <Row type='flex' align='middle'>
                            <Col span='8'>Lock period: </Col>
                            <Col span='16'>{this.state.period} days</Col>
                        </Row>
                    </div>
                    <div className='vote-step1-button'>
                        <Button
                            title='Cancel'
                            style={{background: '#868483'}}
                            click={this.props.handleClose}
                        />
                        <Button
                            title={this.state.buttonTitle}
                            click={this.getNextStep.bind(this)}
                        />
                    </div>
                </Spin>
            </div>
        );
    }
}
