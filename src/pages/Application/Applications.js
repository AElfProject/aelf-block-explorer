/**
 * @file
 * @author huangzongzhe  zhouminghui
 * 233333
 * TODO: Vote Resource To migrate out of Application
*/

import React, {Component} from 'react';
import {Row, Col, message} from 'antd';
import {DEFAUTRPCSERVER} from '../../../config/config';
import {aelf} from '../../utils';
import DownloadPlugins from '../../components/DownloadPlugins/DownloadPlugins';
import ContainerRichard from '../../components/ContainerRichard/ContainerRichard';
import VotingYieldChart from '../../components/VotingYieldChart/VotingYieldChart';
import AElfWallet from '../../components/AElfWallet/AElfWallet';
import VotingModule from '../../components/VotingModule/VotingModule';
import Svg from '../../components/Svg/Svg';
import {commonPrivateKey} from '../../../config/config';
import voteContracts from '../../utils/voteContracts';
import getHexNumber from '../../utils/getHexNumber';
import getContractAddress from '../../utils/getContractAddress';
import NightElfCheck from '../../utils/NightElfCheck';
import './apps.styles.less';
export default class ApplicationPage extends Component {

    // currenrWallet 默认应该取第一个钱包 因为 Wallet 和 VoteList 都需要钱包的信息
    constructor(props) {
        super(props);
        this.informationTimer;
        let wallet = null;
        if (localStorage.currentWallet.length === 0) {
            wallet = {
                address: '',
                walletName: '',
                privateKey: commonPrivateKey,
                publicKey: ''
            };
        }
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
            currentWallet: wallet,
            information: this.information,
            contracts: null,
            showDownloadPlugins: false,
            showWallet: false
        };
    }

    componentDidMount() {
        let httpProvider = DEFAUTRPCSERVER;
        NightElfCheck.getInstance().check.then(item => {
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
                    let showWallet = null;
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
            }).then(() => {
                getContractAddress().then(result => {
                    this.setState({
                        contracts: result
                    });
                }).then(() => {
                    this.getInformation();
                });
            }).catch(error => {
                this.setState({
                    showDownloadPlugins: true
                });
            });
        }).catch(error => {
            console.log(error);
        }).then(() => {
            getContractAddress().then(result => {
                this.setState({
                    contracts: result
                });
            }).then(() => {
                this.getInformation();
            });
        });
    }

    componentWillUnMount() {
        clearTimeout(this.informationTimer);
    }

    getInformation() {
        const {information} = this.state;
        this.getVotesCount().then(result => {
            let temp = information;
            temp[0].info = result;
            this.setState({
                information: temp
            });
            this.getTicketsCount().then(result => {
                let temp = information;
                temp[1].info = result;
                this.setState({
                    information: temp
                });
                this.queryCurrentDividends().then(result => {
                    let temp = information;
                    temp[2].info = result;
                    this.setState({
                        information: temp
                    });
                });
            });
        });
        this.informationTimer = setTimeout(() => {
            this.getInformation();
        }, 60000);
    }

    getVotesCount = async () => {
        const {contracts} = this.state;
        return getHexNumber(contracts.consensus.GetVotesCount().return).toLocaleString();
    }

    getTicketsCount = async () => {
        const {contracts} = this.state;
        return getHexNumber(contracts.consensus.GetTicketsCount().return).toLocaleString();
    }

    queryCurrentDividends = async () => {
        const {contracts} = this.state;
        return getHexNumber(contracts.consensus.QueryCurrentDividends().return).toLocaleString();
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
        const {contracts, showWallet, walletInfoList} = this.state;
        if (showWallet) {
            return <AElfWallet
                title='AElf Wallet'
                walletInfoList={walletInfoList}
                getCurrentWallet={this.getCurrentWallet.bind(this)}
                contracts={contracts}
            />;
        }
    }

    getCurrentWallet() {
        this.setState({
            currentWallet: JSON.parse(localStorage.currentWallet)
        });
    }

    render() {
        const {contracts, showDownloadPlugins, currentWallet} = this.state;
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
                <VotingYieldChart title='Historical voting gains' contracts={contracts}/>
                {aelfWalletHTML}
                <div className='vote-box' >
                    <VotingModule
                        currentWallet={currentWallet}
                        contracts={contracts}
                    />
                </div>
            </div>
            // <div className='apps-page-container'>AELF Applications List Page.</div>
        );
    }
}
