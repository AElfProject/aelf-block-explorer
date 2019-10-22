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
      lastestUnlockTime: null
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    // this.handleClaimDividendClick = this.handleClaimDividendClick.bind(this);
    // this.updateWallet = this.updateWallet.bind(this);
    this.handleUpdateWalletClick = this.handleUpdateWalletClick.bind(this);
  }

  // todo: combine
  // componentDidMount() {
  //   const { contractsStore } = this.props;
  //   console.log('Mount');
  //   if (contractsStore.electionContract !== null) {
  //     athis.fetchData();
  //   }
  // }

  componentDidUpdate(prevProps) {
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
      this.fetchWalletBalance();
    }

    console.log('electionContractFromExt', electionContractFromExt);

    if (electionContractFromExt !== prevProps.electionContractFromExt) {
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
    console.log({
      shouldRefreshMyWallet
    });
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
    const { electionContractFromExt } = this.props;
    const currentWallet = getCurrentWallet();

    return electionContractFromExt.GetElectorVoteWithRecords.call({
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

    const currentWallet = getCurrentWallet();

    return (
      <section className={`${clsPrefix}`}>
        <div className={`${clsPrefix}-header`}>
          <h2 className={`${clsPrefix}-header-title`}>我的钱包</h2>
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
            {/* todo: extract the lis code in ul */}
            <ul className={`${clsPrefix}-body-wallet-content`}>
              <li>资产总数： {thousandsCommaWithDecimal(totalAssets)}</li>
              <li>可用余额： {thousandsCommaWithDecimal(balance)}</li>
              <li>
                待领取分红金额： {dividends.total.toFixed(2)}
                <Button
                  shape='round'
                  className={`${clsPrefix}-body-wallet-content-withdraw-btn`}
                  onClick={handleDividendClick}
                >
                  领取
                </Button>
              </li>
              <li>
                投票总数： {thousandsCommaWithDecimal(activeVotedVotesAmount)}
              </li>
              <li>
                赎回总数：{' '}
                {thousandsCommaWithDecimal(withdrawnVotedVotesAmount)}
              </li>
              <li>最近投票到期时间： {lastestUnlockTime}</li>
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
