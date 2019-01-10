/**
 * @file AElfWallet
 * @author zhouminghui
 * 最小屏适配可能会出现一些小问题 待查看
 * 每次重新获取资产大概都需要把this.balance重置 直到我找到更好的解决办法。
*/

import React, {PureComponent} from 'react';
import {Row, Col, Radio, Message, Spin} from 'antd';
import Button from '../Button/Button';
import Svg from '../Svg/Svg';
import {tokenContract, aelf} from '../../utils';
import formatNumber from '../../utils/formatNumber';
import hexCharCodeToStr from '../../utils/hexCharCodeToStr';
import getDividends from '../../utils/getDividends';
import getConsensus from '../../utils/getConsensus';
import getWallet from '../../utils/getWallet';
import getStateJudgment from '../../utils/getStateJudgment';
import './AElfWallet.less';

const RadioGroup = Radio.Group;

export default class AElfWallet extends PureComponent {
    constructor(props) {
        super(props);
        this.walletInfo = JSON.parse(localStorage.walletInfoList);
        if (this.walletInfo != null) {
            this.wallet = getWallet(JSON.parse(localStorage.currentWallet).privateKey);
        }
        this.consensus = getConsensus(this.wallet);
        this.dividends = getDividends(this.wallet);
        this.state = {
            walletInfo: this.walletInfo,
            value: JSON.parse(localStorage.currentWallet).privateKey,
            refresh: 0,
            loading: false,
            loadingTip: null
        };
    }

    async componentDidMount() {
        await this.pushWalletInfo();
    }

    pushWalletInfo = async () => {
        let walletInfo = this.state.walletInfo;
        if (walletInfo != null) {
            for (let i = 0; i < walletInfo.length; i++) {
                walletInfo[i].balance = parseInt(tokenContract.BalanceOf(walletInfo[i].address).return, 16) || '-';
                walletInfo[i].dividends = parseInt(
                    this.dividends.GetAllAvailableDividends(walletInfo[i].publicKey).return, 16
                ) || '-';
                walletInfo[i].tirkets = 0;
                let tirkets = JSON.parse(
                    hexCharCodeToStr(this.consensus.GetTicketsInfoToFriendlyString(walletInfo[i].publicKey).return)
                ).VotingRecords;
                if (tirkets !== undefined) {
                    for (let j = 0; j < tirkets.length; j++) {
                        if (tirkets[j].From === walletInfo[i].publicKey) {
                            walletInfo[i].tirkets += parseInt(tirkets[j].Count, 10);
                        }
                    }
                }
            }
        }
        this.setState({
            walletInfo,
            refresh: this.state.refresh + 1
        });
    }


    changeRadio(e) {
        this.setState({
            value: e.target.value
        });
        this.wallet = getWallet(e.target.value);
        this.consensus = getConsensus(this.wallet);
        this.dividends = getDividends(this.wallet);
        for (let i = 0, len = this.state.walletInfo.length; i < len; i++) {
            if (e.target.value === this.state.walletInfo[i].privateKey) {
                localStorage.setItem('currentWallet', JSON.stringify(this.state.walletInfo[i]));
                this.props.getCurrentWallet();
            }
        }
    }


    getWalletAssetInfo() {
        const walletAssetInfo = this.state.walletInfo.map((item, index) => {
            let balance = item.balance;
            let tirkets = item.tirkets;
            let dividends = item.dividends;
            if (tirkets === 0) {
                tirkets = '-';
            }
            else {
                tirkets = formatNumber(item.tirkets);
            }
            if (balance === 0) {
                balance = '-';
            }
            else {
                balance = formatNumber(item.balance);
            }
            if (dividends === 0) {
                dividends = '-';
            }
            else {
                dividends = formatNumber(item.dividends);
            }

            return (
                <Row key={index} type='flex' align='middle' style={{padding: '10px 0'}}>
                    <Col xxl={4} xl={4} lg={6} md={8} sm={8} xs={8}>
                        <Radio key={index} value={item.privateKey} style={{marginLeft: '10px'}}>
                            <span className='wallet-name'>{item.walletName}</span>
                        </Radio>
                    </Col>
                    <Col xxl={4} xl={4} lg={6} md={8} sm={8} xs={8}>
                        <div className='wallet-button-box' key={index} >
                            <Button title='Unbind' click={this.unbindWallet.bind(this, item.address)} />
                        </div>
                    </Col>
                    <Col xxl={4} xl={4} lg={6} md={8} sm={8} xs={8}>
                        Assets: <span className='total-assets'>{balance}</span>
                    </Col>
                    <Col xxl={{span: 4, offset: 0}} xl={{span: 4, offset: 0}} lg={{span: 6, offset: 0}} md={{span: 8, offset: 16}} sm={{span: 8, offset: 16}} xs={{span: 8, offset: 16}}>
                        Votes: <span className='total-votes'>{tirkets}</span>
                    </Col>
                    <Col xxl={{span: 8, offset: 0}} xl={{span: 8, offset: 0}} lg={{span: 12, offset: 12}} md={{span: 8, offset: 16}} sm={{span: 8, offset: 16}} xs={{span: 8, offset: 16}}>
                        Dividends: <span className='pending-dividend'>{dividends}</span>
                            <Button
                                title='Receive'
                                click={this.getAllDividends.bind(this)}
                                style={
                                    this.state.value === item.privateKey
                                    ? {display: 'inline-block'} : {display: 'none'}
                                }
                            />
                    </Col>
                </Row>
            );
        });
        return walletAssetInfo;
    }

    unbindWallet(address) {
        console.log('unbind:' + address);
    }

    getAllDividends() {
        // GetAllDividends
        this.setState({
            loadingTip: 'In redemption, please wait...'
        });
        const dividends = this.consensus.ReceiveAllDividends().hash;
        if (dividends) {
            console.log(dividends);
            this.setState({
                loading: true
            });
            const state = aelf.chain.getTxResult(dividends);
            setTimeout(() => {
                getStateJudgment(state.result.tx_status);
                this.setState({
                    loading: false
                });
            }, 4000);
        }
    }

    onRefresh() {
        this.setState({
            loadingTip: 'Loading......'
        });
        if (!this.state.isRefresh) {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                this.pushWalletInfo();
                this.setState({
                    loading: false
                });
            }, 4000);
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
                        <Button title='+ New Wallet' />
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
                                    value={JSON.parse(localStorage.currentWallet).privateKey}
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
