/**
 * @file
 * @author huangzongzhe  zhouminghui
 * 233333
 * TODO: Vote && Resource To migrate out of Application
*/

import React, {Component} from 'react';
import {message} from 'antd';
import {aelf} from '../../utils';
import {DEFAUTRPCSERVER, resourceAddress} from '../../../config/config';
import DownloadPlugins from '../../components/DownloadPlugins/DownloadPlugins';
import ResourceAElfWallet from './components/ResourceAElfWallet/ResourceAElfWallet';
import NightElfCheck from '../../utils/NightElfCheck';
import getContractAddress from '../../utils/getContractAddress.js';
import ResourceMoneyMarket from './components/ResourceMoneyMarket/ResourceMoneyMarket';
// import ResourceTransacitionDetails from '../../components/ResourceTransacitionDetails/ResourceTransacitionDetails';
import './Resource.less';

const appName = 'aelf.io';
let nightElf;
export default class Resource extends Component {
    constructor(props) {
        super(props);
        this.informationTimer;
        let wallet = null;
        // if (localStorage.currentWallet == null) {
        //     wallet = {
        //         address: '',
        //         name: '',
        //         privateKey: commonPrivateKey,
        //         publicKey: ''
        //     };
        //     localStorage.setItem('currentWallet', JSON.stringify(wallet));
        // }
        this.state = {
            currentWallet: wallet,
            contracts: null,
            tokenContract: null,
            resourceContract: null,
            showDownloadPlugins: false,
            showWallet: false,
            currentBalance: 0,
            currentCpu: 0,
            currentRam: 0,
            currentNet: 0,
            currentSto: 0,
            loading: false,
            nightElf: null
        };
    }

