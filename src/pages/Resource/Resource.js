/**
 * @file
 * @author huangzongzhe  zhouminghui
 * 233333
 * TODO: Vote && Resource To migrate out of Application
 */

import React, { Component } from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';

import { aelf } from '../../utils';
import { DEFAUTRPCSERVER, APPNAME } from '../../../config/config';
import DownloadPlugins from '../../components/DownloadPlugins/DownloadPlugins';
import ResourceAElfWallet from './components/ResourceAElfWallet/ResourceAElfWallet';
import NightElfCheck from '../../utils/NightElfCheck';
import getContractAddress from '../../utils/getContractAddress.js';
import checkPermissionRepeat from '../../utils/checkPermissionRepeat';
import ResourceMoneyMarket from './components/ResourceMoneyMarket/ResourceMoneyMarket';
import getLogin from '../../utils/getLogin';
import { isPhoneCheck } from '../../utils/deviceCheck';
import './Resource.less';

const appName = APPNAME;
let nightElf;
class Resource extends Component {
  constructor(props) {
    super(props);
    this.informationTimer;
    this.state = {
      currentWallet: null,
      contracts: null,
      tokenContract: null,
      tokenConverterContract: null,
      showDownloadPlugins: false,
      showWallet: false,
      currentBalance: 0,
      currentCpu: 0,
      currentRam: 0,
      currentNet: 0,
      currentSto: 0,
      loading: false,
      nightElf: null
    };
    this.getResource = this.getResource.bind(this);
    this.getCurrentBalance = this.getCurrentBalance.bind(this);
  }

  componentDidMount() {
    let httpProvider = DEFAUTRPCSERVER;
    getContractAddress().then(result => {
      this.setState({
        contracts: result
      });
      if (!result.chainInfo) {
        message.error(
          'The chain has stopped or cannot be connected to the chain. Please check your network or contact us.',
          10
        );
        return;
      }
      aelf.chain.contractAt(
        result.multiToken,
        result.wallet,
        (error, result) => {
          this.setState({
            tokenContract: result
          });
        }
      );
      aelf.chain.contractAt(
        result.tokenConverter,
        result.wallet,
        (error, result) => {
          this.setState({
            tokenConverterContract: result
          });
        }
      );
    });
    NightElfCheck.getInstance()
      .check.then(item => {
        if (item) {
          nightElf = new window.NightElf.AElf({
            httpProvider: [
              httpProvider,
              null,
              null,
              null,
              [
                {
                  name: 'Accept',
                  value: 'text/plain;v=1.0'
                }
              ]
            ],
            appName // TODO: 这个需要content.js 主动获取
          });
          if (nightElf) {
            this.setState({
              nightElf
            });
            nightElf.chain.getChainStatus((error, result) => {
              if (result) {
                nightElf.checkPermission(
                  {
                    appName,
                    type: 'domain'
                  },
                  (error, result) => {
                    if (result && result.error === 0) {
                      this.insertKeypairs(result);
                    } else {
                      // todo: Centralized manage the code about nightElf's lock status warning
                      // todo: Use the variable in redux instead, remind the cdm
                      const isSmallScreen = document.body.offsetWidth < 768;
                      if (!isSmallScreen) {
                        message.warning(result.errorMessage.message, 6);
                      }
                    }
                  }
                );
              }
            });
          }
        }
      })
      .catch(error => {
        // console.log('NightElfCheck : error', error);
        this.setState({
          showDownloadPlugins: true
        });
      });
  }

  insertKeypairs(result) {
    const { nightElf } = this.state;
    const getLoginPayload = {
      appName,
      connectChain: this.connectChain
    };
    if (result && result.error === 0) {
      const { permissions } = result;
      const payload = {
        appName,
        connectChain: this.connectChain,
        result
      };
      // localStorage.setItem('currentWallet', null);
      getLogin(nightElf, getLoginPayload, result => {
        if (result && result.error === 0) {
          const wallet = JSON.parse(result.detail);
          if (permissions.length) {
            // EXPLAIN: Need to redefine this scope
            checkPermissionRepeat(nightElf, payload, () => {
              this.getNightElfKeypair(wallet);
            });
          } else {
            this.getNightElfKeypair(wallet);
            message.success('Login success!!', 3);
          }
        } else {
          this.setState({
            showWallet: false
          });
          message.error(result.errorMessage.message, 3);
        }
      });
    } else {
      message.error(result.errorMessage.message, 3);
    }
  }

  getNightElfKeypair(wallet) {
    if (wallet) {
      localStorage.setItem('currentWallet', JSON.stringify(wallet));
      this.setState({
        currentWallet: wallet,
        showWallet: true
      });
    }
  }

  getCurrentBalance(value) {
    this.setState({
      currentBalance: value
    });
  }

  getDownloadPluginsHTML() {
    return <DownloadPlugins />;
  }

  onRefresh() {
    this.setState({
      loading: true
    });
  }

  endRefresh() {
    this.setState({
      loading: false
    });
  }

  getResource(resource) {
    this.setState({
      currentCpu: resource.CPU,
      currentRam: resource.RAM,
      currentNet: resource.NET,
      currentSto: resource.STO,
    });
  }

  resourceAElfWalletHtml() {
    const {
      showWallet,
      tokenContract,
      tokenConverterContract,
      currentWallet
    } = this.state;
    // if (showWallet) {
      return (
        <ResourceAElfWallet
          title='AELF Wallet'
          tokenContract={tokenContract}
          tokenConverterContract={tokenConverterContract}
          currentWallet={currentWallet}
          getCurrentBalance={this.getCurrentBalance}
          getResource={this.getResource}
        />
      );
    // }
  }

  render() {
    const {
      showDownloadPlugins,
      currentWallet,
      contracts,
      tokenContract,
      tokenConverterContract
    } = this.state;
    const {
      currentBalance,
      currentCpu,
      currentRam,
      currentNet,
      currentSto,
      appName
    } = this.state;
    let account = {
      balance: currentBalance,
      CPU: currentCpu,
      RAM: currentRam,
      NET: currentNet,
      STO: currentSto
    };
    let downloadPlugins = null;
    if (showDownloadPlugins) {
      downloadPlugins = [this.getDownloadPluginsHTML(), <div className='resource-blank'></div>];
    }
    const resourceAElfWalletHtml = this.resourceAElfWalletHtml();
    const isPhone = isPhoneCheck();
    return (
      <div className='resource-body basic-container basic-container-white'>
        {!isPhone && downloadPlugins}
        {isPhone && <div className='resource-pc-note'>In PC, you can find more operations and information.</div>}
        {!isPhone && resourceAElfWalletHtml}
        <div className='resource-money-market'>
          <ResourceMoneyMarket
            currentWallet={currentWallet}
            contracts={contracts}
            tokenContract={tokenContract}
            tokenConverterContract={tokenConverterContract}
            account={account}
            onRefresh={this.onRefresh.bind(this)}
            endRefresh={this.endRefresh.bind(this)}
            nightElf={nightElf}
            appName={appName}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.common
});

export default connect(mapStateToProps)(Resource);
