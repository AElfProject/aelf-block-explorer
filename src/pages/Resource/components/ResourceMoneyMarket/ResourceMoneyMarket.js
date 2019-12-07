/**
 * @file ResourceMoneyMarket
 * @author zhouminghui
 * A collection of resource transactions
 */

import React, { PureComponent } from 'react';
import { Row, Col, Spin, Icon } from 'antd';
import ResourceCurrencyChart from './ResourceCurrencyChart/ResourceCurrencyChart';
import ResourceTrading from './ResourceTrading/ResourceTrading';
import RealTimeTransactions from './RealTimeTransactions/RealTimeTransactions';
import './ResourceMoneyMarket.less';

export default class ResourceMoneyMarket extends PureComponent {
  constructor(props) {
    super(props);
    this.menuNames = ['RAM', 'CPU', 'NET', 'STO'];
    // 这个组件作为一个集合可以用作组件之间数据交互
    this.state = {
      menuIndex: 0,
      currentWallet: null,
      contracts: null,
      tokenContract: null,
      tokenConverterContract: null,
      loading: false,
      echartsLoading: false,
      realTimeTransactionLoading: false,
      nightElf: this.props.nightElf,
      account: {
        balance: 0,
        CPU: 0,
        RAM: 0,
        NET: 0,
        STO: 0
      }
    };
    this.getMenuClick = this.getMenuClick.bind(this);
    this.getEchartsLoading = this.getEchartsLoading.bind(this);
  }

  getMenuClick(index) {
    // TODO 切换所有模块数据源  写一个状态判断用来判断当前是哪一个数据
    if (this.state.menuIndex === index) {
      return;
    }
    this.setState({
      menuIndex: index,
      loading: true,
      realTimeTransactionLoading: true,
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
      realTimeTransactionLoading: false
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

  render() {
    const {
      menuIndex,
      currentWallet,
      contracts,
      tokenConverterContract,
      tokenContract,
      account
    } = this.state;
    const { realTimeTransactionLoading, echartsLoading, nightElf } = this.state;
    let loading = true;
    if (!realTimeTransactionLoading && !echartsLoading) {
      loading = false;
    }
    return (
      <div className='resource-market-body resource-block'>
        <Spin size='large' spinning={loading}>
          <div className='resource-body'>
            <ResourceCurrencyChart
                menuList={this.menuNames}
                menuIndex={menuIndex}
                getMenuClick={this.getMenuClick}
                getEchartsLoading={this.getEchartsLoading}
            />
            <Row className="resource-sub-container">
              <Col xxl={14} xl={24} lg={24}>
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
              <Col xxl={{ span: 9, offset: 1 }} xl={24} lg={24}>
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
