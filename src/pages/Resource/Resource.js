/**
 * @file
 * @author huangzongzhe  zhouminghui
 * 233333
 * TODO: Vote && Resource To migrate out of Application
*/

import React, {Component} from 'react';
import DownloadPlugins from '../../components/DownloadPlugins/DownloadPlugins';
import ResourceAElfWallet from '../../components/ResourceAElfWallet/ResourceAElfWallet';
import {commonPrivateKey, DEFAUTRPCSERVER, resourceAddress} from '../../../config/config';
import {message} from 'antd';
import NightElfCheck from '../../utils/NightElfCheck';
import {aelf} from '../../utils';
import getContractAddress from '../../utils/getContractAddress.js';
import ResourceMoneyMarket from '../../components/ResourceMoneyMarket/ResourceMoneyMarket';
// import ResourceTransacitionDetails from '../../components/ResourceTransacitionDetails/ResourceTransacitionDetails';
import './Resource.less';
export default class Resource extends Component {
    constructor(props) {
        super(props);
        this.informationTimer;
        let wallet = null;
        if (localStorage.currentWallet == null) {
            wallet = {
                address: '',
                name: '',
                privateKey: commonPrivateKey,
                publicKey: ''
            };
            localStorage.setItem('currentWallet', JSON.stringify(wallet));
        }
        this.state = {
            currentWallet: wallet,
            contracts: null,
            tokenContract: null,
            resourceContract: null,
            showDownloadPlugins: false,
            walletInfoList: null,
            showWallet: false,
            currentBalance: 0,
            currentCpu: 0,
            currentRam: 0,
            currentNet: 0,
            currentSto: 0,
            loading: false
        };
    }

    componentDidMount() {
        let {showWallet} = this.state;
        let httpProvider = DEFAUTRPCSERVER;
        getContractAddress().then(result => {
            this.setState({
                contracts: result
            });
            aelf.chain.contractAtAsync(result.TOKENADDRESS, result.wallet, (error, result) => {
                this.setState({
                    tokenContract: result
                });
            });
            aelf.chain.contractAtAsync(resourceAddress, result.wallet, (error, result) => {
                this.setState({
                    resourceContract: result
                });
            });
        });
        NightElfCheck.getInstance().check.then(result => {
            if (result) {
                window.NightElf.api({
                    appName: 'hzzTest',
                    method: 'CONNECT_AELF_CHAIN',
                    hostname: 'aelf.io', // TODO: 这个需要content.js 主动获取
                    payload: {
                        httpProvider
                    }
                }).then(result => {
                    window.NightElf.api({
                        appName: 'hzzTest',
                        method: 'GET_ADDRESS'
                    }).then(result => {
                        if (result.error === 200005) {
                            let wallet = {
                                address: '',
                                name: '',
                                privateKey: commonPrivateKey,
                                publicKey: ''
                            };
                            localStorage.setItem('currentWallet', JSON.stringify(wallet));
                            message.error(result.errorMessage.message, 5);
                            showWallet = false;
                        }
                        else if (result.addressList.length !== 0) {
                            localStorage.setItem('walletInfoList', JSON.stringify(result.addressList));
                            if (localStorage.getItem('currentWallet') === null) {
                                localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
                            }
                            if (JSON.parse(localStorage.getItem('currentWallet')).name === '') {
                                localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
                            }
                            showWallet = true;
                        }
                        else {
                            let wallet = {
                                address: '',
                                name: '',
                                privateKey: commonPrivateKey,
                                publicKey: ''
                            };
                            localStorage.setItem('currentWallet', JSON.stringify(wallet));
                            localStorage.setItem('walletInfoList', '');
                            showWallet = false;
                        }
                        this.setState({
                            showWallet,
                            currentWallet: JSON.parse(localStorage.currentWallet),
                            walletInfoList: result.addressList
                        });
                    });
                });
            }
        }).catch(err => {
            this.setState({
                showDownloadPlugins: true
            });
        });
    }

    componentWillUnmount() {
        this.setState = function () {};
    }

    getCurrentBalance(value) {
        this.setState({
            currentBalance: value
        });
    }

