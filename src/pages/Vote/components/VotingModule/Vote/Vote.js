/**
 * @file Vote
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import getHexNumber from '../../../../../utils/getHexNumber';
import {Row, Col, Select, Input, message, Spin} from 'antd';
import getStateJudgment from '../../../../../utils/getStateJudgment';
import {aelf} from '../../../../../utils';
import Button from '../../../../../components/Button/Button';
import './Vote.less';

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
            loading: false,
            nightElf: this.props.nightElf
        };
    }

    componentDidMount() {
        const {contracts, nightElf, currentWallet} = this.state;
        const wallet = {
            address: currentWallet.address
        };
        nightElf.chain.contractAtAsync(
            contracts.TOKENADDRESS,
            wallet,
            (err, result) => {
                console.log(result);
                if (result) {
                    this.getKeypairBalanceOf(result);
                }
            }
        );

        // nightElf = new window.NightElf.AElf({
        //     httpProvider: DEFAUTRPCSERVER,
        //     appName: 'nightElf'
        // });
        // if (nightElf) {
        //     this.setState({
        //         nightElf
        //     });
        //     nightElf.chain.getContractAbi(
        //         contracts.TOKENADDRESS,
        //         (err, result) => {
        //             if (result) {
        //                 this.getKeypairBalanceOf(result);
        //             }
        //         }
        //     );
        // }
    }

    componentWillUnmount() {
        this.setState = () => {};
    }


    getKeypairBalanceOf(result) {
        const {currentWallet} = this.state;
        result.BalanceOf(currentWallet.address, (error, result) => {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>', result);
            if (result.error && result.error !== 0) {
                message.error(result.errorMessage.message, 3);
                this.props.handleClose();
                return;
            }
            const balance = result.result ? result.result.return : result.return;
            this.setState({
                balance: getHexNumber(balance)
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
        const {contracts, currentWallet, nightElf} = this.state;
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
            const wallet = {
                address: currentWallet.address
            };
            nightElf.chain.contractAtAsync(
                contracts.CONSENSUSADDRESS,
                wallet,
                (err, result) => {
                    if (result) {
                        this.getExtensionVote(result);
                    }
                }
            );
        }
    }

    getExtensionVote(result) {
        result.Vote(this.state.publicKey, this.state.votes, this.state.period, (error, result) => {
            if (result.error && result.error !== 0) {
                message.error(result.errorMessage.message, 3);
                this.props.handleClose();
                return;
            }
            this.setState({
                loading: true
            });
            const hash = result.result ? result.result.hash : result.hash;
            setTimeout(() => {
                message.info('No withdrawal and transfer operations during the voting lock period!');
                aelf.chain.getTxResult(hash, (error, result) => {
                    if (result.result.tx_status === 'Mined') {
                        this.props.onRefresh();
                    }
                    console.log(result);
                    getStateJudgment(result.result.tx_status, hash);
                    this.setState({
                        loading: false
                    });
                    this.props.handleClose();
                });
            }, 4000);
        });
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
