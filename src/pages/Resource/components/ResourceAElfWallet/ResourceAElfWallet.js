/**
 * @file ResourceAElfWallet.js
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Spin,
  Button,
  Icon, message
} from 'antd';
import {ADDRESS_INFO} from '../../../../../config/config';
import { SYMBOL, ELF_DECIMAL } from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';
import { APPNAME, resourceTokens } from '@config/config';
import './ResourceAElfWallet.less';
import NightElfCheck from "../../../../utils/NightElfCheck";
import getLogin from "../../../../utils/getLogin";

export default class ResourceAElfWallet extends PureComponent {

  constructor(props) {
    super(props);
    this.defaultWallet = {
      name: '-',
      address: '-'
    };
    this.state = {
      loading: true
    };
    this.refreshWalletInfo = this.refreshWalletInfo.bind(this);
    this.extensionLogout = this.extensionLogout.bind(this);
  }

  componentDidMount() {
    this.refreshWalletInfo();
  }

  // TODO: 组件要尽量无状态，这是个反模式
  // 数据都从父组件传递进来。
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      currentWallet,
      tokenContract
    } = this.props;
    // console.log('refreshWalletInfo update: ', tokenContract, currentWallet, prevProps.currentWallet, prevProps.tokenContract);

    if (currentWallet && tokenContract && !prevProps.tokenContract) {
      this.refreshWalletInfo();
    } else if (currentWallet && tokenContract
      && (!prevProps.currentWallet || prevProps.currentWallet.address !== currentWallet.address)) {
      this.refreshWalletInfo();
    }
  }

  refreshWalletInfo() {
    const {
      tokenContract,
      currentWallet
    } = this.props;
    if (tokenContract && currentWallet) {
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
    } else {
      this.setState({
        loading: false
      })
    }
  }

  extensionLogout() {
    const nightElf = NightElfCheck.getAelfInstanceByExtension();
    getLogin(nightElf, {file: 'MyVote.js'}, result => {
      console.log('extensionLogout getLogin: ', result);
      if (result.error && result.error === 200005) {
        message.warn(result.message || result.errorMessage.message);
      } else {
        const {
          currentWallet,
        } = this.props;
        nightElf.logout({
          appName: APPNAME,
          address: currentWallet.address
        }, (error, result) => {
          localStorage.removeItem('currentWallet');
          this.refreshWalletInfo();
          // TODO: more refactor actions for login and logout
          message.success('Logout successful, refresh after 3s.', 3, () => {
            window.location.reload();
          });
        }).catch(error => {
          message.error('logout failed');
        });
      }
    }, false);
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
    return Promise.all(resourceTokens.map(({symbol}) => {
      return tokenContract.GetBalance.call({
        symbol,
        owner
      });
    })).then(results => {
      const newResourceTokenInfos = results.map((v, i)  => {
        const balance = parseInt(v.balance || 0, 10) / ELF_DECIMAL;
        return {
          ...resourceTokens[i],
          balance
        };
      });
      getResource(newResourceTokenInfos);
    });
  };

  hasLogin() {
    const {
      currentWallet
    } = this.props;
    return currentWallet && currentWallet.address;
  }

  render() {
    const {
      title,
      currentWallet,
      tokenContract,
      resourceTokens,
      balance
    } = this.props;
    const {
      loading
    } = this.state;

    const propsTile = title || '-';
    const wallet = this.hasLogin() ?  currentWallet : this.defaultWallet;

    return (
      <div className='resource-wallet resource-block'>
        <Spin tip='loading....' size='large' spinning={loading}>
          <div className='resource-wallet-header resource-header'>
            <Icon type="wallet" className="resource-icon" />
            <span className="resource-title">{propsTile}</span>
          </div>
          <div className="resource-sub-container">
            <Row className="resource-wallet-address">
              <Col className="resource-wallet-address-name">
                {wallet.name}
                &nbsp;&nbsp;&nbsp;
                {ADDRESS_INFO.PREFIX + '_' + wallet.address + '_' + ADDRESS_INFO.CURRENT_CHAIN_ID}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                { wallet.address !== '-' && <Link to={`/resourceDetail/${wallet.address}`}>
                  Transaction Details
                </Link> }
              </Col>

              <Col className="resource-wallet-operation-container">
                <Button
                    className='resource-wallet-address-update update-btn'
                    disabled={!(currentWallet && currentWallet.address && tokenContract)}
                    onClick={this.refreshWalletInfo}
                >
                  Refresh<Icon type='sync' spin={loading} />
                </Button>

                { currentWallet && currentWallet.name && <Button
                  className="resource-wallet-address-update update-btn"
                  disabled={!(currentWallet && currentWallet.address && tokenContract)}
                  onClick={this.extensionLogout}
                >
                  Change Wallet<Icon type="logout"/>
                </Button>}
              </Col>
            </Row>

            <div className='resource-wallet-info'>
              <Row type="flex" align="middle">
                <Col span={24}>
                  <span className="resource-wallet-info-name balance">Balance:</span>
                  <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(this.hasLogin() ? balance : '-')} ELF</span>
                </Col>
                {resourceTokens.map(v => {
                  return (
                      <Col
                          lg={12}
                          xs={24}
                          sm={12}
                      >
                        <span className="resource-wallet-info-name">{v.symbol} Quantity:</span>
                        <span className="resource-wallet-info-value">{thousandsCommaWithDecimal(this.hasLogin() ? v.balance : '-')}</span>
                      </Col>
                  );
                })}
              </Row>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