    getCurrentCpu(value) {
        this.setState({
            currentCpu: value
        });
    }

    getCurrentRam(value) {
        this.setState({
            currentRam: value
        });
    }

    getCurrentNet(value) {
        this.setState({
            currentNet: value
        });
    }

    getCurrentSto(value) {
        this.setState({
            currentSto: value
        });
    }

    getDownloadPluginsHTML() {
        return <DownloadPlugins />;
    }

    getChangeWallet() {
        this.setState({
            currentWallet: JSON.parse(localStorage.currentWallet)
        });
    }

    onRefresh() {
        let {showWallet} = this.state;
        window.NightElf.api({
            appName: 'hzzTest',
            method: 'GET_ADDRESS'
        }).then(result => {
            if (result.error === 200005) {
                let wallet = {
                    address: '',
                    name: '',
                    privateKey: commonPrivateKey,
                    publicKey: ''
                };
                localStorage.setItem('currentWallet', JSON.stringify(wallet));
                message.error(result.errorMessage.message, 5);
                showWallet = false;
            }
            else if (result.addressList.length !== 0) {
                localStorage.setItem('walletInfoList', JSON.stringify(result.addressList));
                if (localStorage.getItem('currentWallet') === null) {
                    localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
                }
                if (JSON.parse(localStorage.getItem('currentWallet')).name === '') {
                    localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
                }
                showWallet = true;
            }
            else {
                let wallet = {
                    address: '',
                    name: '',
                    privateKey: commonPrivateKey,
                    publicKey: ''
                };
                localStorage.setItem('currentWallet', JSON.stringify(wallet));
                localStorage.setItem('walletInfoList', '');
                showWallet = false;
            }
            this.setState({
                showWallet,
                currentWallet: JSON.parse(localStorage.currentWallet),
                walletInfoList: result.addressList,
                loading: true
            });
        });
    }

    endRefresh() {
        this.setState({
            loading: false
        });
    }

    resourceAElfWalletHtml() {
        const {showWallet, walletInfoList, tokenContract, resourceContract, loading} = this.state;
        if (showWallet) {
            return (
                <ResourceAElfWallet
                    title='AElf Wallet'
                    getChangeWallet={this.getChangeWallet.bind(this)}
                    walletInfoList={walletInfoList}
                    tokenContract={tokenContract}
                    resourceContract={resourceContract}
                    getCurrentBalance={this.getCurrentBalance.bind(this)}
                    getCurrentCpu={this.getCurrentCpu.bind(this)}
                    getCurrentRam={this.getCurrentRam.bind(this)}
                    getCurrentNet={this.getCurrentNet.bind(this)}
                    getCurrentSto={this.getCurrentSto.bind(this)}
                    onRefresh={this.onRefresh.bind(this)}
                    endRefresh={this.endRefresh.bind(this)}
                    loading={loading}
                />
            );
        }
    }
    render() {
        const {showDownloadPlugins, currentWallet, contracts, tokenContract, resourceContract} = this.state;
        const {currentBalance, currentCpu, currentRam, currentNet, currentSto} = this.state;
        let account = {
            balabce: currentBalance,
            CPU: currentCpu,
            RAM: currentRam,
            NET: currentNet,
            STO: currentSto
        };
        let downloadPlugins = null;
        if (showDownloadPlugins) {
            downloadPlugins = this.getDownloadPluginsHTML();
        }
        const resourceAElfWalletHtml = this.resourceAElfWalletHtml();
        // const {currentWallet, voteContracts} = this.state;
        return (
            <div>
                {downloadPlugins}
                {resourceAElfWalletHtml}
                <div className='resource-money-market'>
                    <ResourceMoneyMarket
                        currentWallet={currentWallet}
                        contracts={contracts}
                        tokenContract={tokenContract}
                        resourceContract={resourceContract}
                        account={account}
                        onRefresh={this.onRefresh.bind(this)}
                        endRefresh={this.endRefresh.bind(this)}
                    />
                </div>
                {/* <ResourceTransacitionDetails /> */}
            </div>
        );
    }
}
