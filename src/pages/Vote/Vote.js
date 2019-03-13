/**
 * @file
 * @author huangzongzhe  zhouminghui
 * 233333
 * TODO: Vote Resource To migrate out of Application
*/

import React, {Component} from 'react';
import {Row, Col, message} from 'antd';
import proto from 'protobufjs';
import {aelf} from '../../utils';
import {DEFAUTRPCSERVER} from '../../../config/config';
import DownloadPlugins from '../../components/DownloadPlugins/DownloadPlugins';
import ContainerRichard from '../../components/ContainerRichard/ContainerRichard';
import VotingYieldChart from './components/VotingYieldChart/VotingYieldChart';
import AElfWallet from './components/AElfWallet/AElfWallet';
import VotingModule from './components/VotingModule/VotingModule';
import Svg from '../../components/Svg/Svg';
import getLogin from '../../utils/getLogin';
import checkPermissionRepeat from '../../utils/checkPermissionRepeat';
import hexToArrayBuffer from '../../utils/hexToArrayBuffer';
import getContractAddress from '../../utils/getContractAddress';
import NightElfCheck from '../../utils/NightElfCheck';

import './Vote.styles.less';

let nightElf;
const appName = 'aelf.io';
export default class VotePage extends Component {

    // currenrWallet 默认应该取第一个钱包 因为 Wallet 和 VoteList 都需要钱包的信息
    constructor(props) {
        super(props);
        this.informationTimer;
        this.connectChain = null;
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
            aelf.chain.contractAtAsync(result.CONSENSUSADDRESS, result.wallet, (error, result) => {
                // console.log(result);
                this.setState({
                    consensus: result
                });
                this.getInformation(result);
            });

            aelf.chain.contractAtAsync(result.DIVIDENDSADDRESS, result.wallet, (error, result) => {
                this.setState({
                    dividends: result
                });
            });

            aelf.chain.contractAtAsync(result.TOKENADDRESS, result.wallet, (error, result) => {
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
                    nightElf.chain.connectChain((error, result) => {
                        if (result.error) {
                            message.error(result.errorMessage.message, 3);
                            return;
                        }
                        if (result) {
                            this.connectChain = result;
                            window.NightElf.api({
                                appName,
                                method: 'CHECK_PERMISSION',
                                type: 'domain'
                            }).then(result => {
                                this.insertKeypairs(result);
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
        const getLoginPayload = {
            appName,
            connectChain: this.connectChain
        };
        if (result && result.error === 0) {
            const {
                permissions
            } = result;
            const payload = {
                appName,
                connectChain: this.connectChain,
                result
            };
            if (permissions.length) {
                // EXPLAIN: Need to redefine this scope
                checkPermissionRepeat(payload, this.getNightElfKeypair.bind(this));
            }
            else {
                localStorage.setItem('currentWallet', null);
                getLogin(getLoginPayload, result => {
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

    getInformation(consensus) {
        const {information} = this.state;
        consensus.GetVotesCount((error, result) => {
            let temp = information;

            // temp[0].info = getHexNumber(result.return).toLocaleString();
            temp[0].info = new proto.Reader(hexToArrayBuffer(result)).uint64();
            this.setState({
                information: temp
            });
        });

        consensus.GetTicketsCount((error, result) => {
            let temp = information;
            temp[1].info = new proto.Reader(hexToArrayBuffer(result)).uint64();
            this.setState({
                information: temp
            });
        });

        consensus.QueryCurrentDividends((error, result) => {
            let temp = information;
            console.log(hexToArrayBuffer(result));
            temp[2].info = new proto.Reader(hexToArrayBuffer(result)).uint64();
            this.setState({
                information: temp
            });
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
                            <div className='vote-info-num'>{item.info.toLocaleString() || '-'}</div>
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
                {/* {aelfWalletHTML} */}
                {/* <div className='vote-box' >
                    <VotingModule
                        currentWallet={currentWallet}
                        consensus={consensus}
                        contracts={contracts}
                        nightElf={nightElf}
                    />
                </div> */}
            </div>
            // <div className='apps-page-container'>AELF Applications List Page.</div>
        );
    }
}
