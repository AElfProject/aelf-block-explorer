/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
*/

import React, {Component} from 'react';
import {Row, Col, Input, Slider, message} from 'antd';
import getMenuName from '../../../../utils/getMenuName';
import getHexNumber from '../../../../utils/getHexNumber';
import getResource from '../../../../utils/getResource';
import getEstimatedValueELF from '../../../../utils/getEstimatedValueELF';
import getFees from '../../../../utils/getFees';
import './ResourceSell.less';

export default class ResourceBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuName: null,
            currentWallet: JSON.parse(localStorage.currentWallet) || null,
            menuIndex: this.props.menuIndex,
            value: null,
            resValue: 0,
            region: 0,
            purchaseQuantity: 0,
            ELFValue: 0,
            loading: false
        };
    }

    componentDidMount() {
        const {menuIndex, currentWallet} = this.state;
        this.wallet = getWallet(currentWallet.privateKey);
        this.resource = getResource(this.wallet);
        const resValue = getHexNumber(
            this.resource.GetUserBalance(currentWallet.address, getMenuName(menuIndex)).return
        );
        this.setState({
            menuName: getMenuName(menuIndex),
            resValue,
            region: resValue / 4
        });
    }

    onChangeResourceValue(e) {
        const {menuName, currentWallet} = this.state;
        let ELFValue = parseInt(getEstimatedValueELF(menuName, currentWallet.privateKey, e.target.value), 10) || 0;
        ELFValue ? ELFValue -= getFees(ELFValue) : 0;
        this.setState({
            ELFValue,
            value: e.target.value,
            menuName
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
            const {menuIndex} = this.state;
            this.wallet = getWallet(this.props.currentWallet.privateKey);
            this.resource = getResource(this.wallet);
            const resValue = getHexNumber(
                this.resource.GetUserBalance(this.props.currentWallet.address, getMenuName(menuIndex)).return
            );
            this.setState({
                currentWallet: this.props.currentWallet,
                menuName: getMenuName(menuIndex),
                resValue,
                region: resValue / 4
            });
        }

        if (prevProps.menuIndex !== this.props.menuIndex) {
            const {menuIndex} = this.state;
            const resValue = getHexNumber(
                this.resource.GetUserBalance(this.props.currentWallet.address, getMenuName(menuIndex)).return
            );
            this.setState({
                menuName: getMenuName(menuIndex),
                resValue,
                region: resValue / 4
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
        this.setState({
            purchaseQuantity: e
        });
    }


    
    getSellModalShow() {
        let {value, resValue} = this.state;
        let reg = /^[0-9]*$/;
        if (!reg.test(value) || parseInt(value, 10) === 0) {
            message.error('The value must be numeric and greater than 0');
            return;
        }
        else if (parseInt(value, 10) > resValue) {
            message.warning('More votes than available assets');
            return;
        }
        else {
            if (value && value !== 0) {
                this.props.handleSellModalShow(value);
            }
        }
    }

    getSlideHTML() {
        const {resValue, region} = this.state;
        if (resValue && resValue !== 0) {
            return (
                <Slider
                    marks={this.getSlideMarks()}
                    step={region}
                    min={0}
                    onChange={e => this.onChangeSlide(e) }
                    max={resValue}
                    tooltipVisible={false}
                />
            );
        }
    }
    render() {
        const {purchaseQuantity, menuName, value} = this.state;
        const slideHTML = this.getSlideHTML();
        return (
            <div className='trading-box trading-sell'>
                <div className='trading'>
                    <div className='trading-title'>
                        Sell
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
                                    value={this.state.resValue}
                                    addonAfter={menuName}
                                    disabled={true}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className='trading-slide'>
                        {slideHTML}
                        <div className='ElF-value'>{purchaseQuantity} {menuName}</div>
                    </div>
                    <div
                        className='trading-button'
                        style={{background: '#8c042a'}}
                        onClick={this.getSellModalShow.bind(this)}
                    >Sell</div>
                </div>
            </div>
        );
    }
}