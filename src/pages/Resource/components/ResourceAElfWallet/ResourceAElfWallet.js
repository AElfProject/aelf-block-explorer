/**
 * @file ResourceAElfWallet.js
 * @author zhouminghui
 */

import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Spin, Button, Icon, message } from "antd";
import { SYMBOL, ELF_DECIMAL } from "@src/constants";
import { thousandsCommaWithDecimal } from "@utils/formater";
import { APPNAME, resourceTokens } from "@config/config";
import {
  WalletOutlined,
  SyncOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./ResourceAElfWallet.less";
import addressFormat from "../../../../utils/addressFormat";
import { isPhoneCheck } from "../../../../utils/deviceCheck";
import walletInstance from "../../../../redux/common/wallet";

export default class ResourceAElfWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.defaultWallet = {
      name: "-",
      address: "-",
    };
    this.state = {
      loading: true,
      isPhone: isPhoneCheck(),
    };
    this.refreshWalletInfo = this.refreshWalletInfo.bind(this);
    this.extensionLogout = this.extensionLogout.bind(this);
  }

  componentDidMount() {
    this.refreshWalletInfo();
  }

  componentDidUpdate(prevProps) {
    const { currentWallet, tokenContract } = this.props;
    if (currentWallet && tokenContract && !prevProps.tokenContract) {
      this.refreshWalletInfo();
    } else if (
      currentWallet &&
      tokenContract &&
      (!prevProps.currentWallet ||
        prevProps.currentWallet.address !== currentWallet.address)
    ) {
      this.refreshWalletInfo();
    }
  }

  refreshWalletInfo() {
    const { tokenContract, currentWallet } = this.props;
    if (tokenContract && currentWallet) {
      this.setState({
        loading: true,
      });
      Promise.all([
        this.getCurrentWalletBalance(),
        this.getCurrentWalletResource(),
      ])
        .then(() => {
          this.setState({
            loading: false,
          });
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  extensionLogout() {
    this.setState({
      loading: true,
    });
    const { currentWallet } = this.props;
    walletInstance.proxy.elfInstance.chain.getChainStatus().then(
      (result) => {
        if (result) {
          const isPluginLock = result.error === 200005;
          if (isPluginLock) {
            message.warn(result.message || result.errorMessage.message);
          } else {
            walletInstance.logout(currentWallet.address).then(
              () => {
                message.success(
                  "Logout successful, refresh after 3s.",
                  3,
                  () => {
                    localStorage.removeItem("currentWallet");
                    window.location.reload();
                  }
                );
              },
              () => {
                this.setState({
                  loading: false,
                });
                message.error("logout failed");
              }
            );
          }
          this.setState({
            loading: false,
          });
        }
      },
      (error) => {
        this.setState({
          loading: false,
        });
        console.error("walletInstance.chain.getChainStatus:error", error);
      }
    );
  }

  getCurrentWalletBalance = async () => {
    const { tokenContract, currentWallet, getCurrentBalance } = this.props;
    const payload = {
      symbol: SYMBOL,
      owner: currentWallet.address || currentWallet,
    };
    const result = await tokenContract.GetBalance.call(payload);
    const balance = parseInt(result.balance || 0, 10) / ELF_DECIMAL;
    getCurrentBalance(balance);
  };

  getCurrentWalletResource = async () => {
    const { tokenContract, currentWallet, getResource } = this.props;
    const owner = currentWallet.address || currentWallet;
    const results = await Promise.all(
      resourceTokens.map(({ symbol }) =>
        tokenContract.GetBalance.call({
          symbol,
          owner,
        })
      )
    );
    const newResourceTokenInfos = results.map((v, i) => {
      const balance = parseInt(v.balance || 0, 10) / ELF_DECIMAL;
      return {
        ...resourceTokens[i],
        balance,
      };
    });
    getResource(newResourceTokenInfos);
  };

  render() {
    const {
      title,
      currentWallet,
      tokenContract,
      resourceTokens: tokens,
      balance,
      loginAndInsertKeyPairs,
    } = this.props;
    const { loading, isPhone } = this.state;

    const hasLogin = currentWallet && currentWallet.address;

    const propsTile = title || "-";
    const wallet = hasLogin ? currentWallet : this.defaultWallet;

    return (
      <div className="resource-wallet resource-block">
        <Spin tip="loading...." size="large" spinning={loading}>
          <div className="resource-wallet-header resource-header">
            <WalletOutlined className="resource-icon" />
            <span className="resource-title">{propsTile}</span>
          </div>
          <div className="resource-sub-container">
            <Row className="resource-wallet-address">
              {isPhone ? (
                <Col className="resource-wallet-address-name">
                  <div>
                    Name:
                    {wallet.name}
                  </div>
                  <div>
                    Address:
                    {addressFormat(wallet.address)}
                  </div>
                  <div>
                    {wallet.address !== "-" && (
                      <Link to={`/resourceDetail/${wallet.address}`}>
                        Transaction Details
                      </Link>
                    )}
                  </div>
                </Col>
              ) : (
                <Col className="resource-wallet-address-name">
                  {wallet.name}
                  &nbsp;&nbsp;&nbsp;
                  {addressFormat(wallet.address)}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {wallet.address !== "-" && (
                    <Link to={`/resourceDetail/${wallet.address}`}>
                      Transaction Details
                    </Link>
                  )}
                </Col>
              )}

              <Col className="resource-wallet-operation-container">
                {!(currentWallet && currentWallet.address && tokenContract) && (
                  <Button
                    type="text"
                    className="resource-wallet-address-update update-btn"
                    onClick={() => loginAndInsertKeyPairs(false)}
                  >
                    Login
                  </Button>
                )}

                <Button
                  type="text"
                  className="resource-wallet-address-update update-btn"
                  disabled={
                    !(currentWallet && currentWallet.address && tokenContract)
                  }
                  onClick={this.refreshWalletInfo}
                >
                  Refresh
                  <SyncOutlined type="sync" spin={loading} />
                </Button>

                {!isPhone && currentWallet && currentWallet.name && (
                  <Button
                    type="text"
                    className="resource-wallet-address-update update-btn"
                    disabled={
                      !(currentWallet && currentWallet.address && tokenContract)
                    }
                    onClick={this.extensionLogout}
                  >
                    Logout
                    <LogoutOutlined type="logout" />
                  </Button>
                )}
              </Col>
            </Row>

            <div className="resource-wallet-info">
              <Row type="flex" align="middle">
                <Col span={24}>
                  <span className="resource-wallet-info-name balance">
                    Balance:
                  </span>
                  <span className="resource-wallet-info-value">
                    {thousandsCommaWithDecimal(hasLogin ? balance : "-")} ELF
                  </span>
                </Col>
                {tokens.map((v, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Col lg={12} xs={24} sm={12} key={index}>
                    <span className="resource-wallet-info-name">
                      {v.symbol} Quantity:
                    </span>
                    <span className="resource-wallet-info-value">
                      {thousandsCommaWithDecimal(hasLogin ? v.balance : "-")}
                    </span>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
