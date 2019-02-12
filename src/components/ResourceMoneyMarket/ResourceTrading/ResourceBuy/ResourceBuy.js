/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
*/

import React, {Component} from 'react';
import {Row, Col, Input, Slider, message} from 'antd';
import getMenuName from '../../../../utils/getMenuName';
import {resourceAddress} from '../../../../../config/config';
import getEstimatedValueRes from '../../../../utils/getEstimatedValueRes';
import getEstimatedValueELF from '../../../../utils/getEstimatedValueELF';
import getFees from '../../../../utils/getFees';
import testingResource from '../../../../utils/testingResource';
import './ResourceBuy.less';

export default class ResourceBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuName: null,
            menuIndex: this.props.menuIndex,
            currentWallet: this.props.currentWallet || JSON.parse(localStorage.currentWallet),
            contracts: null,
            ELFValue: 0,
            region: 0,
            value: null,
            purchaseQuantity: 0,
            getSlideMarks: null,
            noCanInput: true,
            account: {
                balabce: 0,
                CPU: 0,
                RAM: 0,
                NET: 0,
                STO: 0
            },
            toBuy: true
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.currentWallet) {
            return {
                currentWallet: props.currentWallet
            };
        }

        if (props.account !== state.account) {
            return {
                account: props.account
            };
        }

        if (props.menuIndex !== state.menuIndex) {
            return {
                menuIndex: props.menuIndex
            };
        }

        if (props.contracts !== state.contracts) {
            return {
                contracts: props.contracts
            };
        }

        if (props.resourceContract !== state.resourceContract) {
            return {
                resourceContract: props.resourceContract
            };
        }

        return null;
    }

    componentDidMount() {
        this.setState({
            menuName: getMenuName(this.state.menuIndex)
        });
    }


    componentDidUpdate(prevProps) {
        if (prevProps.menuIndex !== this.props.menuIndex) {
            this.setState({
                menuName: getMenuName(this.props.menuIndex),
                value: null,
                purchaseQuantity: 0,
                ELFValue: 0
            });
        }

        if (prevProps.account !== this.props.account) {
            this.getRegion();
        }

        if (prevProps.resourceContract !== this.props.resourceContract) {
            this.setState({
                noCanInput: false
            });
        }
    }

    getRegion() {
        const {account} = this.state;
        this.setState({
            region: Math.floor(account.balabce / 4)
        });
    }

    getSlideMarks() {
        const {region, account} = this.state;
        if (region < 4) {
            const regionLine = [0, 25, 50, 75, 100];
            let marks = {};
            regionLine.map(item => {
                marks[item] = '';
            });
            return marks;
        }
        const regionLine = [
            0,
            region,
            region * 2,
            region * 3,
            account.balabce
        ];
        let marks = {};
        regionLine.map(item => {
            marks[item] = '';
        });
        return marks;
    }

    onChangeSlide(e) {
        const {menuName, resourceContract} = this.state;
        let elfCont = e;
        if (e === 0) {
            this.setState({
                purchaseQuantity: 0,
                ELFValue: 0,
                value: 0
            });
            return;
        }
        elfCont = elfCont - 1;
        elfCont -= getFees(elfCont);
        getEstimatedValueRes(menuName, elfCont, resourceContract).then(result => {
            let value = 0;
            if (Math.ceil(result) > 0) {
                value = Math.abs(Math.ceil(result));
            }
            this.setState({
                value
            });
        });
        this.setState({
            purchaseQuantity: e,
            ELFValue: e
        });
    }

    getSlideMarksHTML() {
        let {region, purchaseQuantity, account} = this.state;
        let disabled = false;
        let balance = account.balabce;
        if (region < 4) {
            region = 25;
            balance = 100;
            disabled = true;
        }
        return (
            <Slider
                marks={this.getSlideMarks()}
                step={region}
                disabled={disabled}
                min={0}
                value={purchaseQuantity}
                onChange={e => this.onChangeSlide(e) }
                max={balance}
                tooltipVisible={false}
            />
        );
    }

    onChangeResourceValue(e) {
        const {menuName, resourceContract} = this.state;
        if (e.target.value) {
            getEstimatedValueELF(menuName, e.target.value, resourceContract, 'Buy').then(result => {
                let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
                let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
                if (regPos.test(result) || regNeg.test(result)) {
                    let ELFValue = Math.abs(Math.floor(result));
                    ELFValue += getFees(ELFValue);
                    ELFValue += 1;
                    if (ELFValue !== 0) {
                        this.setState({
                            ELFValue,
                            toBuy: true
                        });
                    }
                    else {
                        this.setState({
                            ELFValue,
                            toBuy: true
                        });
                    }
                }
                else {
                    this.setState({
                        toBuy: false
                    });
                }
            });
            this.setState({
                value: e.target.value
            });
        }
        else {
            this.setState({
                value: '',
                ELFValue: 0
            });
        }
    }

    getBuyModalShow() {
        const {value, account, ELFValue, currentWallet, contracts, toBuy} = this.state;
        let reg = /^[0-9]*$/;
        if (!reg.test(value) || parseInt(value, 10) === 0) {
            message.error('The value must be numeric and greater than 0');
            return;
        }
        else if (parseInt(ELFValue, 10) > parseFloat(account.balabce, 10)) {
            message.warning('Buy and sell more than available assets');
            return;
        }
        else if (!toBuy) {
            message.warning('Please purchase or sell a smaller amount of resources than the inventory in the resource contract.');
            return;
        }
        else {
            window.NightElf.api({
                appName: 'hzzTest',
                method: 'CHECK_PERMISSION',
                type: 'address', // if you did not set type, it aways get by domain.
                address: currentWallet.address
            }).then(result => {
                console.log('1>>>>>>>>>>>>>', result);
                if (result.permissions.length === 0) {
                    window.NightElf.api({
                        appName: 'hzzTest',
                        method: 'OPEN_PROMPT',
                        chainId: 'AELF',
                        hostname: 'aelf.io',
                        payload: {
                            method: 'SET_PERMISSION',
                            payload: {
                                address: currentWallet.address,
                                contracts: [{
                                    chainId: 'AELF',
                                    contractAddress: contracts.TOKENADDRESS,
                                    contractName: 'token',
                                    description: 'token contract'
                                }, {
                                    chainId: 'AELF',
                                    contractAddress: contracts.DIVIDENDSADDRESS,
                                    contractName: 'dividends',
                                    description: 'contract dividends'
                                }, {
                                    chainId: 'AELF',
                                    contractAddress: contracts.CONSENSUSADDRESS,
                                    contractName: 'consensus',
                                    description: 'contract consensus'
                                }, {
                                    chainId: 'AELF',
                                    contractAddress: resourceAddress,
                                    contractName: 'resource',
                                    description: 'contract resource'
                                }]
                            }
                        }
                    }).then(result => {
                        if (result.error === 0) {
                            testingResource(result, contracts, currentWallet).then(result => {
                                if (value && value !== 0) {
                                    this.props.handleBuyModalShow(value, ELFValue);
                                }
                            });
                        }
                        else {
                            message.error(result.errorMessage.message, 5);
                        }
                    });
                }
                else {
                    if (value && value !== 0) {
                        testingResource(result, contracts, currentWallet).then(result => {
                            if (value && value !== 0) {
                                this.props.handleBuyModalShow(value, ELFValue);
                            }
                        });
                    }
                }
            });
        }
    }

    render() {
        const {purchaseQuantity, menuName, value, account, noCanInput} = this.state;
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
                                    disabled={noCanInput}
                                />
                            </Col>
                        </Row>
                        <div className='ELF-value'>≈ {this.state.ELFValue} ELF</div>
                        <Row type='flex' align='middle'>
                            <Col span={6} style={{color: '#fff'}}>Available</Col>
                            <Col span={18}>
                                <Input
                                    value={account.balabce}
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