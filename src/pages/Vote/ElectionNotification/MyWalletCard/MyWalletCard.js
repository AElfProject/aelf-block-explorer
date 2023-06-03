/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-12-07 13:16:37
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 17:07:00
 * @Description: file content
 */
import React, { PureComponent } from "react";
import { Button, message, Spin } from "antd";
import moment from "moment";
import { SyncOutlined, WalletFilled, LogoutOutlined } from "@ant-design/icons";
import { thousandsCommaWithDecimal } from "@utils/formater";
import { ELF_DECIMAL, SYMBOL } from "@src/constants";
import { WebLoginState } from "aelf-web-login";
import { connect } from "react-redux";
import { isPhoneCheck } from "../../../../utils/deviceCheck";
import Dividends from "../../../../components/Dividends";
import addressFormat from "../../../../utils/addressFormat";
import "./MyWalletCard.less";
import { WebLoginInstance } from "../../../../utils/webLogin";

class MyWalletCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      balance: "-",
      withdrawnVotedVotesAmount: "-",
      activeVotedVotesAmount: "-",
      totalAssets: "-",
      loading: false,
      lastestUnlockTime: null, // todo: rename the variable
    };
    this.isPhone = isPhoneCheck();
    this.handleUpdateWalletClick = this.handleUpdateWalletClick.bind(this);
    this.extensionLogout = this.extensionLogout.bind(this);
    this.loginOrUnlock = this.loginOrUnlock.bind(this);
    this.hasRun = false;
  }

  componentDidMount() {
    const {
      currentWallet,
      changeVoteState,
      electionContract,
      multiTokenContract,
      profitContractFromExt,
    } = this.props;
    if (
      electionContract &&
      multiTokenContract &&
      profitContractFromExt &&
      !this.hasRun
    ) {
      changeVoteState({
        shouldRefreshMyWallet: true,
      });
    }
    // jump from other page with wallet address
    if (currentWallet?.address) {
      this.fetchData();
    }
  }

  loginOrUnlock() {
    WebLoginInstance.get()
      .loginAsync()
      .then(() => {
        this.handleUpdateWalletClick();
      });
  }

  // todo: maybe we can fetch the data after all contract are ready as it will reduce the difficulty of code and reduce the code by do the same thing in cdm and cdu
  componentDidUpdate(prevProps) {
    const { currentWallet, shouldRefreshMyWallet } = this.props;
    if (
      (currentWallet &&
        currentWallet.address !== prevProps?.currentWallet?.address) ||
      shouldRefreshMyWallet
    )
      this.fetchData(prevProps);
  }

  fetchData(prevProps) {
    const {
      multiTokenContract,
      electionContract,
      shouldRefreshMyWallet,
      changeVoteState,
    } = this.props;
    const { activeVotedVotesAmount, balance } = this.state;

    if (
      multiTokenContract &&
      multiTokenContract !== prevProps?.multiTokenContract
    ) {
      this.hasRun = true;
      this.fetchWalletBalance();
    }

    if (
      electionContract &&
      electionContract !== prevProps?.electionContract &&
      electionContract
    ) {
      this.fetchElectorVoteInfo();
    }

    // todo: maybe we need to use electionContractFromExt instead
    // After get balance and lockAmount, calculate the total assets
    if (
      electionContract &&
      multiTokenContract &&
      activeVotedVotesAmount !== "-" &&
      balance !== "-"
    ) {
      this.computedTotalAssets();
    }

    if (shouldRefreshMyWallet) {
      changeVoteState(
        {
          shouldRefreshMyWallet: false,
        },
        () => {
          this.setState({
            loading: true,
          });
          this.updateWallet().then(() => {
            this.setState({
              loading: false,
            });
          });
        }
      );
    }
  }

  fetchWalletBalance() {
    const { multiTokenContract, currentWallet } = this.props;
    if (!currentWallet?.address) {
      return false;
    }
    return multiTokenContract.GetBalance.call({
      symbol: SYMBOL,
      owner: currentWallet.address,
    })
      .then((res) => {
        this.setState({
          balance: +res.balance / ELF_DECIMAL,
        });
      })
      .catch((err) => console.error("fetchWalletBalance", err));
  }

  fetchElectorVoteInfo() {
    const { electionContract, currentWallet } = this.props;
    if (!currentWallet || !currentWallet.address || !electionContract) {
      return false;
    }
    return electionContract.GetElectorVoteWithRecords.call({
      value: currentWallet.publicKey,
    })
      .then((res) => {
        let { activeVotedVotesAmount } = res;
        const { allVotedVotesAmount, activeVotingRecords } = res;
        if (activeVotedVotesAmount) {
          this.computedLastestUnlockTime(activeVotingRecords);
        }
        activeVotedVotesAmount = +activeVotedVotesAmount;
        const withdrawnVotedVotesAmount =
          allVotedVotesAmount - activeVotedVotesAmount;
        this.setState({
          activeVotedVotesAmount: activeVotedVotesAmount / ELF_DECIMAL,
          withdrawnVotedVotesAmount: withdrawnVotedVotesAmount / ELF_DECIMAL,
        });
      })
      .catch((err) => {
        console.error("fetchElectorVoteInfo", err);
      });
  }

  computedLastestUnlockTime(activeVotingRecords) {
    const lastestUnlockTimestamp = activeVotingRecords.sort(
      (a, b) => a.unlockTimestamp.seconds - b.unlockTimestamp.seconds
    )[0];

    const lastestUnlockTime = moment
      .unix(lastestUnlockTimestamp.unlockTimestamp.seconds)
      .format("YYYY-MM-DD  HH:mm:ss");
    this.setState({
      lastestUnlockTime,
    });
  }

  computedTotalAssets() {
    const { activeVotedVotesAmount, balance } = this.state;
    this.setState({
      totalAssets: activeVotedVotesAmount + balance,
    });
  }

  updateWallet() {
    return Promise.all([this.fetchWalletBalance(), this.fetchElectorVoteInfo()])
      .then(() => {
        this.computedTotalAssets();
      })
      .catch((err) => {
        console.error("updateWallet", err);
      });
  }

  handleUpdateWalletClick() {
    const { changeVoteState } = this.props;
    changeVoteState({
      shouldRefreshMyWallet: true,
    });
  }

  extensionLogout() {
    WebLoginInstance.get()
      .logoutAsync()
      .then(
        () => {
          message.success("Logout successful, refresh after 3s.", 3, () => {
            window.location.reload();
          });
        },
        () => {
          message.error("logout failed");
        }
      );
  }

  render() {
    const { handleDividendClick, dividends, currentWallet } = this.props;
    const {
      balance,
      withdrawnVotedVotesAmount,
      activeVotedVotesAmount,
      totalAssets,
      loading,
      lastestUnlockTime,
    } = this.state;
    const { loginState } = WebLoginInstance.get().getWebLoginContext();
    const formattedAddress = addressFormat(currentWallet.address);
    const walletItems = [
      {
        type: "Total assets",
        value: thousandsCommaWithDecimal(totalAssets),
      },
      {
        type: "Balance",
        value: thousandsCommaWithDecimal(balance),
      },
      {
        type: "Claimable profit",
        value: (
          <Dividends className="wallet-dividends" dividends={dividends.total} />
        ),
        extra: (
          <Button
            type="primary"
            size="small"
            shape="round"
            className="my-wallet-card-body-wallet-content-withdraw-btn"
            onClick={handleDividendClick}
          >
            Claim
          </Button>
        ),
      },
      {
        type: "Active votes",
        value: thousandsCommaWithDecimal(activeVotedVotesAmount),
      },
      {
        type: "Redeemed votes",
        value: thousandsCommaWithDecimal(withdrawnVotedVotesAmount),
      },
      {
        type: "Earliest vote expired time",
        value: thousandsCommaWithDecimal(lastestUnlockTime),
      },
    ];

    return (
      <section className="my-wallet-card">
        <Spin spinning={loading}>
          <div className="my-wallet-card-header">
            <h2 className="my-wallet-card-header-title">
              <WalletFilled className="card-header-icon" />
              My Wallet
            </h2>
            {(loginState === WebLoginState.initial ||
              loginState === WebLoginState.lock ||
              loginState === WebLoginState.logining) && (
              <Button
                type="text"
                className="my-wallet-card-header-sync-btn update-btn"
                onClick={this.loginOrUnlock}
              >
                Login
              </Button>
            )}
            <Button
              type="text"
              className="my-wallet-card-header-sync-btn update-btn"
              disabled={!currentWallet?.address}
              onClick={this.handleUpdateWalletClick}
            >
              Refresh
              <SyncOutlined spin={loading} />
            </Button>

            {!this.isPhone && currentWallet?.address && (
              <Button
                type="text"
                className="my-wallet-card-header-sync-btn update-btn"
                disabled={!currentWallet?.address}
                onClick={this.extensionLogout}
              >
                Logout
                <LogoutOutlined className="card-header-icon" />
              </Button>
            )}
          </div>
          <div className="my-wallet-card-body-wallet-title">
            {isPhoneCheck() ? (
              <>
                <div>
                  <span className="my-wallet-card-body-wallet-title-key">
                    Name:{" "}
                  </span>
                  <span className="primary-color">{currentWallet?.name}</span>
                </div>
                <div>
                  <span className="my-wallet-card-body-wallet-title-key">
                    Address:{" "}
                  </span>
                  <span className="primary-color">{formattedAddress}</span>
                </div>
              </>
            ) : (
              <>
                <span className="my-wallet-card-body-wallet-title-key">
                  Name:{" "}
                </span>
                <span className="primary-color">{currentWallet?.name}</span>
                <span className="my-wallet-card-body-wallet-title-blank" />
                <span className="my-wallet-card-body-wallet-title-key">
                  Address:{" "}
                </span>
                <span className="primary-color">{formattedAddress}</span>
              </>
            )}
          </div>
          <div className="my-wallet-card-body">
            <ul className="my-wallet-card-body-wallet-content">
              {walletItems.map((item) => (
                <li key={item.type}>
                  <span className="item-type">{item.type}:</span>
                  <span className="item-value">{item.value}</span>
                  <span className="item-extra">{item.extra}</span>
                </li>
              ))}
            </ul>
          </div>
        </Spin>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentWallet } = state.common;
  return {
    currentWallet,
  };
};

export default connect(mapStateToProps)(MyWalletCard);
