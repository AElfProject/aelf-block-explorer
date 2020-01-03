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
import { APPNAME, resourceTokens } from '../../../config/config';
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
      resourceTokens: resourceTokens.map(v => ({...v, balance: 0})),
      loading: false,
      nightElf: null
    };
    this.walletRef = null;
    this.getResource = this.getResource.bind(this);
    this.getCurrentBalance = this.getCurrentBalance.bind(this);
  }

  componentDidMount() {
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
          const nightElf = NightElfCheck.getAelfInstanceByExtension();

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
          if (result.error === 200010) {
            message.warn('Please Login.');
          } else {
            message.warn(result.errorMessage.message || 'Please check your NightELF browser extension.')
          }
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
    setTimeout(() => {
      this.walletRef.refreshWalletInfo();
    }, 2000);
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
      resourceTokens: resource.map(v => ({...v}))
    });
  }

  resourceAElfWalletHtml() {
    const {
      tokenContract,
      tokenConverterContract,
      currentWallet,
      resourceTokens,
      currentBalance
    } = this.state;
    return (
        <ResourceAElfWallet
            title='AELF Wallet'
            ref={wallet => {
              this.walletRef = wallet;
            }}
            tokenContract={tokenContract}
            tokenConverterContract={tokenConverterContract}
            currentWallet={currentWallet}
            getCurrentBalance={this.getCurrentBalance}
            getResource={this.getResource}
            resourceTokens={resourceTokens}
            balance={currentBalance}
        />
    );
  }

  render() {
    const {
      currentBalance,
      appName,
      showDownloadPlugins,
      currentWallet,
      contracts,
      tokenContract,
      tokenConverterContract,
      nightElf,
      resourceTokens
    } = this.state;
    let account = {
      balance: currentBalance,
      resourceTokens
    };
    let downloadPlugins = null;
    if (showDownloadPlugins) {
      downloadPlugins = [this.getDownloadPluginsHTML(), <div className='resource-blank' />];
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
            walletRef={this.walletRef}
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
