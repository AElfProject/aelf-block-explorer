/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-12-07 13:16:37
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 17:07:00
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Button, Icon, Modal, message, Spin } from 'antd';
import moment from 'moment';

import './MyWalletCard.less';
// import { inject, observer } from 'mobx-react';
import { thousandsCommaWithDecimal } from '@utils/formater';
import getCurrentWallet from '@utils/getCurrentWallet';
import { ELF_DECIMAL, SYMBOL } from '@src/constants';
import { APPNAME } from '@config/config';
import NightElfCheck from "../../../../utils/NightElfCheck";

// @inject('contractsStore') @observer
// todo: move the code fetch data on the upper component
export default class MyWalletCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unbindAccountModalVisible: false,
      balance: '-',
      withdrawnVotedVotesAmount: '-',
      activeVotedVotesAmount: '-',
      totalAssets: '-',
      loading: false,
      lastestUnlockTime: null // todo: rename the variable
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    // this.handleClaimDividendClick = this.handleClaimDividendClick.bind(this);
    // this.updateWallet = this.updateWallet.bind(this);
    this.handleUpdateWalletClick = this.handleUpdateWalletClick.bind(this);
    this.extensionLogout = this.extensionLogout.bind(this);

    this.hasRun = false;
  }

  // todo: combine
  componentDidMount() {
    const {
      changeVoteState,
      electionContract,
      multiTokenContract,
      profitContractFromExt
    } = this.props;
    if (
      electionContract &&
      multiTokenContract &&
      profitContractFromExt &&
      !this.hasRun
    ) {
      changeVoteState({
        shouldRefreshMyWallet: true
      });
    }
  }

  // todo: maybe we can fetch the data after all contract are ready as it will reduce the difficulty of code and reduce the code by do the same thing in cdm and cdu
  componentDidUpdate(prevProps) {
    // const { checkExtensionLockStatus } = this.props;
    // checkExtensionLockStatus().then(() => {
    this.fetchData(prevProps);
    // });
  }

  fetchData(prevProps) {
    // todo: optimize the judge
    const {
      multiTokenContract,
      electionContract,
      profitContract,
      electionContractFromExt,
      shouldRefreshMyWallet,
      changeVoteState
    } = this.props;
    const { activeVotedVotesAmount, balance } = this.state;

    if (multiTokenContract !== prevProps.multiTokenContract) {
      this.hasRun = true;
      this.fetchWalletBalance();
    }

    if (electionContract !== prevProps.electionContract) {
      this.fetchElectorVoteInfo();
    }

    // todo: maybe we need to use electionContractFromExt instead
    // After get balance and lockAmount, calculate the total assets
    if (
      electionContract &&
      multiTokenContract &&
      activeVotedVotesAmount !== '-' &&
      balance !== '-'
    ) {
      this.computedTotalAssets();
    }

    // if (profitContract !== prevProps.profitContract) {
    //   this.fetchProfitAmount();
    // }

    if (shouldRefreshMyWallet) {
      changeVoteState(
        {
          shouldRefreshMyWallet: false
        },
        () => {
          this.setState({
            loading: true
          });
          this.updateWallet().then(() => {
            this.setState({
              loading: false
            });
          });
        }
      );
    }
  }

  fetchWalletBalance() {
    const { multiTokenContract } = this.props;
    console.log('SYMBOL', SYMBOL);
    const currentWallet = getCurrentWallet();
    console.log('currentWallet', currentWallet);
    return multiTokenContract.GetBalance.call({
      symbol: SYMBOL,
      owner: currentWallet.address
    })
      .then(res => {
        this.setState({
          balance: +res.balance / ELF_DECIMAL
        });
      })
      .catch(err => console.error('fetchWalletBalance', err));
  }

  fetchElectorVoteInfo() {
    const { electionContract } = this.props;
    const currentWallet = getCurrentWallet();

    return electionContract.GetElectorVoteWithRecords.call({
      value: currentWallet.pubKey
    })
      .then(res => {
        console.log('fetchElectorVoteInfo', res);
        let { activeVotedVotesAmount } = res;
        const { allVotedVotesAmount, activeVotingRecords } = res;
        if (activeVotedVotesAmount) {
          this.computedLastestUnlockTime(activeVotingRecords);
        }
        activeVotedVotesAmount = +activeVotedVotesAmount;
        const withdrawnVotedVotesAmount =
          allVotedVotesAmount - activeVotedVotesAmount;
        this.setState({
          activeVotedVotesAmount,
          withdrawnVotedVotesAmount
        });
      })
      .catch(err => {
        console.error('fetchElectorVoteInfo', err);
      });
  }

  computedLastestUnlockTime(activeVotingRecords) {
    const lastestUnlockTimestamp = activeVotingRecords.sort(
      (a, b) => a.unlockTimestamp.seconds - b.unlockTimestamp.seconds
    )[0];

    const lastestUnlockTime = moment
      .unix(lastestUnlockTimestamp.unlockTimestamp.seconds)
      .format('YYYY-MM-DD  HH:mm:ss');
    this.setState({
      lastestUnlockTime
    });
  }

  computedTotalAssets() {
    const { activeVotedVotesAmount, balance } = this.state;
    console.log('balance', balance);
    console.log('activeVotedVotesAmount', activeVotedVotesAmount);
    this.setState({
      totalAssets: activeVotedVotesAmount + balance
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleOk() {
    const currentWallet = getCurrentWallet();

    window.NightElf.api({
      appName: APPNAME,
      method: 'REMOVE_KEYPAIR',
      chainId: 'AELF',
      payload: {
        address: currentWallet.address
      }
    }).then(result => {
      console.log('>>>>>>>>>>>>>>>>>>>', result);
    });
    // this.setState({
    //   unbindAccountModalVisible: false
    // });
  }

  handleCancel() {
    this.setState({
      unbindAccountModalVisible: false
    });
  }

  showModal() {
    this.setState({
      unbindAccountModalVisible: true
    });
  }

  // handleClaimDividendClick() {
  //   Modal.success({
  //     title: 'You has succeed in getting dividens.',
  //     centered: true
  //   });
  // }

  updateWallet() {
    return Promise.all([this.fetchWalletBalance(), this.fetchElectorVoteInfo()])
      .then(() => {
        this.computedTotalAssets();
      })
      .catch(err => {
        console.error('updateWallet', err);
      });
    // this.fetchProfitAmount();
  }

  handleUpdateWalletClick() {
    const { changeVoteState, checkExtensionLockStatus } = this.props;
    checkExtensionLockStatus().then(() => {
      changeVoteState({
        shouldRefreshMyWallet: true
      });
    });
  }

  extensionLogout() {
    const nightElf = NightElfCheck.getAelfInstanceByExtension();
    const currentWallet = getCurrentWallet();
    nightElf.logout({
      appName: APPNAME,
      address: currentWallet.address
    }, (error, result) => {
      localStorage.removeItem('currentWallet');
      this.handleUpdateWalletClick();
      // TODO: more refactor actions for login and logout
      message.success('Logout successful, refresh after 3s.', 3, () => {
        window.location.reload();
      });
    }).catch(error => {
      message.error('logout failed');
    });
  }

  render() {
    const { handleDividendClick, dividends } = this.props;
    const {
      unbindAccountModalVisible,
      balance,
      withdrawnVotedVotesAmount,
      activeVotedVotesAmount,
      totalAssets,
      loading,
      lastestUnlockTime
    } = this.state;

    const walletItems = [
      {
        type: 'Total assets',
        value: thousandsCommaWithDecimal(totalAssets)
      },
      {
        type: 'Balance',
        value: thousandsCommaWithDecimal(balance)
      },
      {
        type: 'Claimable profit',
        value: dividends.total.toFixed(2),
        extra: (
          <Button
            type="primary"
            size="small"
            shape="round"
            className={'my-wallet-card-body-wallet-content-withdraw-btn'}
            onClick={handleDividendClick}
          >
            Claim
          </Button>
        )
      },
      {
        type: 'Active votes',
        value: thousandsCommaWithDecimal(activeVotedVotesAmount, false)
      },
      {
        type: 'Redeemed votes',
        value: thousandsCommaWithDecimal(withdrawnVotedVotesAmount, false)
      },
      {
        type: 'Earlyest vote expired time',
        value: thousandsCommaWithDecimal(lastestUnlockTime)
      }
    ];

    const currentWallet = getCurrentWallet();

    return (
      <section className="my-wallet-card has-mask-on-mobile">
        <div className="my-wallet-card-header">
          <h2 className="my-wallet-card-header-title">
            <Icon
              type="wallet"
              theme="filled"
              className="card-header-icon"
            />
            My Wallet
          </h2>
          { currentWallet && currentWallet.name && <Button
            className="my-wallet-card-header-sync-btn update-btn"
            disabled={!(currentWallet && currentWallet.address)}
            onClick={this.extensionLogout}
          >
            change wallet<Icon type="logout"/>
          </Button>}
          <Button
            className="my-wallet-card-header-sync-btn update-btn"
            disabled={!(currentWallet && currentWallet.address)}
            onClick={this.handleUpdateWalletClick}
          >
            <Icon type="sync" spin={loading} />
          </Button>
        </div>
        <div className="my-wallet-card-body-wallet-title">
          <span className="my-wallet-card-body-wallet-title-key">Name: </span>
          <span className="primary-color">{currentWallet.name}</span>
          <span className="my-wallet-card-body-wallet-title-blank"/>
          <span className="my-wallet-card-body-wallet-title-key">
            Address:{' '}
          </span>
          <span className="primary-color">
            {currentWallet.formattedAddress}
          </span>
          {/*<h3 className='my-wallet-card-body-wallet-title-name'>*/}
          {/*{currentWallet.name}*/}
          {/*</h3>*/}
          {/* <Button shape='round' onClick={this.showModal}>
              解除绑定
            </Button> */}
        </div>
        <Spin spinning={loading}>
          <div className="my-wallet-card-body">
            <ul className="my-wallet-card-body-wallet-content">
              {walletItems.map(item => {
                return (
                  <li>
                    <span className="item-type">{item.type}:</span>
                    <span className="item-value">{item.value}</span>
                    <span className="item-extra">{item.extra}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Spin>

        <Modal
          className="unbind-account-modal"
          title="Unbind Account"
          visible={unbindAccountModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="Authorize"
          centered
          maskClosable
          keyboard
          okButtonProps={{ 'data-shoulddetectlock': true }}
        >
          <p style={{ marginTop: 10 }}>请求NightELF插件授权解除绑定</p>
        </Modal>
      </section>
    );
  }
}
