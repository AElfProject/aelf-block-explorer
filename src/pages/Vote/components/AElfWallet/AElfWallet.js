/**
 * @file AElfWallet
 * @author zhouminghui
 * // TODO waiting for web extension
*/

import React, {PureComponent} from 'react';
import {Row, Col, Spin, message} from 'antd';
import contractChange from '../../../../utils/contractChange';
import Button from '../../../../components/Button/Button';
import Svg from '../../../../components/Svg/Svg';
import {aelf} from '../../../../utils';
import getPublicKey from '../../../../utils/getPublicKey';
import getStateJudgment from '../../../../utils/getStateJudgment';
import './AElfWallet.less';


export default class AElfWallet extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentWallet: this.props.currentWallet || null,
            refresh: 0,
            loading: false,
            loadingTip: null,
            consensus: this.props.consensus,
            dividends: this.props.dividends,
            tokenContract: this.props.tokenContract,
            consensusLoad: false,
            contracts: this.props.contracts,
            dividendsLoad: false,
            tokenLoad: false,
            nightElf: this.props.nightElf,
            balanceNum: null,
            ticketsNum: null,
            dividendsNum: null,
            appName: this.props.appName
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

        if (props.nightElf !== state.nightElf) {
            return {
                nightElf: props.nightElf
            };
        }
        if (props.tokenContract !== state.tokenContract) {
            return {
                tokenContract: props.tokenContract
            };
        }
        if (props.contracts !== state.contracts) {
            return {
                contracts: props.contracts
            };
        }
        return null;
    }

    componentDidMount() {
        const {consensus, dividends, tokenContract} = this.state;
        if (consensus) {
            this.pushWalletTicket();
        }
        if (dividends) {
            this.pushWalletDividends();
        }

        if (tokenContract) {
            this.pushWalletBalance();
        }
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
        let {currentWallet} = this.state;
        if (currentWallet) {
            const key = getPublicKey(currentWallet.publicKey);
            return new Promise((resolve, reject) => {
                dividends.GetAllAvailableDividends.call({hex: key}, (error, result) => {
                    if (result) {
                        const {
                            Value,
                            value
                        } = result;
                        const content = Value || value || 0;
                        this.setState({
                            dividendsNum: parseInt(content, 10).toLocaleString()
                        });
                    }
                    resolve(true);
                });
            });
        }
        this.props.hideWallet();
    }

    pushWalletBalance() {
        const {tokenContract} = this.state;
        let {currentWallet} = this.state;
        if (currentWallet) {
            return new Promise((resolve, reject) => {
                tokenContract.GetBalance.call({symbol: 'ELF', owner: currentWallet.address}, (error, result) => {
                    if (result) {
                        this.setState({
                            balanceNum: result.balance || 0,
                            resourceReady: this.state.resourceReady + 1
                        });
                    }
                    resolve(true);
                });
            });
        }
        this.props.hideWallet();
    }

    pushWalletTicket = async () => {
        const {consensus} = this.state;
        let {currentWallet} = this.state;
        if (currentWallet) {
            const key = getPublicKey(currentWallet.publicKey);
            return new Promise((resolve, reject) => {
                consensus.GetTicketsInformation.call({hex: key}, (error, result) => {
                    if (result) {
                        let tickets = result.VotingRecords || [];
                        let ticket = 0;
                        tickets.map((item, index) => {
                            if (item.From === key) {
                                let IsWithdrawn = item.IsWithdrawn || false;
                                IsWithdrawn ? ticket : ticket += parseInt(item.Count, 10);
                            }
                        });
                        this.setState({
                            ticketsNum: ticket
                        });
                    }
                    resolve(true);
                });
            });
        }
        this.props.hideWallet();
    }

    getAllDividends() {
        // GetAllDividends
        const {contracts, appName, nightElf} = this.state;
        if (contracts) {
            const currentWallet = JSON.parse(localStorage.currentWallet);
            nightElf.checkPermission({
                appName,
                type: 'address',
                address: currentWallet.address
            }, (error, result) => {
                if (result && result.error === 0) {
                    this.toAllDividends(result);
                }
            });
        }
        else {
            message.info('Please wait......', 3);
        }
    }

    toAllDividends(result) {
        const {appName, nightElf} = this.state;
        const currentWallet = JSON.parse(localStorage.currentWallet);
        if (result.error && result.error !== 0) {
            message.warning(result.errorMessage.message, 3);
            this.setState({
                loading: false
            });
            this.props.hideWallet();
            return;
        }
        contractChange(nightElf, result, currentWallet, appName).then(result => {
            if (!result) {
                this.getDefaultContract();
            }
            else {
                message.info('Contract renewal completed...', 3);
            }
        });
    }

    getDefaultContract() {
        const {contracts, nightElf} = this.state;
        const currentWallet = JSON.parse(localStorage.currentWallet);
        const wallet = {
            address: currentWallet.address
        };
        nightElf.chain.contractAtAsync(
            contracts.consensusDPoS,
            wallet,
            (err, result) => {
                if (result) {
                    result.ReceiveAllDividends((error, result) => {
                        if (result.error && result.error !== 0) {
                            message.error(result.errorMessage.message, 3);
                            return;
                        }
                        this.checkDividendsTx(result);
                    });
                }
            }
        );
    }

    checkDividendsTx(result) {
        this.setState({
            loading: true
        });
        const transactionId = result.result ? result.result.TransactionId : result.TransactionId;
        setTimeout(() => {
            const state = aelf.chain.getTxResult(transactionId);
            getStateJudgment(state.Status, transactionId);
            Promise.all([
                this.pushWalletBalance(),
                this.pushWalletTicket(),
                this.pushWalletDividends()
            ]).finally(() => {
                this.setState({
                    loading: false
                });
            });
        }, 4000);
    }

    componentWillUnmount() {
        this.setState = function () {};
    }

    onRefresh = async () => {
        const {appName, nightElf} = this.state;
        this.setState({
            loadingTip: 'Loading......'
        });
        if (!this.state.isRefresh) {
            this.setState({
                loading: true
            });
            nightElf.getAddress({
                appName
            }, (error, result) => {
                if (result && result.error === 0) {
                    if (result.addressList.length) {
                        let hasWallet = false;
                        result.addressList.map(item => {
                            if (item.address === JSON.parse(localStorage.currentWallet).address) {
                                hasWallet = true;
                            }
                        });
                        if (!hasWallet) {
                            this.setState({
                                loading: false
                            });
                            this.props.hideWallet();
                        }
                    }
                    else {
                        this.setState({
                            loading: false
                        });
                        this.props.hideWallet();
                        return;
                    }
                    if (result.error !== 0) {
                        message.warning(result.errorMessage.message, 3);
                        this.setState({
                            loading: false
                        });
                        this.props.hideWallet();
                    }
                    else {
                        this.setState({
                            currentWallet: JSON.parse(localStorage.currentWallet)
                        });

                        Promise.all([
                            this.pushWalletBalance(),
                            this.pushWalletTicket(),
                            this.pushWalletDividends()
                        ]).finally(() => {
                            console.log('4');
                            this.setState({
                                loading: false
                            });
                        });
                    }
                }
            });
        }
    }

    renderWalletAssetInfo() {
        const {currentWallet, balanceNum, ticketsNum, dividendsNum} = this.state;
        if (currentWallet) {
            let balance = !!balanceNum ? parseInt(balanceNum, 10).toLocaleString() : '-';
            let tickets = !!ticketsNum ? ticketsNum.toLocaleString() : '-';
            let dividends = !!dividendsNum ? dividendsNum.toLocaleString() : '-';
            return (
                <Row key={currentWallet.address} type='flex' align='middle' style={{padding: '10px 0'}} className='wallet-info'>
                    <Col xl={6} xs={8} >
                        <span className='item-name'> {currentWallet.name}</span>
                    </Col>
                    <Col xl={6} xs={8}>
                        <span className='item-name'>Balances: </span>
                        <span className='total-assets'> {balance}</span>
                    </Col>
                    <Col xl={6} xs={8}>
                        <span className='item-name'>Votes: </span>
                        <span className='total-votes'> {tickets}</span>
                    </Col>
                    <Col xl={6} xs={8}>
                        <span className='item-name'>Dividends: </span>
                        <span className='pending-dividend'> {dividends}</span>
                        <Button
                            title='Receive'
                            click={this.getAllDividends.bind(this)}
                        />
                    </Col>
                </Row>
            );
        }
    }

    render() {
        const walletAssetInfo = this.renderWalletAssetInfo();
        return (
            <div className='AElf-Wallet'>
                <div className='AElf-Wallet-head'>
                    <div className='AElf-Wallet-title'>
                        {this.props.title}
                    </div>
                </div>
                <Spin
                    tip={this.state.loadingTip}
                    size='large'
                    spinning={this.state.loading}
                >
                    <div className='AElf-Wallet-body'>
                    <Row>
                        <Col span={22}>
                            {walletAssetInfo}
                        </Col>
                        <Col span={2}>
                            <div onClick={this.onRefresh.bind(this)}>
                                <Svg
                                    className={this.state.loading ? 'refresh-animate' : ''}
                                    icon='refresh'
                                    style={{width: '60px', height: '45px', float: 'right'}}
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
