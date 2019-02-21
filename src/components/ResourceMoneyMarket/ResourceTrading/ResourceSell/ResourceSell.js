/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
*/

import React, {Component} from 'react';
import {Row, Col, Input, Slider, message} from 'antd';
import {resourceAddress} from '../../../../../config/config';
import testingResource from '../../../../utils/testingResource';
import getMenuName from '../../../../utils/getMenuName';
import getEstimatedValueELF from '../../../../utils/getEstimatedValueELF';
import './ResourceSell.less';

export default class ResourceSell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuName: null,
            menuIndex: this.props.menuIndex,
            currentWallet: this.props.currentWallet || JSON.parse(localStorage.getItem('currentWallet')),
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
            toSell: false
        };
    }

    onChangeResourceValue(e) {
        const {menuName, resourceContract} = this.state;
        getEstimatedValueELF(menuName, e.target.value, resourceContract, 'Sell').then(result => {
            let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
            let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
            if (regPos.test(result) || regNeg.test(result)) {
                let ELFValue = Math.abs(Math.ceil(result));
                this.setState({
                    ELFValue,
                    toSell: true
                });
            }
            else {
                this.setState({
                    toSell: false
                });
            }
        });

        if (e.target.value) {
            this.setState({
                value: e.target.value
            });
        }
        else {
            this.setState({
                value: ''
            });
        }
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
            this.getRegion(this.state.menuIndex);
        }

        if (prevProps.account !== this.props.account) {
            this.getRegion(this.state.menuIndex);
        }

        if (prevProps.resourceContract !== this.props.resourceContract) {
            this.setState({
                noCanInput: false
            });
        }
    }

    getRegion(index) {
        const {account} = this.state;
        const menuName = getMenuName(index);
        let value = account[menuName];
        this.setState({
            region: Math.ceil(value / 4)
        });
    }

    getSlideMarks() {
        const {region, account, menuIndex} = this.state;
        let menuName = getMenuName(menuIndex);
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
            account[menuName]
        ];
        let marks = {};
        regionLine.map(item => {
            marks[item] = '';
        });
        return marks;
    }

    onChangeSlide(e) {
        const {menuName, resourceContract} = this.state;
        getEstimatedValueELF(menuName, e, resourceContract, 'Sell').then(result => {
            let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
            let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
            let ELFValue = Math.abs(Math.floor(result));
            if (regPos.test(result) || regNeg.test(result)) {
                this.setState({
                    toSell: true,
                    purchaseQuantity: e,
                    ELFValue
                });
            }
            else {
                this.setState({
                    toSell: false,
                    ELFValue,
                    purchaseQuantity: e
                });
            }
            this.setState({
                value: e
            });
        });
    }


    getSellModalShow() {
        const {value, account, ELFValue, currentWallet, contracts, menuIndex, toSell} = this.state;
        let menuName = getMenuName(menuIndex);
        let reg = /^[0-9]*$/;
        if (!reg.test(value) || parseInt(value, 10) === 0) {
            message.error('The value must be numeric and greater than 0');
            return;
        }
        else if (parseInt(value, 10) > account[menuName]) {
            message.warning('Buy and sell more than available assets');
            return;
        }
        else if (!toSell) {
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
                if (result.error === 200005) {
                    message.warning(result.message, 3);
                    return;
                }
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
                            if (result) {
                                this.props.handleSellModalShow(value, ELFValue);
                            }
                        }
                        else {
                            message.error(result.errorMessage.message, 5);
                        }
                    });
                }
                else {
                    testingResource(result, contracts, currentWallet).then(result => {
                        if (result) {
                            this.props.handleSellModalShow(value, ELFValue);
                        }
                    });
                }
            });
        }
    }

    getSlideMarksHTML() {
        let {region, account, menuIndex, purchaseQuantity} = this.state;
        let menuName = getMenuName(menuIndex);
        let disabled = false;
        let balance = account[menuName];
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

    render() {
        const {purchaseQuantity, menuName, value, account} = this.state;
        const slideHTML = this.getSlideMarksHTML();
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
                                    value={account[menuName]}
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