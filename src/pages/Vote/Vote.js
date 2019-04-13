/**
 * @file
 * @author huangzongzhe  zhouminghui
 * 233333
 * TODO: Vote Resource To migrate out of Application
*/

import React, {Component} from 'react';
import {Row, Col, message} from 'antd';
import {aelf} from '../../utils';
import {DEFAUTRPCSERVER, APPNAME} from '../../../config/config';
import DownloadPlugins from '../../components/DownloadPlugins/DownloadPlugins';
import ContainerRichard from '../../components/ContainerRichard/ContainerRichard';
import VotingYieldChart from './components/VotingYieldChart/VotingYieldChart';
import AElfWallet from './components/AElfWallet/AElfWallet';
import VotingModule from './components/VotingModule/VotingModule';
import Svg from '../../components/Svg/Svg';
import getLogin from '../../utils/getLogin';
import checkPermissionRepeat from '../../utils/checkPermissionRepeat';
import getContractAddress from '../../utils/getContractAddress';
import NightElfCheck from '../../utils/NightElfCheck';
import './Vote.styles.less';

let nightElf;
const appName = APPNAME;
export default class VotePage extends Component {

    // currenrWallet 默认应该取第一个钱包 因为 Wallet 和 VoteList 都需要钱包的信息
    constructor(props) {
        super(props);
        this.informationTimer;
        this.chainInfo = null;
        this.information = [{
            title: 'Voter Turnout',
            info: '-',
            icon: 'people_counting'
        },
        {
            title: 'Ballot Count',
            info: '-',
            icon: 'poll'
        },
        {
            title: 'Bonus Pool',
            info: '-',
            icon: 'fenhong_icon'
        }];

        this.state = {
            currentWallet: null,
            information: this.information,
            contracts: null,
            consensus: null,
            dividends: null,
            tokenContract: null,
            showDownloadPlugins: false,
            showWallet: false,
            nightElf: null
        };
    }

