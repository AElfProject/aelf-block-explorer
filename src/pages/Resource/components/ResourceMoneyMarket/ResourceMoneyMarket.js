/**
 * @file ResourceMoneyMarket
 * @author zhouminghui
 * A collection of resource transactions
*/


import React, {PureComponent} from 'react';
import {Row, Col, Spin} from 'antd';
import ResourceCurrencyChart from './ResourceCurrencyChart/ResourceCurrencyChart';
import ResourceTrading from './ResourceTrading/ResourceTrading';
import RealTimeTransactions from './RealTimeTransactions/RealTimeTransactions';
import './ResourceMoneyMarket.less';

export default class ResourceMoneyMarket extends PureComponent {
    constructor(props) {
        super(props);
        // 这个组件作为一个集合可以用作组件之间数据交互
        this.state = {
            menuIndex: 0,
            currentWallet: null,
            contracts: null,
            tokenContract: null,
            tokenConverterContract: null,
            loading: false,
            echartsLoading: false,
            realTimeTransactionLoaidng: false,
            nightElf: this.props.nightElf,
            account: {
                balance: 0,
                CPU: 0,
                RAM: 0,
                NET: 0,
                STO: 0
            }
        };
    }

    getMenuClick(index) {
        // TODO 切换所有模块数据源  写一个状态判断用来判断当前是哪一个数据
        if (this.state.menuIndex === index) {
            return;
        }
        this.setState({
            menuIndex: index,
            loading: true,
            realTimeTransactionLoaidng: true,
            echartsLoading: true
        });
    }

    getEchartsLoading() {
        this.setState({
            echartsLoading: false
        });
    }

    getRealTimeTransactionLoading() {
        this.setState({
            realTimeTransactionLoaidng: false
        });
    }

    static getDerivedStateFromProps(props, state) {
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

        if (props.currentWallet !== state.currentWallet) {
            return {
                currentWallet: props.currentWallet
            };
        }

        if (props.tokenContract !== state.tokenContract) {
            return {
                tokenContract: props.tokenContract
            };
        }

        if (props.tokenConverterContract !== state.tokenConverterContract) {
            return {
                tokenConverterContract: props.tokenConverterContract
            };
        }

        if (props.account !== state.account) {
            return {
                account: props.account
            };
        }

        return null;
    }

    getMenuHTML() {
        const menuNames = ['RAM', 'CPU', 'NET', 'STO'];
        const {menuIndex} = this.state;
        const menu = menuNames.map((item, index) => {
                if (index !== menuIndex) {
                    return (
                        <Col xxl={24} xl={24} lg={6} key={index} style={{marginBottom: '80px'}} >
                            <div className='menu-button' onClick={this.getMenuClick.bind(this, index)}>
                                {item}
                            </div>
                        </Col>
                    );
                }
                return (
                    <Col xxl={24} xl={24} lg={6} key={index} style={{marginBottom: '80px'}} >
                        <div className='menu-button'
                            onClick={this.getMenuClick.bind(this, index)}
                            style={{background: '#195aa7'}}
                        >
                            {item}
                        </div>
                    </Col>
                );
            }
        );
        return menu;
    }

    render() {
        const menu = this.getMenuHTML();
        const {menuIndex, currentWallet, contracts, tokenConverterContract, tokenContract, account} = this.state;
        const {realTimeTransactionLoaidng, echartsLoading, nightElf} = this.state;
        let loading = true;
        if (!realTimeTransactionLoaidng && !echartsLoading) {
            loading = false;
        }
        return (
            <div className='resource-market-body'>
                <div className='resource-head'>
                    Resource Money Market
                </div>
                <Spin
                    size='large'
                    spinning={loading}
                >
                    <div className='resource-body'>
                        <Row>
                            <Col xxl={4} xl={4} lg={24}>
                                <Row>
                                    {menu}
                                </Row>
                            </Col>
                            <Col xxl={20} xl={20} lg={24}>
                                <ResourceCurrencyChart
                                    menuIndex={menuIndex}
                                    getEchartsLoading={this.getEchartsLoading.bind(this)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                xxl={14}
                                xl={24}
                                lg={24}
                            >
                                <ResourceTrading
                                    menuIndex={menuIndex}
                                    currentWallet={currentWallet}
                                    contracts={contracts}
                                    tokenConverterContract={tokenConverterContract}
                                    tokenContract={tokenContract}
                                    account={account}
                                    onRefresh={this.props.onRefresh}
                                    endRefresh={this.props.endRefresh}
                                    nightElf={nightElf}
                                    appName={this.props.appName}
                                />
                            </Col>
                            <Col
                                xxl={{span: 8, offset: 2}}
                                xl={24}
                                lg={24}
                            >
                                <RealTimeTransactions
                                    menuIndex={menuIndex}
                                    getRealTimeTransactionLoading={this.getRealTimeTransactionLoading.bind(this)}
                                />
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
        );
    }
}
