/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
*/

import React, {Component} from 'react';
import {Row, Col, Input, Slider, message, Modal} from 'antd';
import contractChange from '../../../../../../utils/contractChange';
import {feeReceiverContract, tokenConverter, multiToken} from '../../../../../../../config/config';
import getMenuName from '../../../../../../utils/getMenuName';
import getEstimatedValueELF from '../../../../../../utils/getEstimatedValueELF';
import './ResourceSell.less';
import {SYMBOL} from '@src/constants';

export default class ResourceSell extends Component {
    constructor(props) {
        super(props);
        this.debounceTimer;
        this.state = {
            menuName: null,
            appName: this.props.appName,
            menuIndex: this.props.menuIndex,
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
        this.debounce(e.target.value);
        this.setState({
            value: e.target.value
        });
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

        if (props.nightElf !== state.nightElf) {
            return {
                nightElf: props.nightElf
            };
        }

        if (props.tokenConverterContract !== state.tokenConverterContract) {
            return {
                tokenConverterContract: props.tokenConverterContract
            };
        }

        if (props.tokenContract !== state.tokenContract) {
            return {
                tokenContract: props.tokenContract
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

        if (prevProps.tokenConverterContract !== this.props.tokenConverterContract) {
            this.setState({
                noCanInput: false
            });
        }
    }


    debounce(value) {
        const {menuName, tokenConverterContract, tokenContract} = this.state;
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (value === '') {
                this.setState({
                    ELFValue: 0,
                    value: ''
                });
                return;
            }
            getEstimatedValueELF(menuName, value, tokenConverterContract, tokenContract, 'Sell').then(result => {
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
        }, 500);
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
        const {menuName, tokenConverterContract, tokenContract} = this.state;
        getEstimatedValueELF(menuName, e, tokenConverterContract, tokenContract).then(result => {
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
        const {value, account, currentWallet, contracts, menuIndex, toSell, appName, nightElf} = this.state;
        let menuName = getMenuName(menuIndex);
        let reg = /^[1-9]\d*$/;
        if (!reg.test(value)) {
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
            console.log(nightElf)
            nightElf.checkPermission({
                appName,
                type: 'address',
                address: currentWallet.address
            }, (error, result) => {
                if (result && result.error === 0) {
                    result.permissions.map(item => {
                        const multiTokenObj = item.contracts.filter(data => {
                            return data.contractAddress === multiToken;
                        });
                        let hasApprove = null;
                        if (multiTokenObj[0].whitelist) {
                            hasApprove = multiTokenObj[0].whitelist.hasOwnProperty('Approve');
                            
                        }
                        else {
                            hasApprove = false;
                        }
                        this.checkPermissionsModify(result, contracts, currentWallet, appName, hasApprove);
                    });
                }
                else {
                    message.warning(result.errorMessage.message, 3);
                }
            });
        }
    }

    checkPermissionsModify(result, contracts, currentWallet, appName, hasApprove) {
        const {nightElf, value} = this.state;
        const wallet = {
            address: currentWallet.address
        };
        contractChange(nightElf, result, currentWallet, appName).then(result => {
            if (value && !result) {
                nightElf.chain.contractAt(
                    contracts.multiToken,
                    wallet,
                    (err, contract) => {
                        if (contract) {
                            if (hasApprove) {
                                this.getApprove(contract);
                            }
                            else {
                                this.approveInfo(contract);
                            }
                        }
                    }
                );
            }
            else {
                message.info('Contract renewal completed...', 3);
            }
        });
    }

    getApprove(result, time = 0) {
        const {value, ELFValue, menuName} = this.state;
        const contract = result || null;
        if (contract) {
            const payload = {
                symbol: menuName,
                spender: feeReceiverContract,
                amount: value
            };
            if (result) {
                contract.Approve(payload, (error, result) => {
                    if (result) {
                        setTimeout(() => {
                            payload.spender = tokenConverter;
                            contract.Approve(payload, (error, result) => {
                                this.props.handleSellModalShow(value, ELFValue);
                            });
                        }, time);
                    }
                });
            }
        }
    }

    approveInfo(result) {
        const that = this;
        Modal.info({
            title: "Please add Approve to the extension's whitelist.",
            content: (
                <div className="approve-info">
                    <div>1. This method is none business of your assets.</div>
                    <div>2. If you don't want frequent confirmation, add this method to the extension's whitelist</div>
                </div>
            ),
            onOk() {
                that.getDelayApprove(result, 3020);
            }
        });
    }

    getSlideMarksHTML() {
        let {region, account, menuIndex, purchaseQuantity} = this.state;
        let menuName = getMenuName(menuIndex);
        let disabled = false;
        let balance = parseInt(account[menuName], 10);
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
                        <div className='ELF-value'>≈ {this.state.ELFValue} {SYMBOL}</div>
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