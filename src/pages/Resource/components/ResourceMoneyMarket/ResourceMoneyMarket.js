/**
 * @file ResourceMoneyMarket
 * @author zhouminghui
 * A collection of resource transactions
 */

import React, { PureComponent } from "react";
import { Row, Col, Spin } from "antd";
import ResourceCurrencyChart from "./ResourceCurrencyChart/ResourceCurrencyChart";
import ResourceTrading from "./ResourceTrading/ResourceTrading";
import RealTimeTransactions from "./RealTimeTransactions/RealTimeTransactions";
import "./ResourceMoneyMarket.less";
import walletInstance from "../../../../redux/common/wallet";

export default class ResourceMoneyMarket extends PureComponent {
  constructor(props) {
    super(props);
    // 这个组件作为一个集合可以用作组件之间数据交互
    this.state = {
      currentResourceSymbol: props.account.resourceTokens[0].symbol,
      currentWallet: null,
      contracts: null,
      tokenContract: null,
      tokenConverterContract: null,
      loading: false,
      echartsLoading: false,
      realTimeTransactionLoading: false,
    };
    this.getMenuClick = this.getMenuClick.bind(this);
    this.getEchartsLoading = this.getEchartsLoading.bind(this);
    this.getRealTimeTransactionLoading =
      this.getRealTimeTransactionLoading.bind(this);
  }

  getMenuClick(symbol) {
    // TODO 切换所有模块数据源  写一个状态判断用来判断当前是哪一个数据
    if (this.state.currentResourceSymbol === symbol) {
      return;
    }
    this.setState({
      currentResourceSymbol: symbol,
      loading: true,
      realTimeTransactionLoading: true,
      echartsLoading: true,
    });
  }

  getEchartsLoading() {
    this.setState({
      echartsLoading: false,
    });
  }

  getRealTimeTransactionLoading() {
    this.setState({
      realTimeTransactionLoading: false,
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.contracts !== state.contracts) {
      return {
        contracts: props.contracts,
      };
    }

    if (props.currentWallet !== state.currentWallet) {
      return {
        currentWallet: props.currentWallet,
      };
    }

    if (props.tokenContract !== state.tokenContract) {
      return {
        tokenContract: props.tokenContract,
      };
    }

    if (props.tokenConverterContract !== state.tokenConverterContract) {
      return {
        tokenConverterContract: props.tokenConverterContract,
      };
    }

    return null;
  }

  render() {
    const {
      currentResourceSymbol,
      currentWallet,
      contracts,
      tokenConverterContract,
      tokenContract,
    } = this.state;
    const { realTimeTransactionLoading, echartsLoading } = this.state;
    const { account, onRefresh, endRefresh, appName, loginAndInsertKeypairs } =
      this.props;
    let loading = true;
    if (!realTimeTransactionLoading && !echartsLoading) {
      loading = false;
    }
    const { resourceTokens } = account;
    const menuList = resourceTokens.map((v) => v.symbol);
    const currentIndex = resourceTokens.findIndex(
      (v) => v.symbol === currentResourceSymbol
    );

    return (
      <div className="resource-market-body resource-block">
        <Spin size="large" spinning={loading}>
          <div className="resource-body">
            <ResourceCurrencyChart
              list={menuList}
              currentResourceType={currentResourceSymbol}
              currentResourceIndex={currentIndex}
              getMenuClick={this.getMenuClick}
              getEchartsLoading={this.getEchartsLoading}
            />
            <Row className="resource-sub-container">
              {walletInstance && (
                <Col xxl={14} xl={24} lg={24}>
                  <ResourceTrading
                    loginAndInsertKeypairs={loginAndInsertKeypairs}
                    currentResourceType={currentResourceSymbol}
                    currentResourceIndex={currentIndex}
                    currentWallet={currentWallet}
                    contracts={contracts}
                    tokenConverterContract={tokenConverterContract}
                    tokenContract={tokenContract}
                    account={account}
                    onRefresh={onRefresh}
                    endRefresh={endRefresh}
                    appName={appName}
                  />
                </Col>
              )}
              <Col xxl={{ span: 9, offset: 1 }} xl={24} lg={24}>
                <RealTimeTransactions
                  type={currentResourceSymbol}
                  getRealTimeTransactionLoading={
                    this.getRealTimeTransactionLoading
                  }
                />
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    );
  }
}
