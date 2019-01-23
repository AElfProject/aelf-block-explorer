/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
*/

import React, {Component} from 'react';
import {Row, Col, Input, Slider, message} from 'antd';
import getMenuName from '../../../../utils/getMenuName';
import getHexNumber from '../../../../utils/getHexNumber';
import getEstimatedValueRes from '../../../../utils/getEstimatedValueRes';
import getEstimatedValueELF from '../../../../utils/getEstimatedValueELF';
import getFees from '../../../../utils/getFees';
import './ResourceBuy.less';

export default class ResourceBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuName: null,
            menuIndex: this.props.menuIndex,
            currentWallet: this.props.currentWallet || JSON.parse(localStorage.currentWallet),
            voteContracts: this.props.voteContracts,
            balance: 0,
            ELFValue: 0,
            region: 500,
            value: null,
            purchaseQuantity: 0,
            getSlideMarks: null
        };
    }

    componentDidMount() {
        const {menuIndex, currentWallet, voteContracts} = this.state;
        const balance = getHexNumber(
            voteContracts.tokenContract.BalanceOf(currentWallet.address).return
        );
        this.setState({
            menuName: getMenuName(menuIndex),
            balance,
            region: balance / 4,
            getSlideMarks: this.getSlideMarks()
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.currentWallet) {
            return {
                currentWallet: props.currentWallet
            };
        }

        if (props.menuIndex !== state.menuIndex) {
            return {
                menuIndex: props.menuIndex
            };
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentWallet !== this.props.currentWallet) {
            const {voteContracts} = this.state;
            const balance = getHexNumber(
                voteContracts.tokenContract.BalanceOf(this.props.currentWallet.address).return
            );
            this.setState({
                currentWallet: this.props.currentWallet,
                balance,
                region: balance / 4,
                getSlideMarks: this.getSlideMarks(),
                purchaseQuantity: 0
            });
        }

        if (prevProps.menuIndex !== this.props.menuIndex) {
            console.log('aaa');
            this.setState({
                menuName: getMenuName(this.props.menuIndex)
            });
        }
    }

    getSlideMarks() {
        const {region} = this.state;
        const regionLine = [0, region, region * 2, region * 3, region * 4];
        let marks = {};
        regionLine.map(item => {
            marks[item] = '';
        });
        return marks;
    }

    onChangeSlide(e) {
        const {menuName, currentWallet} = this.state;
        this.setState({
            purchaseQuantity: e,
            ELFValue: e,
            value: parseInt(getEstimatedValueRes(menuName, currentWallet.privateKey, e), 10)
        });
    }

    getSlideMarksHTML() {
        const {region, purchaseQuantity, balance} = this.state;
        if (balance) {
            return (
                <Slider
                    marks={this.getSlideMarks()}
                    step={region}
                    min={0}
                    value={purchaseQuantity}
                    onChange={e => this.onChangeSlide(e) }
                    max={balance}
                    tooltipVisible={false}
                />
            );
        }
    }

    onChangeResourceValue(e) {
        const {menuName, currentWallet} = this.state;
        let ELFValue = Math.ceil(getEstimatedValueELF(menuName, currentWallet.privateKey, e.target.value), 10) || 0;
        ELFValue += getFees(ELFValue) + 1;
        console.log(ELFValue);
        this.setState({
            ELFValue,
            value: e.target.value
        });
    }

    getBuyModalShow() {
        const {value, balance} = this.state;
        let reg = /^[0-9]*$/;
        if (!reg.test(value) || parseInt(value, 10) === 0) {
            message.error('The value must be numeric and greater than 0');
            return;
        }
        else if (parseInt(value, 10) > parseFloat(balance, 10)) {
            message.warning('More votes than available assets');
            return;
        }
        else {
            if (value && value !== 0) {
                this.props.handleBuyModalShow(value);
            }
        }
    }

    render() {
        const {purchaseQuantity, menuName, value} = this.state;
        const sliderHTML = this.getSlideMarksHTML();
        return (
            <div className='trading-box trading-buy'>
                <div className='trading'>
                    <div className='trading-title'>
                        Buy
                    </div>
                    <div className='trading-input'>
                        <Row type='flex' align='middle'>
                            <Col span={6} style={{color: '#fff'}}>Buying quantity </Col>
                            <Col span={18}>
                                <Input
                                    addonAfter={menuName}
                                    value={value}
                                    onChange={this.onChangeResourceValue.bind(this)}
                                />
                            </Col>
                        </Row>
                        <div className='ELF-value'>≈ {this.state.ELFValue} ELF</div>
                        <Row type='flex' align='middle'>
                            <Col span={6} style={{color: '#fff'}}>Available</Col>
                            <Col span={18}>
                                <Input
                                    value={this.state.balance}
                                    addonAfter={'ELF'}
                                    disabled={true}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className='trading-slide'>
                        {sliderHTML}
                        <div className='ElF-value'>{purchaseQuantity} ELF</div>
                    </div>
                    <div
                        className='trading-button'
                        style={{background: '#007130'}}
                        onClick={this.getBuyModalShow.bind(this)}
                    >Buy</div>
                </div>
            </div>
        );
    }
}