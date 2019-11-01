import React, { PureComponent } from 'react';
import { Button, Icon, Modal, message, Spin } from 'antd';
import moment from 'moment';

import './index.less';
// import { inject, observer } from 'mobx-react';
import { thousandsCommaWithDecimal } from '@utils/formater';
import getCurrentWallet from '@utils/getCurrentWallet';
import { ELF_DECIMAL, SYMBOL } from '@src/constants';
import { APPNAME } from '@config/config';
import { schemeIds } from '@pages/Vote/constants';

const clsPrefix = 'my-wallet-card';

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
    this.fetchData(prevProps);
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

    console.log('electionContractFromExt', electionContractFromExt);

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
    checkExtensionLockStatus()
      .then(() => {
        changeVoteState({
          shouldRefreshMyWallet: true
        });
      })
      .catch(err => {
        console.error('checkExtensionLockStatus', err);
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
    console.log({
      balance,
      withdrawnVotedVotesAmount,
      activeVotedVotesAmount,
      totalAssets,
      loading
    });

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
            shape='round'
            className={`${clsPrefix}-body-wallet-content-withdraw-btn`}
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
      <section className={`${clsPrefix}`}>
        <div className={`${clsPrefix}-header`}>
          <h2 className={`${clsPrefix}-header-title`}>My Wallet</h2>
          <button
            className={`${clsPrefix}-header-sync-btn`}
            onClick={this.handleUpdateWalletClick}
          >
            <Icon type='sync' />
          </button>
        </div>
        <Spin spinning={loading}>
          <div className={`${clsPrefix}-body`}>
            <div className={`${clsPrefix}-body-wallet-title`}>
              <h3 className={`${clsPrefix}-body-wallet-title-name`}>
                {currentWallet.name}
              </h3>
              {/* <Button shape='round' onClick={this.showModal}>
              解除绑定
            </Button> */}
            </div>
            <ul className={`${clsPrefix}-body-wallet-content`}>
              {walletItems.map(item => {
                return (
                  <li>
                    {item.type}:
                    <span className='wallet-item-value'>{item.value}</span>
                    {item.extra}
                  </li>
                );
              })}
            </ul>
          </div>
        </Spin>

        <Modal
          className='unbind-account-modal'
          title='Unbind Account'
          visible={unbindAccountModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='Authorize'
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