    componentDidMount() {
        let httpProvider = DEFAUTRPCSERVER;
        getContractAddress().then(result => {
            let contracts = result;
            contracts['RESOURCEADDRESS'] = resourceAddress;
            this.setState({
                contracts
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
        // getExtensionKeypairList
        NightElfCheck.getInstance().check.then(item => {
            if (item) {
                nightElf = new window.NightElf.AElf({
                    httpProvider,
                    appName // TODO: 这个需要content.js 主动获取
                });
                if (nightElf) {
                    this.setState({
                        nightElf
                    });
                    nightElf.chain.connectChain((error, result) => {
                        if (result.error) {
                            message.error(result.errorMessage.message, 3);
                            return;
                        }
                        if (result) {
                            this.connectChain = result.result;
                            this.connectChain['AElf.Contracts.Resource'] = resourceAddress;
                            window.NightElf.api({
                                appName,
                                method: 'CHECK_PERMISSION',
                                type: 'domain'
                            }).then(result => {
                                if (result && result.error === 0) {
                                    const permissions = result.permissions;
                                    if (permissions.length) {
                                        this.checkPermissionRepeat(result);
                                    }
                                    else {
                                        localStorage.setItem('currentWallet', null);
                                        this.getLogin(result);
                                    }
                                }
                                else {
                                    message.error(result.errorMessage.message, 3);
                                }
                            });
                        }
                    });
                }
            }
        }).catch(error => {
            this.setState({
                showDownloadPlugins: true
            });
        });
    }

    componentWillUnmount() {
        this.setState = function () {};
    }

    checkPermissionRepeat(result) {
        const {permissions} = result;
        const {address} = permissions[0];
        this.getNightElfKeypair(address);
        const connectChain = JSON.stringify(this.connectChain);
        const permission = result.permissions.map(item => {
            if (item.appName === appName) {
                return item;
            }
        });
        permission[0].contracts.map(item => {
            if (connectChain.indexOf(item.contractAddress) === -1) {
                this.setNewPermission(address);
            }
        });
    }

    setNewPermission(address) {
        window.NightElf.api({
            appName,
            method: 'OPEN_PROMPT',
            chainId: 'AELF',
            hostname: 'aelf.io',
            payload: {
                // 在中间层会补齐
                // appName: 'hzzTest',
                // method 使用payload的
                // chainId: 'AELF',
                // hostname: 'aelf.io',
                payload: {
                    method: 'SET_CONTRACT_PERMISSION',
                    address,
                    contracts: [{
                        chainId: 'AELF',
                        // contractAddress: 'asdasdasdasdadasdasdasdasdasasdasd',
                        contractAddress: this.connectChain['AElf.Contracts.Token'],
                        contractName: 'token',
                        description: 'contract token'
                    }, {
                        chainId: 'AELF',
                        contractAddress: this.connectChain['AElf.Contracts.Dividends'],
                        contractName: 'dividends',
                        description: 'contract dividends'
                    }, {
                        chainId: 'AELF',
                        contractAddress: this.connectChain['AElf.Contracts.Consensus'],
                        contractName: 'consensus',
                        description: 'contract consensus'
                    },
                    {
                        chainId: 'AELF',
                        contractAddress: resourceAddress,
                        contractName: 'resource',
                        description: 'contract resource'
                    }]
                    // appName: message.appName,
                    // domain: message.hostname
                }
            }
        }).then(result => {
            console.log('>>>>>>>>>>>>>>>>>>>', result);
            if (result && result.error === 0) {
                message.success('Update Permission success!!', 3);
            }
            else {
                message.error(result.errorMessage.message, 3);
            }
        });
    }

    getLogin() {
        window.NightElf.api({
            appName,
            domain: 'aelf.io',
            method: 'LOGIN',
            payload: {
                payload: {
                    // appName: message.appName,
                    // domain: message.hostname
                    method: 'LOGIN',
                    contracts: [{
                        chainId: 'AELF',
                        // contractAddress: 'asdasdasdasdadasdasdasdasdasasdasd',
                        contractAddress: this.connectChain['AElf.Contracts.Token'],
                        contractName: 'token',
                        description: 'token contract'
                    }, {
                        chainId: 'AELF',
                        contractAddress: this.connectChain['AElf.Contracts.Dividends'],
                        contractName: 'dividends',
                        description: 'contract dividends'
                    }, {
                        chainId: 'AELF',
                        contractAddress: this.connectChain['AElf.Contracts.Consensus'],
                        contractName: 'consensus',
                        description: 'contract consensus'
                    },
                    {
                        chainId: 'AELF',
                        contractAddress: this.connectChain['AElf.Contracts.Resource'],
                        // contractAddress: 'asdasdasdasdadasdasdasdasdasasdasd',
                        contractName: 'resource',
                        description: 'contract resource'
                    }]
                }
            }
        }).then(result => {
            if (result && result.error === 0) {
                const address = JSON.parse(result.detail).address;
                this.getNightElfKeypair(address);
                message.success('Login success!!', 3);
            }
            else {
                this.setState({
                    showWallet: false
                });
                message.error(result.errorMessage.message, 3);
            }
        });
    }

    getNightElfKeypair(address) {
        if (address) {
            window.NightElf.api({
                appName,
                method: 'GET_ADDRESS'
            }).then(result => {
                const addressList = result.addressList || [];
                let currentWallet = null;
                addressList.map((item, index) => {
                    if (address === item.address) {
                        currentWallet = item;
                    }
                });
                localStorage.setItem('currentWallet', JSON.stringify(currentWallet));
                this.setState({
                    currentWallet,
                    showWallet: true
                });
            });
        }
    }

    // getNightElfKeypairList() {
    //     window.NightElf.api({
    //         appName: 'hzzTest',
    //         method: 'GET_ADDRESS'
    //     }).then(result => {
    //         let showWallet = null;
    //         if (result.error !== 0) {
    //             let wallet = {
    //                 address: '',
    //                 name: '',
    //                 privateKey: commonPrivateKey,
    //                 publicKey: ''
    //             };
    //             localStorage.setItem('currentWallet', JSON.stringify(wallet));
    //             message.warning(result.errorMessage.message, 5);
    //             showWallet = false;
    //         }
    //         else if (result.addressList.length !== 0) {
    //             localStorage.setItem('walletInfoList', JSON.stringify(result.addressList));
    //             if (localStorage.currentWallet === undefined) {
    //                 localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
    //             }
    //             if (JSON.parse(localStorage.currentWallet).name === '') {
    //                 localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
    //             }
    //             showWallet = true;
    //         }
    //         else {
    //             let wallet = {
    //                 address: '',
    //                 name: '',
    //                 privateKey: commonPrivateKey,
    //                 publicKey: ''
    //             };
    //             localStorage.setItem('currentWallet', JSON.stringify(wallet));
    //             showWallet = false;
    //         }
    //         this.setState({
    //             showWallet,
    //             currentWallet: JSON.parse(localStorage.currentWallet),
    //             walletInfoList: result.addressList
    //         });
    //     });
    // }

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
            if (result.error !== 0) {
                message.error(result.errorMessage.message, 5);
                showWallet = false;
            }
            else if (result.addressList.length !== 0) {
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
                    showWallet = false;
                    return;
                }
                showWallet = true;
            }
            else {
                localStorage.setItem('currentWallet', null);
                showWallet = false;
            }
            this.setState({
                showWallet,
                currentWallet: JSON.parse(localStorage.currentWallet),
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
                        nightElf={nightElf}
                    />
                </div>
                {/* <ResourceTransacitionDetails /> */}
            </div>
        );
    }
}
