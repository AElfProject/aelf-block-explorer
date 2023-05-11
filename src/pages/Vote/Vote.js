/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:47:40
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 16:56:29
 * @Description: pages for vote & election
 */
import React, { Component } from "react";
import { Modal, Form, Input, message, Menu } from "antd";
import { Route, Routes } from "react-router-dom";
import { Provider } from "mobx-react";
import moment from "moment";
import NightElfCheck from "@utils/NightElfCheck";
import { isPhoneCheck } from "@utils/deviceCheck";
import { thousandsCommaWithDecimal } from "@utils/formater";
import getContractAddress from "@utils/getContractAddress";
import DownloadPlugins from "@components/DownloadPlugins/DownloadPlugins";
// import NumericInput from '@components/NumericInput';
import config, { APPNAME, schemeIds } from "@config/config";
import { aelf } from "@src/utils";
// import voteStore from '@store/vote';
import contractsStore from "@store/contracts";
import Decimal from "decimal.js";
import { SYMBOL, ELF_DECIMAL, NEED_PLUGIN_AUTHORIZE_TIP } from "@src/constants";
import getStateJudgment from "@utils/getStateJudgment";
import getCurrentWallet from "@utils/getCurrentWallet";
import publicKeyToAddress from "@utils/publicKeyToAddress";
import { getAllTeamDesc } from "@api/vote";
import "./index.less";
import MyVote from "./MyVote/MyVote";
import ElectionNotification from "./ElectionNotification/ElectionNotification";
import KeyInTeamInfo from "./KeyInTeamInfo";
import TeamDetail from "./TeamDetail";
import VoteModal from "./VoteModal";
import DividendModal from "./DividendModal";
import RedeemModal from "./RedeemModal";
// eslint-disable-next-line import/no-named-as-default
import RedeemAnVoteModal from "./RedeemAnVoteModal";
// todo: use a import instead
import * as constants from "./constants";
import {
  contractsNeedToLoad,
  FROM_WALLET,
  FROM_EXPIRED_VOTES,
  FROM_ACTIVE_VOTES,
  routePaths,
} from "./constants";
import { getFormatedLockTime } from "./utils";
import getAllTokens from "../../utils/getAllTokens";
import { getPublicKeyFromObject } from "../../utils/getPublicKey";
import addressFormat from "../../utils/addressFormat";
import getLogin from "../../utils/getLogin";
import { withRouter } from "../../routes/utils";

const voteConfirmFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

class VoteContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // todo: sort out the state
      nightElf: null,

      voteModalVisible: false,
      pluginLockModalVisible: false,
      voteConfirmModalVisible: false,
      voteRedeemModalVisible: false,
      voteConfirmForm: {},
      voteRedeemForm: {},
      // eslint-disable-next-line react/no-unused-state
      voteFrom: 1,
      currentWallet: null,
      consensusContract: contractsStore.consensusContract,
      dividendContract: contractsStore.dividendContract,
      multiTokenContract: contractsStore.multiTokenContract,
      voteContract: contractsStore.voteContract,
      electionContract: contractsStore.electionContract,
      profitContract: contractsStore.profitContract,
      // eslint-disable-next-line react/no-unused-state
      voteContractFromExt: null,
      electionContractFromExt: null,
      profitContractFromExt: null,

      showDownloadPlugin: false,
      balance: null,
      formattedBalance: null,
      nodeAddress: null,
      nodeName: null,
      currentWalletName: null,
      voteAmountInput: null,
      lockTime: null,
      isCandidate: false, // todo: Rename as isCurrentCandidate
      expiredVotesAmount: 0,
      activeVotingRecords: [],
      switchableVoteRecords: [],
      withdrawnableVoteRecords: [],
      switchVoteAmount: 0,
      voteFromExpiredVoteAmount: null,
      voteType: FROM_WALLET,
      switchVoteSelectedRowKeys: [],
      voteFromExpiredSelectedRowKeys: [],
      dividendModalVisible: false,
      dividends: {
        total: {},
        amounts: schemeIds.map((v) => ({
          ...v,
          amount: {},
        })),
      },
      // todo: remove useless state
      totalVoteAmountForOneCandidate: 0,
      totalWithdrawnableVoteAmountForOneCandidate: 0,
      redeemableVoteRecordsForOneCandidate: [],
      activeVoteRecordsForOneCandidate: [],
      redeemVoteSelectedRowKeys: [],

      targetPublicKey: null,
      nodeTableRefreshTime: new Date().getTime(),
      shouldRefreshNodeTable: false,
      shouldRefreshMyWallet: false,
      shouldRefreshElectionNotifiStatis: false,
      shouldJudgeIsCurrentCandidate: true,
      voteToRedeem: {
        nodeName: null,
        nodeAddress: null,
        amount: null,
        voteId: {
          value: null,
        },
      },
      redeemOneVoteModalVisible: false,
      voteConfirmLoading: false, // with setVoteConfirmLoading
      redeemConfirmLoading: false, // with setVoteConfirmLoading
      isPluginLock: false,
      dividendLoading: false,
      claimLoading: false,
    };

    this.isPhone = isPhoneCheck();
    this.loginMessageLock = false;
    this.loginPlugin = this.loginPlugin.bind(this);

    this.changeModalVisible = this.changeModalVisible.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleLockTimeChange = this.handleLockTimeChange.bind(this);
    this.handleVoteConfirmOk = this.handleVoteConfirmOk.bind(this);
    this.handleVoteTypeChange = this.handleVoteTypeChange.bind(this);
    this.handleSwitchVoteSelectedRowChange =
      this.handleSwitchVoteSelectedRowChange.bind(this);
    this.handleVoteFromExpiredSelectedRowChange =
      this.handleVoteFromExpiredSelectedRowChange.bind(this);
    this.handleRedeemVoteSelectedRowChange =
      this.handleRedeemVoteSelectedRowChange.bind(this);
    this.handleRedeemConfirm = this.handleRedeemConfirm.bind(this);
    this.handleDividendClick = this.handleDividendClick.bind(this);
    this.handleClaimDividendClick = this.handleClaimDividendClick.bind(this);
    this.changeVoteState = this.changeVoteState.bind(this);
    this.checkExtensionLockStatus = this.checkExtensionLockStatus.bind(this);
    this.handleRedeemOneVoteConfirm =
      this.handleRedeemOneVoteConfirm.bind(this);
    this.hasGetContractsFromExt = false;
    this.setVoteConfirmLoading = this.setVoteConfirmLoading.bind(this);
    this.setRedeemConfirmLoading = this.setRedeemConfirmLoading.bind(this);
    this.setClaimLoading = this.setClaimLoading.bind(this);
    this.judgeCurrentUserIsCandidate =
      this.judgeCurrentUserIsCandidate.bind(this);
  }

  async componentDidMount() {
    // Get contracts
    try {
      const result = await getContractAddress();
      if (!result.chainInfo) {
        message.error(
          "The chain has stopped or cannot be connected to the chain. Please check your network or contact us.",
          10
        );
        return;
      }
      contractsNeedToLoad.forEach((contractItem, index) => {
        this.getContractByContractAddress(
          result,
          contractItem.contractAddrValName,
          contractItem.contractNickname
        );
      });
    } catch (e) {
      // message.error(e);
      console.error(e);
    }

    const wallet = JSON.parse(localStorage.getItem("currentWallet"));
    if (
      wallet &&
      new Date().valueOf() - Number(wallet.timestamp) < 15 * 60 * 1000
    ) {
      this.setState({
        currentWallet: {
          ...wallet,
          pubkey: getPublicKeyFromObject(wallet.publicKey),
        },
      });
    } else {
      localStorage.removeItem("currentWallet");
      this.setState({
        currentWallet: null,
      });
    }

    this.getExtensionKeyPairList();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      shouldRefreshMyWallet,
      electionContract,
      currentWallet,
      shouldJudgeIsCurrentCandidate,
    } = this.state;
    if (shouldRefreshMyWallet) {
      // todo: put the method fetchProfitAmount run with the refresh of wallet
      this.fetchProfitAmount();
    }

    if (electionContract && currentWallet && shouldJudgeIsCurrentCandidate) {
      this.judgeCurrentUserIsCandidate();
    }
  }

  setVoteConfirmLoading(isLoading) {
    this.setState({
      voteConfirmLoading: isLoading,
    });
  }

  setRedeemConfirmLoading(isLoading) {
    this.setState({
      redeemConfirmLoading: isLoading,
    });
  }

  setClaimLoading(isLoading) {
    this.setState({
      claimLoading: isLoading,
    });
  }

  getWalletBalance() {
    const { currentWallet, multiTokenContract } = this.state;
    return multiTokenContract.GetBalance.call({
      symbol: SYMBOL,
      owner: currentWallet.address,
    });
  }

  /**
   * @description
   * @param {*} result
   * @param {*} contractNickname e.g. nickname: election, formal name: AElf.ContractNames.Election
   * @memberof ElectionNotification
   */
  getContractByContractAddress(result, contractAddrValName, contractNickname) {
    // TODO: 补充error 逻辑
    // FIXME: why can't I get the contract by contract name ? In aelf-command it works.
    console.log("result[contractAddrValName]", result[contractAddrValName]);
    aelf.chain
      .contractAt(result[contractAddrValName], result.wallet)
      .then((res) => {
        contractsStore.setContract(contractNickname, res);
        this.setState(
          { [contractNickname]: contractsStore[contractNickname] },
          () => {
            // todo: use switch/case
            if (contractNickname === "consensusContract") {
              // todo: what's this used for?
              this.chainInfo = res;
              // todo: We shouldn't get vote info by consensus contract
              // this.getInformation(result);
            }

            // if (contractNickname === 'profitContract') {
            //   this.fetchProfitAmount();
            // }
          }
        );
      })
      .catch((err) => console.error("err", err));
  }

  getExtensionKeyPairList() {
    NightElfCheck.getInstance()
      .check.then((item) => {
        if (item) {
          const nightElf = NightElfCheck.getAelfInstanceByExtension();
          if (nightElf) {
            if (typeof nightElf.getExtensionInfo === "function") {
              nightElf.getExtensionInfo().then((info) => {
                this.setState({
                  isPluginLock: info.locked,
                });
                if (!info.locked) {
                  this.getChainStatus(nightElf);
                } else {
                  localStorage.removeItem("currentWallet");
                }
              });
            } else {
              this.getChainStatus(nightElf);
            }

            this.setState({
              nightElf,
            });
          }
        }
      })
      .catch((error) => {
        this.setState({
          showDownloadPlugin: true,
        });
      });
  }

  getChainStatus(nightElf) {
    nightElf.chain
      .getChainStatus()
      .then((result) => {
        console.log("nightElf.chain.getChainStatus: ", result);
        if (result) {
          const isPluginLock = result.error === 200005;
          this.setState({ isPluginLock });
          if (isPluginLock) {
            message.warning(result.errorMessage.message, 3);
          }
        }
      })
      .catch((error) => {
        console.log("nightElf.chain.getChainStatus:error", error);
      });
  }

  getNightElfKeyPair(wallet) {
    console.log("getNightElfKeyPair: ", wallet);
    if (!wallet) {
      return;
    }
    wallet.pubkey = getPublicKeyFromObject(wallet.publicKey);
    wallet.formattedAddress = addressFormat(wallet.address);
    localStorage.setItem(
      "currentWallet",
      JSON.stringify({ ...wallet, timestamp: new Date().valueOf() })
    );
    this.setState({
      currentWallet: wallet,
      showWallet: true,
    });
  }

  handleSwitchVoteSelectedRowChange(selectedRowKeys, selectedRows) {
    console.log("selectedRows", selectedRows);
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    const switchVoteAmount = selectedRows.reduce(
      (total, current) => total + +current.amount,
      0
    );
    this.setState({
      switchVoteSelectedRowKeys: selectedRowKeys,
      switchVoteAmount,
    });
  }

  handleVoteFromExpiredSelectedRowChange(selectedRowKeys, selectedRows) {
    console.log("selectedRows", selectedRows);
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    const voteFromExpiredVoteAmount = selectedRows.reduce(
      (total, current) => total + +current.amount,
      0
    );
    this.setState({
      voteFromExpiredSelectedRowKeys: selectedRowKeys,
      voteFromExpiredVoteAmount,
    });
  }

  handleRedeemVoteSelectedRowChange(selectedRowKeys, selectedRows) {
    this.setState({
      redeemVoteSelectedRowKeys: selectedRowKeys,
    });
  }

  loginPlugin() {
    const nightElf = NightElfCheck.getAelfInstanceByExtension();
    const getLoginPayload = {
      appName: APPNAME,
    };
    return new Promise((resolve, reject) => {
      getLogin(nightElf, getLoginPayload, (result) => {
        // todo: try to extract the code handle the result from extension as there are some repeating code
        const {
          error,
          detail,
          errorMessage = {
            message: "Please check your NightELF browser extension.",
          },
        } = result;
        if (error === 0) {
          const wallet = JSON.parse(detail);
          this.getNightElfKeyPair(wallet);
          // todo: Extract
          this.onExtensionAndWalletReady().then(resolve);
          if (!this.loginMessageLock) {
            this.loginMessageLock = true;
            message.success("Login success!!", 3);
          }
        } else {
          localStorage.removeItem("currentWallet");
          const msg =
            error === 200010 ? "Please Login." : errorMessage.message;
          message.warn(msg);
        }
      });
    });
  }

  onExtensionAndWalletReady() {
    return this.fetchContractFromExt()
      .then(() => {
        this.hasGetContractsFromExt = true;
        this.fetchProfitAmount();
      })
      .catch((err) => {
        console.error("fetchContractFromExt", err);
      });
  }

  fetchContractFromExt() {
    const nightElf = NightElfCheck.getAelfInstanceByExtension();
    const { contractsNeedToLoadFromExt } = constants;

    const { address } = getCurrentWallet();
    const wallet = { address };
    // todo: get the contract from extension in cdm or other suitable time
    // todo: using the code as follows instead the repeat code in project
    // todo: error handle
    // todo: If some contract load fail, will it cause problem?
    // todo: Consider to get the contract separately
    return Promise.all(
      contractsNeedToLoadFromExt.map(
        ({ contractAddrValName, contractNickname }) => {
          return nightElf.chain
            .contractAt(config[contractAddrValName], wallet)
            .then((res) => {
              this.setState({
                [contractNickname]: res,
              });
            });
        }
      )
    );
  }

  changeModalVisible(modal, visible) {
    this.setState({
      [modal]: visible,
    });
  }

  changeVoteState(obj, callback) {
    this.setState(obj, callback);
  }

  handleOk(visible, cb) {
    // this.setState({
    //   // ModalText: 'The modal will be closed after two seconds',
    //   // confirmLoading: true,
    // });
    // setTimeout(() => {
    this.setState(
      {
        [visible]: false,
        // confirmLoading: false,
      },
      cb
    );
    // }, 2000);
  }

  handleCancel(visible) {
    this.setState({
      [visible]: false,
    });
  }

  fetchDataVoteNeed() {
    const { electionContract } = this.state;
    const currentWallet = getCurrentWallet();

    Promise.all([
      electionContract.GetElectorVoteWithRecords.call({
        value: currentWallet.pubKey,
      }),
      getAllTeamDesc(),
    ])
      .then((resArr) => {
        this.processDataVoteNeed(resArr);
      })
      .catch((err) => {
        console.error("GetElectorVote", err);
      });
  }

  processDataVoteNeed(resArr) {
    // todo: the process code are  similar, can i unify it? Don't forget to consider the changablity.
    const { targetPublicKey } = this.state;
    const electorVote = resArr[0];
    let allTeamInfo = null;
    let expiredVotesAmount = 0;
    if (resArr[1].code === 0) {
      allTeamInfo = resArr[1].data;
    }
    const { activeVotingRecords, allVotedVotesAmount, activeVotedVotesAmount } =
      electorVote;
    const switchableVoteRecords = [];
    const withdrawableVoteRecords = [];
    activeVotingRecords.forEach((record) => {
      // filter the vote voted to other node
      if (record.candidate === targetPublicKey) return;
      // filter the vote don't expired
      // todo: extract the judge code, there are some same code in page "my vote"
      if (record.unlockTimestamp.seconds > moment().unix()) {
        switchableVoteRecords.push(record);
        return;
      }
      // the vote expired can be withdrawn
      withdrawableVoteRecords.push(record);
      expiredVotesAmount += +record.amount;
    });

    [...switchableVoteRecords, ...withdrawableVoteRecords].forEach((record) => {
      const { voteTimestamp, lockTime } = record;
      const teamInfo = allTeamInfo.find(
        (team) => team.public_key === record.candidate
      );
      if (teamInfo === undefined) {
        record.address = publicKeyToAddress(record.candidate);
        record.name = addressFormat(record.address);
      } else {
        record.name = teamInfo.name;
      }
      // Antd's Table's datasource needs key
      record.key = record.voteId;

      // todo: unify lock time & vote time's handler
      // todo: fix the lock time
      record.formatedLockTime = `${(lockTime / 24 / 60 / 60).toFixed(1)} Days`;
      record.formatedVoteTime = moment
        .unix(voteTimestamp.seconds)
        .format("YYYY-MM-DD HH:mm:ss");
    });

    const switchVoteSelectedRowKeys = switchableVoteRecords.map(
      (ele) => ele.key
    );
    this.setState({
      expiredVotesAmount,
      activeVotingRecords,
      switchableVoteRecords,
      switchVoteSelectedRowKeys,
      withdrawnableVoteRecords: withdrawableVoteRecords,
    });
  }

  judgeCurrentUserIsCandidate() {
    const { electionContract, currentWallet } = this.state;
    this.setState(
      {
        shouldJudgeIsCurrentCandidate: false,
      },
      () => {
        if (!currentWallet.publicKey) {
          console.log(
            "The user didn't storage the publicKey to localStorage yet"
          );
          return;
        }
        // todo: Maybe cause problem if the currentWallet is null
        electionContract.GetCandidateInformation.call({
          value: currentWallet.pubkey,
        })
          .then((res) => {
            this.setState({
              isCandidate: res.isCurrentCandidate,
            });
          })
          .catch((err) => {
            console.error("GetCandidateInformation", err);
          });
      }
    );
  }

  handleClick(e) {
    const ele =
      JSON.stringify(e.target.dataset) !== "{}"
        ? e.target
        : e.target.parentNode;
    const {
      role = "default",
      shoulddetectlock: shouldDetectLock,
      votetype: voteType,
      targetpublickey: targetPublicKey,
    } = ele.dataset;

    const role2Fun = {
      vote: this.handleVote.bind(this, targetPublicKey, voteType, ele),
      redeem: this.handleRedeemClick.bind(this, ele),
      redeemOne: this.handleRedeemOneVote.bind(this, ele),
      default: undefined,
    };

    const { [role]: fun } = role2Fun;

    if (shouldDetectLock && fun) {
      // To make sure that all the operation use wallet take effects on the correct wallet
      this.checkExtensionLockStatus().then(fun);
      // todo: use async instead
    }
  }

  handleVote(targetPublicKey, voteType, ele) {
    this.judgeANodeIsCandidate(targetPublicKey).then((res) => {
      if (res) {
        this.setState({ voteType }, this.handleVoteClick.bind(this, ele));
      } else {
        console.log('Cannot Vote');
      }
    });
  }

  judgeANodeIsCandidate(pubkey) {
    const { electionContract } = this.state;
    return electionContract.GetCandidateInformation.call({
      value: pubkey,
    })
      .then((res) => res.isCurrentCandidate)
      .catch((err) => {
        console.error("GetCandidateInformation", err);
      });
  }

  handleRedeemOneVote(ele) {
    const {
      nodeaddress: nodeAddress,
      nodename: nodeName,
      amount,
      voteid,
    } = ele.dataset;
    const voteId = JSON.parse(voteid);

    this.setState({
      voteToRedeem: {
        nodeName,
        nodeAddress,
        amount,
        voteId,
      },
      redeemOneVoteModalVisible: true,
    });
  }

  handleRedeemOneVoteConfirm() {
    const { voteToRedeem } = this.state;

    // todo: get the contract from extension in cdm or other suitable time
    // todo: error handle
    this.redeemSomeVote([voteToRedeem.voteId]);
    // todo: use async instead
    setTimeout(() => {
      this.setState({
        redeemOneVoteModalVisible: false,
      });
    }, 4000);
  }

  checkExtensionLockStatus() {
    return new Promise((resolve, reject) => {
      NightElfCheck.getInstance()
        .check.then(() => {
          const nightElf = NightElfCheck.getAelfInstanceByExtension();
          console.log(
            "checkExtensionLockStatus: ",
            this.hasGetContractsFromExt
          );
          if (this.hasGetContractsFromExt) {
            resolve();
          }

          if (typeof nightElf.getExtensionInfo === "function") {
            nightElf.getExtensionInfo().then((info) => {
              this.setState({
                isPluginLock: info.locked,
              });
            });
          }

          localStorage.setItem(
            "currentWallet",
            JSON.stringify({
              ...this.state.currentWallet,
              timestamp: new Date().valueOf(),
            })
          );

          // todo: Unify the format of extension's function return, the function getChainStatus's response is different with others.s
          nightElf.chain.getChainStatus().then(() => {
            this.loginPlugin().then(() => {
              resolve();
            });
          });
        })
        .catch((error) => {
          message.warn(
            "Please download and install NightELF browser extension."
          );
        });
    });
  }

  handleVoteClick(ele) {
    const {
      nodeaddress: nodeAddress,
      targetpublickey: targetPublicKey,
      nodename: nodeName = "",
    } = ele.dataset;
    this.getWalletBalance()
      .then((res) => {
        // todo: unify balance formater: InputNumber's and thousandsCommaWithDecimal's
        const balance = +res.balance / ELF_DECIMAL;
        const formattedBalance = thousandsCommaWithDecimal(balance);
        this.fetchDataVoteNeed();

        this.setState({
          balance,
          nodeAddress,
          targetPublicKey,
          currentWalletName: JSON.parse(localStorage.getItem("currentWallet"))
            .name,
          formattedBalance,
          nodeName,
        });
        this.changeModalVisible("voteModalVisible", true);
      })
      .then(() => {
        this.changeModalVisible("voteModalVisible", true);
      });
  }

  handleRedeemClick(ele) {
    const {
      nodename: nodeName = "Default",
      nodeaddress: nodeAddress,
      targetpublickey: targetPublicKey,
    } = ele.dataset;
    // todo: use arrow function or others method instead the data binded to element
    // todo: consider remove all the form in state

    this.setState(
      {
        nodeName,
        nodeAddress,
        targetPublicKey,
        voteRedeemModalVisible: true,
      },
      () => {
        this.fetchUserVoteRecords();
      }
    );
  }

  handleRedeemConfirm() {
    const { redeemVoteSelectedRowKeys } = this.state;

    this.redeemSomeVote(redeemVoteSelectedRowKeys);
  }

  redeemSomeVote(votesToRedeem) {
    const { electionContractFromExt, redeemableVoteRecordsForOneCandidate } =
      this.state;
    // no batch redeem
    const [item] = votesToRedeem;
    if (!item) {
      message.error("No selected vote");
      this.setVoteConfirmLoading(false);
      this.setRedeemConfirmLoading(false);
    } else {
      electionContractFromExt
        .Withdraw(item)
        .then((res) => {
          const { error, errorMessage } = res;
          if (+error === 0 || !error) {
            this.checkTransactionResult(res, "voteRedeemModalVisible")
              .then(() => {
                this.refreshPageElectionNotifi();
              })
              .catch((err) => {
                console.error("checkTransactionResult", {
                  err,
                });
              });
            this.setState({
              redeemVoteSelectedRowKeys: [],
            });
          } else {
            this.setVoteConfirmLoading(false);
            this.setRedeemConfirmLoading(false);
            message.error(errorMessage.message);
          }
        })
        .catch((err) => {
          this.setVoteConfirmLoading(false);
          this.setRedeemConfirmLoading(false);
          console.error(err);
        });
    }
  }

  fetchUserVoteRecords() {
    const { electionContract, targetPublicKey } = this.state;
    const currentWallet = getCurrentWallet();

    electionContract.GetElectorVoteWithRecords.call({
      value: currentWallet.pubKey,
    })
      .then((res) => {
        // todo: error handle
        const activeVoteRecordsForOneCandidate = res.activeVotingRecords.filter(
          (item) => item.candidate === targetPublicKey
        );
        const redeemableVoteRecordsForOneCandidate =
          this.computeRedeemableVoteRecords(activeVoteRecordsForOneCandidate);

        redeemableVoteRecordsForOneCandidate.forEach((item) => {
          item.formatedLockTime = getFormatedLockTime(item);
          item.formatedVoteTime = moment
            .unix(item.voteTimestamp.seconds)
            .format("YYYY-MM-DD HH:mm:ss");
          // todo: use the name team submit instead
          item.name = publicKeyToAddress(item.candidate);
        });

        // todo: consider to generate redeemableVoteRecordsForOneCandidate in component RedeemModal, it will reduce state's counts
        this.setState({
          activeVoteRecordsForOneCandidate,
          redeemableVoteRecordsForOneCandidate,
        });
      })
      .catch((err) => {
        console.log("GetElectorVoteWithRecords", err);
      });
  }

  computeRedeemableVoteRecords(records) {
    return records.filter(
      (item) => item.unlockTimestamp.seconds < moment().unix()
    );
  }

  handleLockTimeChange(value) {
    const { dividendContract } = this.state;

    this.setState({
      lockTime: value,
    });
  }

  handleVoteConfirmOk() {
    const { voteType } = this.state;
    const type2Fun = {
      [FROM_WALLET]: this.handleVoteFromWallet.bind(this),
      [FROM_EXPIRED_VOTES]: this.handleVoteFromExpiredVote.bind(this),
      [FROM_ACTIVE_VOTES]: this.handleSwitchVote.bind(this),
    };
    if (type2Fun[voteType]) {
      type2Fun[voteType]();
    }
  }

  handleVoteFromWallet() {
    const { voteAmountInput, targetPublicKey, electionContractFromExt } =
      this.state;
    const { lockTime } = this.state;

    const payload = {
      candidatePubkey: targetPublicKey,
      // todo: add decimal or not
      amount: voteAmountInput * ELF_DECIMAL,
      endTimestamp: {
        seconds: lockTime.unix(),
        nanos: lockTime.milliseconds() * 1000000,
      },
    };

    electionContractFromExt
      .Vote(payload)
      .then((res) => {
        const { error, errorMessage } = res;
        if (+error === 0 || !error) {
          this.checkTransactionResult(res).then(() => {
            // Close tow modal as there are two situation, one open a modal and anothor open two modals.
            // Consider to do the samething after checkTransactionResult in the same page.
            this.setState(
              {
                voteConfirmModalVisible: false,
                voteModalVisible: false,
                voteConfirmLoading: false,
              },
              () => {
                this.refreshPageElectionNotifi();
              }
            );
          });
        } else {
          message.error(errorMessage.message);
          this.setState({
            voteConfirmLoading: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          voteConfirmLoading: false,
        });
      });
  }

  refreshPageElectionNotifi() {
    this.setState({
      nodeTableRefreshTime: new Date().getTime(),
      shouldRefreshNodeTable: true,
      shouldRefreshMyWallet: true,
      shouldRefreshElectionNotifiStatis: true,
      voteConfirmLoading: false,
      redeemConfirmLoading: false,
    });
  }

  handleVoteFromExpiredVote() {
    const { voteFromExpiredVoteAmount, withdrawnableVoteRecords } = this.state;

    // todo: optimize the method
    const votesToRedeem = [];
    const sortedRedeemableVoteRecords = withdrawnableVoteRecords.sort(
      (a, b) => b.amount - a.amount
    );
    let voteIdsToRedeem = null;
    for (let i = 0; i < sortedRedeemableVoteRecords.length; i++) {
      const item = sortedRedeemableVoteRecords[i];
      votesToRedeem.push(item);
      const totalAmount = votesToRedeem.reduce(
        (total, current) => total + +current.amount,
        0
      );
      if (totalAmount >= voteFromExpiredVoteAmount) {
        break;
      }
    }
    voteIdsToRedeem = votesToRedeem.map((item) => item.voteId);

    this.redeemSomeVote(voteIdsToRedeem);
  }

  // todo: global node address are public key actually
  handleSwitchVote() {
    const { electionContractFromExt, targetPublicKey } = this.state;
    // todo: limit max change num or handle the concurreny problem
    const { switchVoteSelectedRowKeys } = this.state;
    const payload = {
      voteId: switchVoteSelectedRowKeys[0],
      candidatePubkey: targetPublicKey,
      isResetVotingTime: true,
    };
    electionContractFromExt
      .ChangeVotingOption(payload)
      .then((res) => {
        const { error, errorMessage } = res;
        if (+error === 0 || !error) {
          this.checkTransactionResult(res).then(() => {
            // Close tow modal as there are two situcation, one open a modal and anothor open two modals.
            // Consider to do the samething after checkTransactionResult in the same page.
            this.setState(
              {
                voteConfirmModalVisible: false,
                voteModalVisible: false,
                voteConfirmLoading: false,
              },
              () => {
                this.refreshPageElectionNotifi();
              }
            );
          });
        } else {
          message.error(errorMessage.message);
          this.setVoteConfirmLoading(false);
        }
      })
      .catch((err) => {
        console.error("ChangeVotingOption", err);
        this.setVoteConfirmLoading(false);
      });
  }

  // todo: use this method instead repeat code
  checkTransactionResult(res, modalToClose) {
    const transactionId = res.result
      ? res.result.TransactionId
      : res.TransactionId;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("transactionId", transactionId);
        aelf.chain.getTxResult(transactionId, (error, result) => {
          if (!result) {
            message.info(
              "Temporaryly didn' get the transaction info. Please query the transaction later"
            );
            message.info(`Your transaction id is: ${transactionId}`);
            reject();
            return;
          }
          getStateJudgment(result.Status, transactionId);
          // todo: use the modalToClose instead the VoteConfirmModal's code
          if (modalToClose) {
            setTimeout(() => {
              this.changeModalVisible(modalToClose, false);
            }, 500);
          }
          // todo: return resolve for all four status, consider to return resolve just for the 'mined', 'pending'
          resolve();
        });
      }, 4000);
    });
    // todo: optimize the timeout
  }

  handleVoteTypeChange(voteType) {
    this.setState({
      voteType,
    });
  }

  // FIXME: the time calling this method maybe unsuitable
  // FIXME: when the user didn't set the wallet, will it cause problem?
  fetchProfitAmount() {
    // After fetch all data, do the setState work
    // It will reduce the setState's call times to one
    const { profitContractFromExt, dividendContract, currentWallet } =
      this.state;
    return Promise.all([
      getAllTokens(),
      ...schemeIds.map((item) => {
        return profitContractFromExt.GetProfitsMap.call({
          beneficiary: currentWallet.address,
          schemeId: item.schemeId,
        });
      }),
    ])
      .then((resArr) => {
        const [tokens, ...list] = resArr;
        const decimals = tokens.reduce(
          (acc, v) => ({
            [v.symbol]: v.decimals,
          }),
          {}
        );
        let total = {};
        const dividendAmounts = schemeIds.map((item, index) => {
          const profit = list[index];
          const result = profit ? profit.result || profit : {};

          let { value = {} } = result || {};
          value = !value
            ? {
                ELF: 0,
              }
            : value;
          value = Object.keys(value).reduce((acc, key) => {
            return {
              ...acc,
              [key]: new Decimal(value[key] || 0)
                .dividedBy(`1e${decimals[key] || 8}`)
                .toNumber(),
            };
          }, {});
          total = {
            ...total,
            ...Object.keys(value).reduce((acc, key) => {
              return {
                ...acc,
                [key]: (total[key] || 0) + value[key],
              };
            }, {}),
          };
          return {
            type: item.type,
            amounts: value,
            schemeId: item.schemeId,
          };
        });
        const dividends = {
          total,
          amounts: dividendAmounts,
        };
        this.setState({
          dividends,
        });
      })
      .catch((err) => {
        console.error("GetAllProfitAmount", err);
      });
  }

  handleDividendClick() {
    this.checkExtensionLockStatus()
      .then(async () => {
        this.setState({
          dividendModalVisible: true,
          dividendLoading: true,
        });
        try {
          await this.fetchProfitAmount();
        } catch (e) {
          message.error("Error happened when getting claim amount");
        } finally {
          this.setState({
            dividendLoading: false,
          });
        }
      })
      .catch((err) => {
        console.error("checkExtensionLockStatus", err);
      });
  }

  handleClaimDividendClick(schemeId) {
    const { profitContractFromExt, currentWallet } = this.state;
    this.checkExtensionLockStatus()
      .then(() => {
        profitContractFromExt
          .ClaimProfits({
            schemeId,
            beneficiary: currentWallet.address,
          })
          .then((res) => {
            const { error, errorMessage } = res;
            if (+error === 0 || !error) {
              this.checkTransactionResult(res, "dividendModalVisible")
                .then(() => {
                  this.setState({
                    shouldRefreshMyWallet: true,
                    claimLoading: false,
                  });
                })
                .catch((err) => {
                  this.setClaimLoading(false);
                  message.error(err.Error || err.message);
                  console.error("handleClaimDividendClick", err);
                });
            } else {
              message.error(errorMessage.message);
              this.setState({
                claimLoading: false,
              });
            }
          })
          .catch((err) => {
            this.setClaimLoading(false);
            console.error("handleClaimDividendClick", err);
          });
      })
      .catch((err) => {
        this.setClaimLoading(false);
        console.error("checkExtensionLockStatus", err);
      });
  }

  renderSecondaryLevelNav() {
    const isSmallScreen = document.body.offsetWidth < 768;

    return (
      <section className='vote-container vote-container-simple basic-container basic-container-white'>
        <Menu
          // onClick={this.handleClick}
          selectedKeys={[window.location.pathname]}
          mode='horizontal'
        >
          <Menu.Item
            key={routePaths.electionNotifi}
            onClick={() => {
              this.props.navigate(routePaths.electionNotifi);
            }}
          >
            Election Notification
          </Menu.Item>
          <Menu.Item
            key={routePaths.myVote}
            onClick={() => {
              this.props.navigate(routePaths.myVote);
            }}
          >
            My Vote
          </Menu.Item>
        </Menu>
      </section>
    );
  }

  render() {
    const {
      voteModalVisible,
      pluginLockModalVisible,
      voteConfirmModalVisible,
      voteRedeemModalVisible,
      voteConfirmForm,
      voteRedeemForm,
      showDownloadPlugin,

      voteContract,
      electionContract,
      multiTokenContract,
      profitContract,
      dividendContract,
      consensusContract,

      electionContractFromExt,
      profitContractFromExt,

      balance,
      nodeAddress,
      nodeName,
      currentWallet,
      currentWalletName,
      voteAmountInput,
      voteFromExpiredVoteAmount,
      lockTime,
      nightElf,
      isCandidate,
      expiredVotesAmount,
      switchableVoteRecords,
      withdrawnableVoteRecords,
      voteType,
      switchVoteSelectedRowKeys,
      voteFromExpiredSelectedRowKeys,
      redeemVoteSelectedRowKeys,
      dividendModalVisible,
      redeemableVoteRecordsForOneCandidate,
      activeVoteRecordsForOneCandidate,
      dividends,
      shouldRefreshNodeTable,
      nodeTableRefreshTime,
      shouldRefreshMyWallet,
      voteToRedeem,
      redeemOneVoteModalVisible,
      shouldRefreshElectionNotifiStatis,
      shouldJudgeIsCurrentCandidate,
      isPluginLock,
      dividendLoading,
      voteConfirmLoading,
      redeemConfirmLoading,
      claimLoading,
    } = this.state;
    const { location, navigate } = this.props;

    const path = location.pathname.replace(/\/$/, "");

    const path2Component = [
      [
        routePaths.electionNotifi,
        <ElectionNotification
          multiTokenContract={multiTokenContract}
          voteContract={voteContract}
          electionContract={electionContract}
          profitContract={profitContract}
          profitContractFromExt={profitContractFromExt}
          dividendContract={dividendContract}
          consensusContract={consensusContract}
          nightElf={nightElf}
          isCandidate={isCandidate}
          judgeCurrentUserIsCandidate={this.judgeCurrentUserIsCandidate}
          handleDividendClick={this.handleDividendClick}
          dividends={dividends}
          electionContractFromExt={electionContractFromExt}
          shouldRefreshNodeTable={shouldRefreshNodeTable}
          nodeTableRefreshTime={nodeTableRefreshTime}
          shouldRefreshMyWallet={shouldRefreshMyWallet}
          changeVoteState={this.changeVoteState}
          checkExtensionLockStatus={this.checkExtensionLockStatus}
          shouldRefreshElectionNotifiStatis={shouldRefreshElectionNotifiStatis}
          currentWallet={currentWallet}
        />,
      ],
      [
        routePaths.teamInfoKeyin,
        <KeyInTeamInfo
          electionContract={electionContract}
          currentWallet={currentWallet}
          nightElf={nightElf}
          isPluginLock={isPluginLock}
          checkExtensionLockStatus={this.checkExtensionLockStatus}
        />,
      ],
      [
        routePaths.teamDetail,
        <TeamDetail
          consensusContract={consensusContract}
          electionContract={electionContract}
          currentWallet={currentWallet}
        />,
      ],
      [
        routePaths.myVote,
        <MyVote
          electionContract={electionContract}
          handleVoteTypeChange={this.handleVoteTypeChange}
          currentWallet={currentWallet}
          checkExtensionLockStatus={this.checkExtensionLockStatus}
        />,
      ],
    ];

    const secondaryLevelNav = this.renderSecondaryLevelNav();

    // todo: decouple
    // this.formGroup = generateFormGroup.call(this, { nodeAddress: null });
    return (
      // todo: place the Provider in the uppest container
      <Provider contractsStore={contractsStore}>
        <div>
          {showDownloadPlugin ? (
            <section className='vote-container vote-container-simple basic-container basic-container-white'>
              <DownloadPlugins style={{ margin: "0 56px" }} />
            </section>
          ) : null}

          {secondaryLevelNav}
          <section
            className='vote-container vote-container-simple basic-container basic-container-white'
            onClick={this.handleClick}
          >
            <Routes>
              {path2Component.map((item) => (
                <Route path={item[0].split("/vote")[1]} element={item[1]} />
              ))}
            </Routes>

            <VoteModal
              voteModalVisible={voteModalVisible}
              nodeAddress={nodeAddress}
              nodeName={nodeName}
              currentWalletName={currentWalletName}
              balance={balance}
              callback={this.handleVoteConfirmOk}
              setVoteConfirmLoading={this.setVoteConfirmLoading}
              voteConfirmLoading={voteConfirmLoading}
              onCancel={this.handleCancel.bind(this, "voteModalVisible")}
              handleSwitchVoteAmountChange={this.handleSwitchVoteAmountChange}
              handleLockTimeChange={this.handleLockTimeChange}
              voteAmountInput={voteAmountInput}
              lockTime={lockTime}
              expiredVotesAmount={expiredVotesAmount}
              switchableVoteRecords={switchableVoteRecords}
              withdrawnableVoteRecords={withdrawnableVoteRecords}
              handleSwitchVote={this.handleSwitchVote}
              handleVoteTypeChange={this.handleVoteTypeChange}
              voteType={voteType}
              handleSwitchVoteSelectedRowChange={
                this.handleSwitchVoteSelectedRowChange
              }
              switchVoteSelectedRowKeys={switchVoteSelectedRowKeys}
              voteFromExpiredVoteAmount={voteFromExpiredVoteAmount}
              voteFromExpiredSelectedRowKeys={voteFromExpiredSelectedRowKeys}
              handleVoteFromExpiredSelectedRowChange={
                this.handleVoteFromExpiredSelectedRowChange
              }
              changeVoteState={this.changeVoteState}
            />

            <Modal
              className='plugin-lock-modal'
              visible={pluginLockModalVisible}
              onOk={() => this.handleOk("pluginLockModalVisible")}
              // confirmLoading={confirmLoading}
              onCancel={() => this.handleCancel("pluginLockModalVisible")}
              centered
              maskClosable
              keyboard
            >
              {/* 您的NightELF已锁定，请重新解锁 */}
              You NightELF extension is locked. Please unlock it.
            </Modal>

            <Modal
              className='vote-confirm-modal'
              title='Vote Confirm'
              visible={voteConfirmModalVisible}
              onOk={this.handleVoteConfirmOk}
              // confirmLoading={confirmLoading}
              onCancel={this.handleCancel.bind(this, "voteConfirmModalVisible")}
              width={860}
              centered
              maskClosable
              keyboard
            >
              <Form {...voteConfirmFormItemLayout} onSubmit={this.handleSubmit}>
                {voteConfirmForm.formItems &&
                  voteConfirmForm.formItems.map((item) => {
                    return (
                      <Form.Item label={item.label} key={item.label}>
                        {item.render ? item.render : <Input />}
                      </Form.Item>
                    );
                  })}
              </Form>
              <p className='tip-color' style={{ marginTop: 30 }}>
                {NEED_PLUGIN_AUTHORIZE_TIP}
              </p>
            </Modal>

            <RedeemModal
              nodeAddress={nodeAddress}
              nodeName={nodeName}
              voteRedeemModalVisible={voteRedeemModalVisible}
              setRedeemConfirmLoading={this.setRedeemConfirmLoading}
              redeemConfirmLoading={redeemConfirmLoading}
              handleRedeemConfirm={this.handleRedeemConfirm}
              handleCancel={this.handleCancel}
              redeemableVoteRecordsForOneCandidate={
                redeemableVoteRecordsForOneCandidate
              }
              activeVoteRecordsForOneCandidate={
                activeVoteRecordsForOneCandidate
              }
              currentWallet={currentWallet}
              redeemVoteSelectedRowKeys={redeemVoteSelectedRowKeys}
              handleRedeemVoteSelectedRowChange={
                this.handleRedeemVoteSelectedRowChange
              }
              changeVoteState={this.changeVoteState}
            />

            <RedeemAnVoteModal
              currentWallet={currentWallet}
              voteToRedeem={voteToRedeem}
              redeemOneVoteModalVisible={redeemOneVoteModalVisible}
              changeVoteState={this.changeVoteState}
              handleRedeemOneVoteConfirm={this.handleRedeemOneVoteConfirm}
            />

            <DividendModal
              dividendModalVisible={dividendModalVisible}
              loading={dividendLoading}
              changeModalVisible={this.changeModalVisible}
              dividends={dividends}
              handleClaimDividendClick={this.handleClaimDividendClick}
              setClaimLoading={this.setClaimLoading}
              claimLoading={claimLoading}
            />
          </section>
        </div>
      </Provider>
    );
  }
}

export default withRouter(VoteContainer);
