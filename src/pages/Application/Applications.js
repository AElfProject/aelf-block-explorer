/**
 * @file
 * @author huangzongzhe  zhouminghui
 * 233333
 * TODO: Vote Resource To migrate out of Application
*/

import React, {Component} from 'react';
import {Row, Col} from 'antd';
import DownloadPlugins from '../../components/DownloadPlugins/DownloadPlugins';
import ContainerRichard from '../../components/ContainerRichard/ContainerRichard';
import VotingYieldChart from '../../components/VotingYieldChart/VotingYieldChart';
import AElfWallet from '../../components/AElfWallet/AElfWallet';
import VotingModule from '../../components/VotingModule/VotingModule';
import Svg from '../../components/Svg/Svg';
import {commonPrivateKey} from '../../../config/config';
import voteContracts from '../../utils/voteContracts';
import getHexNumber from '../../utils/getHexNumber';
import './apps.styles.less';

const walletInfo = [
    // {
    //     address: 'ELF_2MAwuUVHjRizZRJytbvSn7ZhZY1zud9KNkpovPBhzsYECqR',
    //     walletName: 'TestWallet02',
    //     privateKey: 'b28433783881f7c394077f9fbcdb07d96b2a8f95383142adb4919e7b5ff29f02',
    //     publicKey: '049c0492f82ef7ab9915ee744f08da49145dc1c5b7564ce038fbdf8009a6ded27f5122032d219049c7322d68504eeb10969113b394595aa94a4279b7e3789a38c3'
    // },
    // {
    //     address: 'ELF_4Ne3ytkQiFHkoaUpSp2Gsnb3GQMGdyS4u2ZJ6xjgkaJwpZX',
    //     walletName: 'TestWallet01',
    //     privateKey: '4b0aa4e7538aa1c0c09e3cf27d6b3d41de8ecb1e4213ffafeed72c9bcfce1315',
    //     publicKey: '0401849b4b60917449e0ecc63e8a5b6f9f02a3796092e1a9ba4418f9e41f7b31945848e6cbe5ebe80be766d512db79c14fbb4ffd7227751fef34b99fb867486b73'
    // }
];

export default class ApplicationPage extends Component {

    // currenrWallet 默认应该取第一个钱包 因为 Wallet 和 VoteList 都需要钱包的信息
    constructor(props) {
        super(props);
        if (walletInfo.length !== 0) {
            localStorage.setItem('walletInfoList', JSON.stringify(walletInfo));
            if (localStorage.currentWallet === undefined) {
                localStorage.setItem('currentWallet', JSON.stringify(walletInfo[0]));
            }
            if (JSON.parse(localStorage.currentWallet).publicKey === '') {
                localStorage.setItem('currentWallet', JSON.stringify(walletInfo[0]));
            }
        }
        else {
            let wallet = {
                address: '',
                walletName: '',
                privateKey: commonPrivateKey,
                publicKey: ''
            };
            localStorage.setItem('currentWallet', JSON.stringify(wallet));
        }

        this.informationTimer;
        this.information = [{
            title: 'Voter Turnout',
            info: null,
            icon: 'people_counting'
        },
        {
            title: 'Ballot Count',
            info: null,
            icon: 'poll'
        },
        {
            title: 'Bonus Pool',
            info: null,
            icon: 'fenhong_icon'
        }];

        this.state = {
            currentWallet: JSON.parse(localStorage.currentWallet),
            information: [],
            contracts: voteContracts()
        };
    }

    componentDidMount() {
        this.getInformation();
    }

    getAElfWallet() {
        const {contracts} = this.state;
        if (walletInfo.length > 0) {
            return <AElfWallet
            title='AElf Wallet'
            getCurrentWallet={this.getCurrentWallet.bind(this)}
            contracts={contracts}
        />;
        }
    }

    componentWillMount() {
        clearTimeout(this.informationTimer);
    }

    async getInformation() {
        const {contracts} = this.state;
        this.information[0].info = getHexNumber(contracts.consensus.GetVotesCount().return).toLocaleString();
        this.information[1].info = getHexNumber(contracts.consensus.GetTicketsCount().return).toLocaleString();
        this.information[2].info = getHexNumber(contracts.consensus.QueryCurrentDividends().return).toLocaleString();
        this.setState({
            information: this.information || []
        });
        this.informationTimer = setTimeout(() => {
            this.getInformation();
        }, 60000);
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
                            <div className='vote-info-num'>{item.info && item.info.toLocaleString() || '-'}</div>
                        </div>
                    </ContainerRichard>
                </Col>
        );

        return VoteHtml;
    }

    getCurrentWallet() {
        this.setState({
            currentWallet: JSON.parse(localStorage.currentWallet)
        });
    }

    render() {
        const {contracts} = this.state;
        const VoteHtml = this.renderVoteInformation();
        return (
            <div className='VotePage'>
                <DownloadPlugins />
                <div className='Voting-information'>
                    <Row type="flex" justify="space-between">
                        {VoteHtml}
                    </Row>
                </div>
                <VotingYieldChart title='Historical voting gains' dividends={contracts.dividends}/>
                {this.getAElfWallet()}
                <div className='vote-box' >
                    <VotingModule
                        currentWallet={this.state.currentWallet}
                        contracts={contracts}
                    />
                </div>
            </div>
            // <div className='apps-page-container'>AELF Applications List Page.</div>
        );
    }
}
