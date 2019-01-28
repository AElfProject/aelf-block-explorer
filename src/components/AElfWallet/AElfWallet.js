/**
 * @file AElfWallet
 * @author zhouminghui
 * // TODO waiting for web extension
*/

import React, {PureComponent} from 'react';
import {Row, Col, Radio, Spin, message} from 'antd';
import Button from '../Button/Button';
import Svg from '../Svg/Svg';
import {aelf} from '../../utils';
import getHexNumber from '../../utils/getHexNumber';
import getPublicKey from '../../utils/getPublicKey';
import hexCharCodeToStr from '../../utils/hexCharCodeToStr';
import getStateJudgment from '../../utils/getStateJudgment';
import './AElfWallet.less';

const RadioGroup = Radio.Group;

export default class AElfWallet extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            walletInfoList: this.props.walletInfoList || [],
            value: JSON.parse(localStorage.currentWallet).address,
            refresh: 0,
            loading: false,
            loadingTip: null,
            consensus: this.props.consensus,
            dividends: this.props.dividends,
            tokenContract: this.props.tokenContract,
            consensusLoad: false,
            dividendsLoad: false,
            tokenLoad: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.consensus !== state.consensus) {
            return {
                consensus: props.consensus
            };
        }

        if (props.dividends !== state.dividends) {
            return {
                dividends: props.dividends
            };
        }

        if (props.tokenContract !== state.tokenContract) {
            return {
                tokenContract: props.tokenContract
            };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.consensus !== this.props.consensus) {
            this.pushWalletTicket();
        }

        if (prevProps.dividends !== this.props.dividends) {
            this.pushWalletDividends();
        }

        if (prevProps.tokenContract !== this.props.tokenContract) {
            this.pushWalletBalance();
        }
    }

    pushWalletDividends = async () => {
        const {dividends} = this.state;
        let {walletInfoList} = this.state;
        walletInfoList.map((item, index) => {
            const key = getPublicKey(item.publicKey);
            dividends.GetAllAvailableDividends(key, (error, result) => {
                walletInfoList[index].dividends = getHexNumber(result.return);
                const temp = Array.from(walletInfoList);
                this.setState({
                    walletInfoList: temp
                });
            });
        });
    }

    pushWalletBalance = async () => {
        const {tokenContract} = this.state;
        let {walletInfoList} = this.state;
        walletInfoList.map((item, index) => {
            tokenContract.BalanceOf(item.address, (error, result) => {
                walletInfoList[index].balance = getHexNumber(result.return);
                const temp = Array.from(walletInfoList);
                this.setState({
                    walletInfoList: temp
                });
            });
        });
    }

    pushWalletTicket = async () => {
        const {consensus} = this.state;
        let {walletInfoList} = this.state;
        walletInfoList.map((item, index) => {
            const key = getPublicKey(item.publicKey);
            consensus.GetTicketsInfoToFriendlyString(key, (error, result) => {
                let tickets = JSON.parse(hexCharCodeToStr(result.return)).VotingRecords || [];
                let ticket = 0;
                tickets.map((item, index) => {
                    if (item.From === key) {
                        let IsWithdrawn = item.IsWithdrawn || false;
                        IsWithdrawn ? ticket : ticket += parseInt(item.Count, 10);
                    }
                });
                walletInfoList[index].tickets = ticket;
                const temp = Array.from(walletInfoList);
                this.setState({
                    walletInfoList: temp
                });
            });
        });
    }

    changeRadio(e) {
        const {walletInfoList} = this.state;
        this.setState({
            value: e.target.value
        });
        for (let i = 0, len = walletInfoList.length; i < len; i++) {
            if (e.target.value === walletInfoList[i].address) {
                localStorage.setItem('currentWallet', JSON.stringify(walletInfoList[i]));
                this.props.getCurrentWallet();
            }
        }
    }


    getWalletAssetInfo() {
        const walletAssetInfo = this.state.walletInfoList.map((item, index) => {
            let {balance, tickets, dividends} = item;
            balance = !!item.balance ? item.balance.toLocaleString() : '-';
            tickets = !!item.tickets ? item.tickets.toLocaleString() : '-';
            dividends = !!item.dividends ? item.dividends.toLocaleString() : '-';
            return (
                <Row key={index} type='flex' align='middle' style={{padding: '10px 0'}}>
                    <Col xxl={4} xl={4} lg={6} md={8} sm={8} xs={8}>
                        <Radio key={index} value={item.address} style={{marginLeft: '10px'}}>
                            <span className='wallet-name'>{item.name}</span>
                        </Radio>
                    </Col>
                    <Col xxl={4} xl={4} lg={6} md={8} sm={8} xs={8}>
                        {/* <div className='wallet-button-box' key={index} >
                            <Button title='Unbind' click={this.unbindWallet.bind(this, item.address)} />
                        </div> */}
                    </Col>
                    <Col xxl={4} xl={4} lg={6} md={8} sm={8} xs={8}>
                        Assets: <span className='total-assets'>{balance}</span>
                    </Col>
                    <Col
                        xxl={{span: 4, offset: 0}}
                        xl={{span: 4, offset: 0}}
                        lg={{span: 6, offset: 0}}
                        md={{span: 8, offset: 16}}
                        sm={{span: 8, offset: 16}}
                        xs={{span: 8, offset: 16}}
                    >
                        Votes: <span className='total-votes'>{tickets}</span>
                    </Col>
                    <Col
                        xxl={{span: 8, offset: 0}}
                        xl={{span: 8, offset: 0}}
                        lg={{span: 12, offset: 12}}
                        md={{span: 8, offset: 16}}
                        sm={{span: 8, offset: 16}}
                        xs={{span: 8, offset: 16}}
                    >
                        Dividends: <span className='pending-dividend'>{dividends}</span>
                            <Button
                                title='Receive'
                                click={this.getAllDividends.bind(this)}
                                style={
                                    this.state.value === item.address
                                    ? {display: 'inline-block'} : {display: 'none'}
                                }
                            />
                    </Col>
                </Row>
            );
        });
        return walletAssetInfo;
    }

    // unbindWallet(address) {
    //     console.log('unbind:' + address);
    // }

    getAllDividends() {
        // GetAllDividends
        const {contracts} = this.state;
        const currentWallet = JSON.parse(localStorage.currentWallet);
        window.NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_PERMISSION',
            type: 'address', // if you did not set type, it aways get by domain.
            address: currentWallet.address
        }).then(result => {
            if (result.permissions.length === 0) {
                window.NightElf.api({
                    appName: 'hzzTest',
                    method: 'OPEN_PROMPT',
                    chainId: 'AELF',
                    hostname: 'aelf.io',
                    payload: {
                        method: 'SET_PERMISSION',
                        payload: {
                            address: currentWallet.address,
                            contracts: [{
                                chainId: 'AELF',
                                contractAddress: contracts.TOKENADDRESS,
                                contractName: 'token',
                                description: 'token contract'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.DIVIDENDSADDRESS,
                                contractName: 'dividends',
                                description: 'contract dividends'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.CONSENSUSADDRESS,
                                contractName: 'consensus',
                                description: 'contract consensus'
                            }]
                        }
                    }
                }).then(result => {
                    if (result.error === 0) {
                        window.NightElf.api({
                            appName: 'hzzTest',
                            method: 'INIT_AELF_CONTRACT',
                            // hostname: 'aelf.io',
                            chainId: 'AELF',
                            payload: {
                                address: currentWallet.address,
                                contractName: 'consensus',
                                contractAddress: contracts.CONSENSUSADDRESS
                            }
                        }).then(result => {
                            if (result.error === 0) {
                                window.NightElf.api({
                                    appName: 'hzzTest',
                                    method: 'CALL_AELF_CONTRACT',
                                    chainId: 'AELF',
                                    payload: {
                                        contractName: 'consensus',
                                        method: 'ReceiveAllDividends',
                                        params: []
                                    }
                                }).then(result => {
                                    this.setState({
                                        loading: true
                                    });
                                    setTimeout(() => {
                                        const state = aelf.chain.getTxResult(result.result.hash);
                                        getStateJudgment(state.result.tx_status, result.result.hash);
                                        this.pushWalletInfo();
                                        this.setState({
                                            loading: false
                                        });
                                    }, 4000);
                                });
                            }
                        });
                    }
                    else {
                        message.error(result.errorMessage, 5);
                    }
                });
            }
            else {
                result.permissions.map((item, index) => {
                    if (item.address === currentWallet.address) {
                        window.NightElf.api({
                            appName: 'hzzTest',
                            method: 'INIT_AELF_CONTRACT',
                            // hostname: 'aelf.io',
                            chainId: 'AELF',
                            payload: {
                                address: currentWallet.address,
                                contractName: 'consensus',
                                contractAddress: contracts.CONSENSUSADDRESS
                            }
                        }).then(result => {
                            if (result.error === 0) {
                                window.NightElf.api({
                                    appName: 'hzzTest',
                                    method: 'CALL_AELF_CONTRACT',
                                    chainId: 'AELF',
                                    payload: {
                                        contractName: 'consensus',
                                        method: 'ReceiveAllDividends',
                                        params: []
                                    }
                                }).then(result => {
                                    this.setState({
                                        loading: true
                                    });
                                    setTimeout(() => {
                                        const state = aelf.chain.getTxResult(result.result.hash);
                                        getStateJudgment(state.result.tx_status, result.result.hash);
                                        this.pushWalletInfo();
                                        this.setState({
                                            loading: false
                                        });
                                    }, 4000);
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    onRefresh() {
        this.setState({
            loadingTip: 'Loading......'
        });
        if (!this.state.isRefresh) {
            this.setState({
                loading: true
            });
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'GET_ADDRESS'
            }).then(result => {
                localStorage.setItem('walletInfoList', JSON.stringify(result.addressList));
                this.setState({
                    walletInfoList: result.addressList,
                    currentWallet: JSON.parse(localStorage.currentWallet)
                });
            }).then(() => {
                this.pushWalletBalance()
                .then(this.pushWalletTicket())
                .then(this.pushWalletDividends())
                .then(() => {
                    this.setState({
                        loading: false
                    });
                });
            });
        }
    }

    render() {
        const walletAssetInfo = this.getWalletAssetInfo();
        return (
            <div className='AElf-Wallet'>
                <div className='AElf-Wallet-head'>
                    <div className='AElf-Wallet-title'>
                        {this.props.title}
                    </div>
                    <div className='AElf-Wallet-create'>
                        {/* <Button title='+ New Wallet' /> */}
                    </div>
                </div>
                <Spin
                    tip={this.state.loadingTip}
                    size='large'
                    spinning={this.state.loading}
                >
                    <div className='AElf-Wallet-body'>
                    <Row>
                        <Col span='22'>
                                <RadioGroup
                                    onChange={this.changeRadio.bind(this)}
                                    value={JSON.parse(localStorage.currentWallet).address}
                                    className='AElf-Wallet-info'
                                >
                                    {walletAssetInfo}
                                </RadioGroup>
                        </Col>
                        <Col span='2'>
                            <div onClick={this.onRefresh.bind(this)}>
                                <Svg
                                    className={this.state.loading ? 'refresh-animate' : ''}
                                    icon='refresh'
                                    style={{marginTop: '30px', width: '60px', height: '45px', float: 'right'}}
                                />
                            </div>
                        </Col>
                    </Row>
                    </div>
                </Spin>
            </div>
        );
    }
}
