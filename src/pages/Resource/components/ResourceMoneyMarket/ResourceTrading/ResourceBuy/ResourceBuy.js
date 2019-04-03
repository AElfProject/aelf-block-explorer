/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
*/

import React, {Component} from 'react';
import {Row, Col, Input, Slider, message, Modal} from 'antd';
import {feeReceiverContract, tokenConverter, multiToken} from '../../../../../../../config/config';
import getMenuName from '../../../../../../utils/getMenuName';
import getEstimatedValueRes from '../../../../../../utils/getEstimatedValueRes';
import getEstimatedValueELF from '../../../../../../utils/getEstimatedValueELF';
import getFees from '../../../../../../utils/getFees';
import contractChange from '../../../../../../utils/contractChange';
import './ResourceBuy.less';

export default class ResourceBuy extends Component {
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
            nightElf: null,
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
        }

        if (prevProps.account !== this.props.account) {
            this.getRegion();
        }

        if (prevProps.tokenConverterContract !== this.props.tokenConverterContract) {
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
        const {menuName, tokenConverterContract, tokenContract} = this.state;
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
        getEstimatedValueRes(menuName, elfCont, tokenConverterContract, tokenContract).then(result => {
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

    debounce(value) {
        const {menuName, tokenConverterContract, tokenContract} = this.state;
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            console.log(value);
            if (value === '') {
                this.setState({
                    ELFValue: 0,
                    value: ''
                });
                return;
            }
            getEstimatedValueELF(menuName, value, tokenConverterContract, tokenContract).then(result => {
                let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
                let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
                if (regPos.test(result) || regNeg.test(result)) {
                    let ELFValue = Math.abs(Math.floor(result));
                    ELFValue += getFees(ELFValue);
                    if (ELFValue !== 0) {
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
        }, 500);
    }

    onChangeResourceValue(e) {
        this.debounce(e.target.value);
        this.setState({
            value: e.target.value
        });
    }

    getBuyModalShow() {
        const {value, account, ELFValue, currentWallet, contracts, toBuy, appName} = this.state;
        let reg = /^[0-9]*$/;
        if (!reg.test(value) || parseInt(value, 10) === 0  || value === '') {
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
                appName,
                method: 'CHECK_PERMISSION',
                type: 'address', // if you did not set type, it aways get by domain.
                address: currentWallet.address
            }).then(result => {
                if (result.error !== 0) {
                    message.warning(result.errorMessage.message, 3);
                    return;
                }
                if (result) {
                    result.permissions.map(item => {
                        const multiTokenObj = item.contracts.filter(data => {
                            return data.contractAddress === multiToken;
                        });
                        const hasApprove = multiTokenObj[0].whitelist.hasOwnProperty('Approve');
                        this.checkPermissionsModify(result, contracts, currentWallet, appName, hasApprove);
                    });
                }
            });
        }
    }

    checkPermissionsModify(result, contracts, currentWallet, appName, hasApprove) {
        const {nightElf, value} = this.state;
        const wallet = {
            address: currentWallet.address
        };
        contractChange(result, contracts, currentWallet, appName).then(result => {
            if (value && value !== 0 && !result) {
                nightElf.chain.contractAtAsync(
                    contracts.multiToken,
                    wallet,
                    (err, result) => {
                        if (result) {
                            if (hasApprove) {
                                this.getApprove(result);
                            }
                            else {
                                this.approveInfo(result);
                            }
                        }
                    }
                );
            }
        });
    }

    getApprove(result, time = 0) {
        const {value, ELFValue} = this.state;
        const contract = result || null;
        if (contract) {
            const payload = {
                symbol: 'ELF',
                spender: feeReceiverContract,
                amount: ELFValue + ELFValue * 0.02
            };
            if (result) {
                contract.Approve(payload, (error, result) => {
                    if (result) {
                        setTimeout(() => {
                            payload.spender = tokenConverter;
                            contract.Approve(payload, (error, result) => {
                                this.props.handleBuyModalShow(value, ELFValue);
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
                that.getApprove(result, 3020);
            }
        });
    }

    getSlideMarksHTML() {
        let {region, purchaseQuantity, account} = this.state;
        let disabled = false;
        let balance = parseInt(account.balabce, 10);
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