    componentDidMount() {
        let httpProvider = DEFAUTRPCSERVER;
        // getContract
        getContractAddress().then(result => {
            this.setState({
                contracts: result
            });
            if (!result.chainInfo) {
                message.error('The chain has stopped or cannot be connected to the chain. Please check your network or contact us.', 10);
                return;
            }
            aelf.chain.contractAtAsync(result.consensusDPoS, result.wallet, (error, result) => {
                console.log('consensusDPoS', result);
                this.setState({
                    consensus: result
                });
                this.chainInfo = result;
                this.getInformation(result);
            });

            aelf.chain.contractAtAsync(result.dividends, result.wallet, (error, result) => {
                console.log('dividends', result);
                this.setState({
                    dividends: result
                });
            });

            aelf.chain.contractAtAsync(result.multiToken, result.wallet, (error, result) => {
                console.log('multiToken', result);
                this.setState({
                    tokenContract: result
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
                    nightElf.chain.getChainInformation((error, result) => {
                        if (result) {
                            nightElf.checkPermission({
                                appName,
                                type: 'domain'
                            }, (error, result) => {
                                if (result) {
                                    this.insertKeypairs(result);
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

    // EXPLAIN: Update browser keypair status
    insertKeypairs(result) {
        const {nightElf} = this.state;
        const getLoginPayload = {
            appName,
            connectChain: this.chainInfo
        };
        if (result && result.error === 0) {
            const {
                permissions
            } = result;
            const payload = {
                appName,
                connectChain: this.chainInfo,
                result
            };
            if (permissions.length) {
                // EXPLAIN: Need to redefine this scope
                checkPermissionRepeat(nightElf, payload, this.getNightElfKeypair.bind(this));
            }
            else {
                localStorage.setItem('currentWallet', null);
                getLogin(nightElf, getLoginPayload, result => {
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
        }
        else {
            message.error(result.errorMessage.message, 3);
        }
    }

    getNightElfKeypair(address) {
        const {nightElf} = this.state;
        if (address) {
            nightElf.getAddress({
                appName
            }, (error, result) => {
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

    getInformation(consensus) {
        const {information} = this.state;
        consensus.GetVotesCount.call((error, result) => {
            if (result && !result.error) {
                let temp = information;
                // temp[0].info = hexToArrayBuffer(result).toLocaleString();
                const {value, Value} = result;
                temp[0].info = parseInt(Value || value, 10).toLocaleString() || null;
                this.setState({
                    information: temp
                });
            }
        });

        consensus.GetTicketsCount.call((error, result) => {
            if (result && !result.error) {
                let temp = information;
                // temp[1].info = hexToArrayBuffer(result).toLocaleString();
                const {value, Value} = result;
                temp[1].info = parseInt(Value || value, 10).toLocaleString() || null;
                this.setState({
                    information: temp
                });
            }
        });
        consensus.QueryCurrentDividends.call((error, result) => {
            // 分红池更新时没有值, 取上一次接口的信息 如果都没有 取 0
            if (result && !result.error) {
                let temp = information;
                const {value, Value} = result;
                temp[2].info = parseInt(Value || value, 10).toLocaleString() || null;
                localStorage.setItem('CurrentDividends', temp[2].info);
                this.setState({
                    information: temp
                });
            }
            else {
                let temp = information;
                temp[2].info = localStorage.getItem('CurrentDividends') || 0;
                this.setState({
                    information: temp
                });
            }
        });

        this.informationTimer = setTimeout(() => {
            this.getInformation(consensus);
        }, 60000);
    }

    componentWillUnmount() {
        clearTimeout(this.informationTimer);
        this.setState = () => {};
    }

    hideWallet() {
        this.setState({
            showWallet: false
        });
    }

    getCurrentWallet() {
        this.setState({
            currentWallet: JSON.parse(localStorage.currentWallet)
        });
    }

    renderVoteInformation() {
        const VoteHtml = this.state.information.map(item =>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}
                     className='vote-info-con'
                     key={item.title + Math.random()}
                >
                    <ContainerRichard type='small'>
                        <div
                            className='vote-info-content-con'
                        >
                            <div className='vote-info-title'>
                                <Svg
                                    icon={item.icon}
                                    style={{width: '20px', height: '20px', display: 'inline-block', margin: '5px 5px'}}
                                />
                                {item.title}
                            </div>
                            <div className='vote-info-num'>{item.info || '-'}</div>
                        </div>
                    </ContainerRichard>
                </Col>
        );
        return VoteHtml;
    }

    getDownloadPluginsHTML() {
        return <DownloadPlugins />;
    }

    getAElfWallet() {
        const {
            showWallet,
            currentWallet,
            consensus,
            dividends,
            tokenContract,
            contracts,
            nightElf
        } = this.state;
        if (showWallet) {
            return <AElfWallet
                title='AElf Wallet'
                currentWallet={currentWallet}
                getCurrentWallet={this.getCurrentWallet.bind(this)}
                hideWallet={this.hideWallet.bind(this)}
                consensus={consensus}
                dividends={dividends}
                contracts={contracts}
                tokenContract={tokenContract}
                nightElf={nightElf}
                appName={appName}
            />;
        }
    }

    render() {
        const {consensus, showDownloadPlugins, currentWallet, dividends, contracts, nightElf} = this.state;
        const VoteHtml = this.renderVoteInformation();
        const aelfWalletHTML = this.getAElfWallet();
        let downloadPlugins = null;
        if (showDownloadPlugins) {
            downloadPlugins = this.getDownloadPluginsHTML();
        }
        return (
            <div className='VotePage'>
                {downloadPlugins}
                <div className='Voting-information'>
                    <Row type="flex" justify="space-between">
                        {VoteHtml}
                    </Row>
                </div>
                <VotingYieldChart title='Historical voting gains' dividends={dividends}/>
                {aelfWalletHTML}
                <div className='vote-box' >
                    <VotingModule
                        currentWallet={currentWallet}
                        consensus={consensus}
                        contracts={contracts}
                        nightElf={nightElf}
                        appName={appName}
                    />
                </div>
            </div>
            // <div className='apps-page-container'>AELF Applications List Page.</div>
        );
    }
}
