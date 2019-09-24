import React, { PureComponent } from 'react';
import { Button, Icon, Modal, message } from 'antd';
import moment from 'moment';

import './index.less';
// import { inject, observer } from 'mobx-react';
import { thousandsCommaWithDecimal } from '@utils/formater';
import getCurrentWallet from '@utils/getCurrentWallet';
import { TOKEN_CONTRACT_DECIMAL, SYMBOL } from '@src/constants';
import { APPNAME } from '@config/config';
import { schemeIds } from '@src/pages/Vote/constants';

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
      totalAssets: '-'
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleGetDividens = this.handleGetDividens.bind(this);
    this.updateWallet = this.updateWallet.bind(this);
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
    const { multiTokenContract, electionContract, profitContract } = this.props;
    const { activeVotedVotesAmount, balance } = this.state;

    if (multiTokenContract !== prevProps.multiTokenContract) {
      this.fetchWalletBalance();
    }

    if (electionContract !== prevProps.electionContract) {
      this.fetchElectorVoteInfo();
    }

    // After get balance and lockAmount, calculate the total assets
    if (
      electionContract &&
      multiTokenContract &&
      activeVotedVotesAmount !== '-' &&
      balance !== '-'
    ) {
      this.computedTotalAssets();
    }

    if (profitContract !== prevProps.profitContract) {
      this.fetchProfitAmount();
    }
  }

  fetchWalletBalance() {
    const { multiTokenContract } = this.props;
    console.log('SYMBOL', SYMBOL);
    const currentWallet = getCurrentWallet();
    console.log('currentWallet', currentWallet);
    multiTokenContract.GetBalance.call({
      symbol: SYMBOL,
      owner: currentWallet.address
    })
      .then(res => {
        this.setState({
          balance: +res.balance / TOKEN_CONTRACT_DECIMAL
        });
      })
      .catch(err => console.error('fetchWalletBalance', err));
  }

  fetchElectorVoteInfo() {
    const { electionContract } = this.props;
    const currentWallet = getCurrentWallet();

    electionContract.GetElectorVoteWithRecords.call({
      value: currentWallet.pubKey
    })
      .then(res => {
        console.log('res', res);
        let { activeVotedVotesAmount } = res;
        const { allVotedVotesAmount, activeVotingRecords } = res;
        this.computedLastestUnlockTime(activeVotingRecords);
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
    // todo: time is wrong
    console.log('lastestUnlockTimestamp', moment().set('second', lastestUnlockTimestamp.unlockTimestamp.seconds).format("YYYY-MM-DD"));
  }

  fetchProfitAmount() {
    const { profitContract, dividendContract } = this.props;
    profitContract.GetProfitAmount.call({
      schemeId: schemeIds.CitizenWelfare,
      symbol: SYMBOL
    })
      .then(res => {
        console.log('GetScheme', res);
      })
      .catch(err => {
        console.error('GetScheme', err);
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

  handleGetDividens() {
    Modal.success({
      title: 'You has succeed in getting dividens.',
      centered: true
    });
  }

  updateWallet() {
    this.fetchWalletBalance();
    this.fetchElectorVoteInfo();
    this.computedTotalAssets();
    this.fetchProfitAmount();
  }

  render() {
    const {
      unbindAccountModalVisible,
      balance,
      withdrawnVotedVotesAmount,
      activeVotedVotesAmount,
      totalAssets
    } = this.state;
    console.log('totalAssets', totalAssets);

    const currentWallet = getCurrentWallet();

    return (
      <section className={`${clsPrefix}`}>
        <div className={`${clsPrefix}-header`}>
          <h2 className={`${clsPrefix}-header-title`}>我的钱包</h2>
          <button
            className={`${clsPrefix}-header-sync-btn`}
            onClick={this.updateWallet}
          >
            <Icon type='sync' />
          </button>
        </div>
        <div className={`${clsPrefix}-body`}>
          <div className={`${clsPrefix}-body-wallet-title`}>
            <h3 className={`${clsPrefix}-body-wallet-title-name`}>
              {currentWallet.name}
            </h3>
            <Button shape='round' onClick={this.showModal}>
              解除绑定
            </Button>
          </div>
          <ul className={`${clsPrefix}-body-wallet-content`}>
            <li>资产总数： {thousandsCommaWithDecimal(totalAssets)}</li>
            <li>可用余额： {thousandsCommaWithDecimal(balance)}</li>
            <li>
              待领取分红金额： 91.0000
              <Button
                shape='round'
                className={`${clsPrefix}-body-wallet-content-withdraw-btn`}
                onClick={this.handleGetDividens}
              >
                领取
              </Button>
            </li>
            <li>
              投票总数： {thousandsCommaWithDecimal(activeVotedVotesAmount)}
            </li>
            <li>
              赎回总数： {thousandsCommaWithDecimal(withdrawnVotedVotesAmount)}
            </li>
            <li>最近投票到期时间： 2019/11/2</li>
          </ul>
        </div>

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
          okButtonProps={{ 'data-shouldDetectLock': true }}
        >
          <p style={{ marginTop: 10 }}>请求NightELF插件授权解除绑定</p>
        </Modal>
      </section>
    );
  }
}
