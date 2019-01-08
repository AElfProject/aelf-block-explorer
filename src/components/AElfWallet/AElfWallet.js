/**
 * @file AElfWallet
 * @author zhouminghui
 * 最小屏适配可能会出现一些小问题 待查看
 * 每次重新获取资产大概都需要把this.balance重置 直到我找到更好的解决办法。
*/

import React, {PureComponent} from 'react';
import {Row, Col, Radio, Message} from 'antd';
import Button from '../Button/Button';
import Svg from '../Svg/Svg';
import {tokenContract} from '../../utils';
import formatNumber from '../../utils/formatNumber';
import hexCharCodeToStr from '../../utils/hexCharCodeToStr';
import getDividends from '../../utils/getDividends';
import getConsensus from '../../utils/getConsensus';
import getWallet from '../../utils/getWallet';
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
            refresh: 0
        };
    }

    componentDidMount() {
        this.pushWalletInfo();
    }

    pushWalletInfo() {
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


    onChange(e) {
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



    getWalletInfo() {
        const walletHtml = this.state.walletInfo.map((item, index) => {
            return (
                <Radio key={index} value={item.privateKey} >
                    <span className='wallet-name'>{item.walletName}</span>
                </Radio>
            );
        });

        return walletHtml;
    }

    getUnbindButton() {
        const unbindButton = this.state.walletInfo.map((item, index) => {
            return (
                <div className='wallet-button-box' key={index} >
                    <Button title='Unbind' click={this.unbindWallet.bind(this, item.address)} />
                </div>
            );
        });
        return unbindButton;
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
                <Row key={index} type='flex' align='middle'>
                    <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24}>
                        Assets: <span className='total-assets'>{balance}</span>
                    </Col>
                    <Col xxl={6} xl={12} lg={12} md={12} sm={24} xs={24}>
                        Votes: <span className='total-votes'>{tirkets}</span>
                    </Col>
                    <Col xxl={12} xl={24} lg={24} md={24} sm={24} xs={24}>
                        Dividends: <span className='pending-dividend'>{dividends}</span>
                            <Button
                                title='Receive'
                                click={this.getAllDividends.bind(this)}
                                style={this.state.value === item.privateKey ? {display: 'inline-block'} : {display: 'none'}}
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
        this.consensus.ReceiveAllDividends();
        Message.success('Redemption success!');
    }

    onRefresh() {
        this.pushWalletInfo();
    }

    render() {
        console.log('更新了');
        const walletHtml = this.getWalletInfo();
        const unbindButton = this.getUnbindButton();
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
                <div className='AElf-Wallet-body'>
                <Row>
                    <Col span='12' className='AElf-Wallet-name'>
                        <Col span='14'>
                            <RadioGroup onChange={this.onChange.bind(this)} value={this.state.value}>
                                {walletHtml}
                            </RadioGroup>
                        </Col>
                        <Col span='10'>
                            {unbindButton}
                        </Col>
                    </Col>
                    <Col span='10' className='AElf-Wallet-info'>
                        {walletAssetInfo}
                    </Col>
                    <Col span='2'>
                        <div onClick={this.onRefresh.bind(this)}>
                            <Svg
                                icon='refresh'
                                style={{marginTop: '30px', width: '60px', height: '60px', float: 'right'}}
                            />
                        </div>
                    </Col>
                </Row>
                </div>
            </div>
        );
    }
}
