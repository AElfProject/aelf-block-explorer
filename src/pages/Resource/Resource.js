/**
 * @file
 * @author huangzongzhe  zhouminghui
 * 233333
 * TODO: Vote && Resource To migrate out of Application
 */

import React, { Component } from "react";
import { message } from "antd";
import { connect } from "react-redux";

import { aelf } from "../../utils";
import { resourceTokens } from "../../../config/config";
import DownloadPlugins from "../../components/DownloadPlugins/DownloadPlugins";
import ResourceWallet from "./components/ResourceAElfWallet/ResourceWallet";
import getContractAddress from "../../utils/getContractAddress";
import ResourceMoneyMarket from "./components/ResourceMoneyMarket/ResourceMoneyMarket";
import getLogin from "../../utils/getLogin";
import { isPhoneCheck } from "../../utils/deviceCheck";
import "./Resource.less";
import walletInstance from "../../redux/common/wallet";

class Resource extends Component {
  constructor(props) {
    super(props);
    this.informationTimer;
    this.state = {
      contracts: null,
      tokenContract: null,
      tokenConverterContract: null,
      showDownloadPlugins: false,
      showWallet: false,
      currentBalance: 0,
      resourceTokens: resourceTokens.map((v) => ({ ...v, balance: 0 })),
      loading: false,
      nightElf: null,
    };
    this.walletRef = null;
  }

  componentDidMount() {
    getContractAddress().then((result) => {
      this.setState({
        contracts: result,
      });
      if (!result.chainInfo) {
        message.error(
          "The chain has stopped or cannot be connected to the chain. Please check your network or contact us.",
          10
        );
        return;
      }
      this.getContract(result);
    });
    // walletInstance.isExist.then(
    //   (item) => {
    //     if (item) {
    //       const instance = walletInstance.proxy.elfInstance;
    //       if (
    //         typeof walletInstance.proxy.elfInstance.getExtensionInfo ===
    //         "function"
    //       ) {
    //         walletInstance.getExtensionInfo().then(
    //           (info) => {
    //             if (!info.locked) {
    //               instance.chain.getChainStatus().then((result) => {
    //                 this.loginAndInsertKeyPairs(result);
    //               });
    //             } else {
    //               localStorage.removeItem("currentWallet");
    //             }
    //           },
    //           () => {
    //             const wallet = JSON.parse(
    //               localStorage.getItem("currentWallet")
    //             );
    //             if (
    //               wallet &&
    //               new Date().valueOf() - Number(wallet.timestamp) <
    //                 15 * 60 * 1000
    //             ) {
    //               instance.chain.getChainStatus().then((result) => {
    //                 this.loginAndInsertKeyPairs(result);
    //               });
    //             } else {
    //               localStorage.removeItem("currentWallet");
    //             }
    //           }
    //         );
    //       }
    //     }
    //   },
    //   () => {
    //     this.setState({
    //       showDownloadPlugins: true,
    //     });
    //   }
    // );
  }

  componentDidUpdate(preProps) {
    if (this.props.currentWallet.address && !preProps.currentWallet.address) {
      console.log("refresh", this.walletRef);
      this.walletRef.refreshWalletInfo();
    }
  }

  getContract(result) {
    // eslint-disable-next-line no-shadow
    aelf.chain.contractAt(result.multiToken, result.wallet, (error, result) => {
      this.setState({
        tokenContract: result,
      });
    });
    aelf.chain.contractAt(
      result.tokenConverter,
      result.wallet,
      // eslint-disable-next-line no-shadow
      (error, result) => {
        this.setState({
          tokenConverterContract: result,
        });
      }
    );
  }

  // loginAndInsertKeyPairs = async (toastMessage = true) => {
  //   await walletInstance.login().then(
  //     async (result) => {
  //       const wallet = result;
  //       const instance = walletInstance.proxy.elfInstance;
  //       instance.chain.getChainStatus(() => {
  //         this.getNightElfKeyPair(wallet);
  //       });
  //       toastMessage && message.success("Login success!!", 3);
  //     },
  //     () => {
  //       this.loginFailed();
  //     }
  //   );
  // };

  loginFailed(result) {
    this.setState({
      showWallet: false,
    });
    const warningStr =
      (result && result.error === 200010
        ? "Please Login."
        : result && result.errorMessage.message) ||
      "Please check your NightELF browser extension.";
    message.warn(warningStr);
  }

  // getNightElfKeyPair(wallet) {
  //   if (wallet) {
  //     localStorage.setItem(
  //       "currentWallet",
  //       JSON.stringify({ ...wallet, timestamp: new Date().valueOf() })
  //     );
  //     this.setState({
  //       currentWallet: wallet,
  //       showWallet: true,
  //     });
  //   }
  // }

  getCurrentBalance = (value) => {
    this.setState({
      currentBalance: value,
    });
  };

  getDownloadPluginsHTML() {
    return <DownloadPlugins />;
  }

  onRefresh() {
    setTimeout(() => {
      this.walletRef.refreshWalletInfo();
    }, 2000);
    this.setState({
      loading: true,
    });
  }

  endRefresh() {
    this.setState({
      loading: false,
    });
  }

  getResource = (resource) => {
    this.setState({
      resourceTokens: resource.map((v) => ({ ...v })),
    });
  };

  resourceAElfWalletHtml() {
    const {
      tokenContract,
      tokenConverterContract,
      // eslint-disable-next-line no-shadow
      resourceTokens,
      currentBalance,
    } = this.state;
    return (
      <ResourceWallet
        title="My Wallet"
        ref={(wallet) => {
          this.walletRef = wallet;
        }}
        tokenContract={tokenContract}
        tokenConverterContract={tokenConverterContract}
        currentWallet={this.props.currentWallet}
        getCurrentBalance={this.getCurrentBalance}
        getResource={this.getResource}
        resourceTokens={resourceTokens}
        balance={currentBalance}
        loginAndInsertKeyPairs={this.loginAndInsertKeyPairs}
      />
    );
  }

  render() {
    const {
      currentBalance,
      // eslint-disable-next-line no-shadow
      appName,
      showDownloadPlugins,
      contracts,
      tokenContract,
      tokenConverterContract,
      nightElf,
      // eslint-disable-next-line no-shadow
      resourceTokens,
    } = this.state;
    const account = {
      balance: currentBalance,
      resourceTokens,
    };
    let downloadPlugins = null;
    if (showDownloadPlugins) {
      downloadPlugins = [
        this.getDownloadPluginsHTML(),
        <div className="resource-blank" />,
      ];
    }
    const resourceAElfWalletHtml = this.resourceAElfWalletHtml();
    const isPhone = isPhoneCheck();
    return (
      <div className="resource-body basic-container basic-container-white">
        {!isPhone && downloadPlugins}
        {/* {isPhone && <div className='resource-pc-note'>In PC, you can find more operations and information.</div>} */}
        {walletInstance && resourceAElfWalletHtml}
        <div className="resource-money-market">
          <ResourceMoneyMarket
            loginAndInsertKeypairs={this.loginAndInsertKeyPairs}
            currentWallet={this.props.currentWallet}
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

const mapStateToProps = (state) => ({
  ...state.common,
});

export default connect(mapStateToProps)(Resource);
