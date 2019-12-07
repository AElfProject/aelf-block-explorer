/**
 * @file ResourceAElfWallet.js
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Spin,
  Button,
  Icon,
  Divider
} from 'antd';
import { SYMBOL, ELF_DECIMAL } from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';
import './ResourceAElfWallet.less';

export default class ResourceAElfWallet extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    tokenContract: PropTypes.object.isRequired,
    tokenConverterContract: PropTypes.object.isRequired,
    currentWallet: PropTypes.object.isRequired,
    getCurrentBalance: PropTypes.func.isRequired,
    getResource: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      RAM: 0,
      CPU: 0,
      NET: 0,
      STO: 0,
      loading: false
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    const {
      tokenContract,
      currentWallet
    } = this.props;
    if (tokenContract && currentWallet) {
      Promise.all([
        this.getCurrentWalletBalance(),
        this.getCurrentWalletResource()
      ]).then(() => {
        this.setState({
          loading: false
        })
      }).catch(() => {
        this.setState({
          loading: false
        })
      });
    }
  }

  getCurrentWalletBalance = async () => {
    const {
      tokenContract,
      currentWallet,
      getCurrentBalance
    } = this.props;
    const payload = {
      symbol: SYMBOL,
      owner: currentWallet.address || currentWallet
    };
    const result = await tokenContract.GetBalance.call(payload);
    const balance = parseInt(result.balance || 0, 10) / ELF_DECIMAL;
    this.setState({
      balance
    });
    getCurrentBalance(balance);
  };

  // 获取资源币数量
  getCurrentWalletResource = () => {
    const {
      tokenContract,
      currentWallet,
      getResource
    } = this.props;
    const owner = currentWallet.address || currentWallet;
    const symbols = ['RAM', 'CPU', 'NET', 'STO'];
    return Promise.all(symbols.map(symbol => {
      return tokenContract.GetBalance.call({
        symbol,
        owner
      });
    })).then(results => {
      const newState = results.reduce((acc, v) => {
        const balance = parseInt(v.balance || 0, 10) / ELF_DECIMAL;
        return {
          ...acc,
          [v.symbol]: balance
        }
      }, {});
      this.setState(newState);
      getResource(newState);
    });
  };

  onRefresh() {
    this.setState({
      loading: true
    });
    Promise.all([
      this.getCurrentWalletBalance(),
      this.getCurrentWalletResource()
    ]).then(() => {
      this.setState({
        loading: false
      })
    }).catch(() => {
      this.setState({
        loading: false
      })
    });
  }

  render() {
    const {
      title,
      currentWallet,
    } = this.props;
    const {
      balance,
      RAM,
      CPU,
      NET,
      STO,
      loading
    } = this.state;

    return (
      <div className='resource-wallet resource-block'>
        <Spin tip='loading....' size='large' spinning={loading}>
          <div className='resource-wallet-header'>
            <Icon type="wallet" className="resource-icon" />
            <span className="resource-title">{title}</span>
          </div>
          <Divider />
          <div className="resource-wallet-address">
            <span className='resource-wallet-address-name'>{currentWallet.name}</span>
            <Button
                className='resource-wallet-address-update update-btn'
                onClick={this.onRefresh}
            >
              <Icon type='sync' spin={loading} />
            </Button>
          </div>
          <Divider />
          <div className='resource-wallet-info'>
            <Row type="flex" align="middle">
              <Col span={24}>
                <span className="resource-wallet-info-name balance">Balance:</span>
                <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(balance)} ELF</span>
              </Col>
              <Col
                  lg={12}
                  xs={24}
                  sm={12}
              >
                <span className="resource-wallet-info-name">RAM Quantity:</span>
                <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(RAM)}</span>
              </Col>
              <Col
                  lg={12}
                  xs={24}
                  sm={12}
              >
                <span className="resource-wallet-info-name">NET Quantity:</span>
                <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(NET)}</span>
              </Col>
              <Col
                  lg={12}
                  xs={24}
                  sm={12}
              >
                <span className="resource-wallet-info-name">CPU Quantity:</span>
                <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(CPU)}</span>
              </Col>
              <Col
                  lg={12}
                  xs={24}
                  sm={12}
              >
                <span className="resource-wallet-info-name">STO Quantity:</span>
                <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(STO)}</span>
              </Col>
              <Col
                  lg={12}
                  xs={24}
                  sm={12}
                  className="last-col"
              >
                <span className="resource-wallet-info-name detail">
                  <Link to={`/resourceDetail/${currentWallet.address}`}>
                    Transaction Details
                  </Link>
                </span>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    );
  }
}
