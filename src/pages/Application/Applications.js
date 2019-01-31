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
import ResourceTransacitionDetails from '../../components/ResourceTransacitionDetails/ResourceTransacitionDetails';
import './apps.styles.less';

// const walletInfo = [
//     {
//         address: 'ELF_2MAwuUVHjRizZRJytbvSn7ZhZY1zud9KNkpovPBhzsYECqR',
//         walletName: 'TestWallet02',
//         privateKey: 'b28433783881f7c394077f9fbcdb07d96b2a8f95383142adb4919e7b5ff29f02',
//         publicKey: '049c0492f82ef7ab9915ee744f08da49145dc1c5b7564ce038fbdf8009a6ded27f5122032d219049c7322d68504eeb10969113b394595aa94a4279b7e3789a38c3'
//     },
//     {
//         address: 'ELF_4Ne3ytkQiFHkoaUpSp2Gsnb3GQMGdyS4u2ZJ6xjgkaJwpZX',
//         walletName: 'TestWallet01',
//         privateKey: '4b0aa4e7538aa1c0c09e3cf27d6b3d41de8ecb1e4213ffafeed72c9bcfce1315',
//         publicKey: '0401849b4b60917449e0ecc63e8a5b6f9f02a3796092e1a9ba4418f9e41f7b31945848e6cbe5ebe80be766d512db79c14fbb4ffd7227751fef34b99fb867486b73'
//     }
// ];

export default class ApplicationPage extends Component {
    constructor(props) {
        super(props);
        this.informationTimer;
        this.state = {
            currentWallet: JSON.parse(localStorage.currentWallet),
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
                                walletName: '',
                                privateKey: commonPrivateKey,
                                publicKey: ''
                            };
                            localStorage.setItem('currentWallet', JSON.stringify(wallet));
                            message.error(result.errorMessage.message, 5);
                            showWallet = false;
                        }
                        else if (result.addressList.length !== 0) {
                            localStorage.setItem('walletInfoList', JSON.stringify(result.addressList));
                            if (localStorage.currentWallet === undefined) {
                                localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
                            }
                            if (JSON.parse(localStorage.currentWallet).publicKey === '') {
                                localStorage.setItem('currentWallet', JSON.stringify(result.addressList[0]));
                            }
                            showWallet = true;
                        }
                        else {
                            let wallet = {
                                address: '',
                                walletName: '',
                                privateKey: commonPrivateKey,
                                publicKey: ''
                            };
                            localStorage.setItem('currentWallet', JSON.stringify(wallet));
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
        this.setState({
            loading: true
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
