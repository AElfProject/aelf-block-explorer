import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import { Link } from "react-router-dom";
import { Row, Col, Spin, Button, message } from "antd";
import { SYMBOL, ELF_DECIMAL } from "@src/constants";
import { thousandsCommaWithDecimal } from "@utils/formater";
import { resourceTokens } from "@config/config";
import { WebLoginState, useWebLogin } from "aelf-web-login";
import {
  WalletOutlined,
  SyncOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./ResourceAElfWallet.less";
import addressFormat from "../../../../utils/addressFormat";
import { isPhoneCheck } from "../../../../utils/deviceCheck";
import walletInstance from "../../../../redux/common/wallet";

const ResourceWallet = React.forwardRef(
  (
    {
      title,
      currentWallet,
      tokenContract,
      resourceTokens: tokens,
      balance,
      getCurrentBalance,
      getResource,
    },
    ref
  ) => {
    const defaultWallet = {
      name: "-",
      address: "-",
    };
    const isPhone = isPhoneCheck();

    const [loading, setLoading] = useState(true);

    const { loginState, login, logout } = useWebLogin();

    const getCurrentWalletBalance = useCallback(async () => {
      const payload = {
        symbol: SYMBOL,
        owner: currentWallet.address || currentWallet,
      };
      const result = await tokenContract.GetBalance.call(payload);
      const newBalance = parseInt(result.balance || 0, 10) / ELF_DECIMAL;
      getCurrentBalance(newBalance);
    }, [currentWallet, tokenContract]);

    const getCurrentWalletResource = useCallback(async () => {
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
        const newBalance = parseInt(v.balance || 0, 10) / ELF_DECIMAL;
        return {
          ...resourceTokens[i],
          balance: newBalance,
        };
      });
      getResource(newResourceTokenInfos);
    }, [currentWallet, tokenContract]);

    const refreshWalletInfo = useCallback(() => {
      if (tokenContract && currentWallet) {
        setLoading(true);
        Promise.all([getCurrentWalletBalance(), getCurrentWalletResource()])
          .then(() => {
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, [currentWallet, tokenContract]);

    useEffect(() => {
      refreshWalletInfo();
    }, [currentWallet, tokenContract]);

    useImperativeHandle(ref, () => ({
      refreshWalletInfo,
    }));

    // const extensionLogout = useCallback(() => {
    //   setLoading(true);
    //   walletInstance.proxy.elfInstance.chain.getChainStatus().then(
    //     (result) => {
    //       if (result) {
    //         const isPluginLock = result.error === 200005;
    //         if (isPluginLock) {
    //           message.warn(result.message || result.errorMessage.message);
    //         } else {
    //           walletInstance.logout(currentWallet.address).then(
    //             () => {
    //               message.success(
    //                 "Logout successful, refresh after 3s.",
    //                 3,
    //                 () => {
    //                   localStorage.removeItem("currentWallet");
    //                   window.location.reload();
    //                 }
    //               );
    //             },
    //             () => {
    //               setLoading(false);
    //               message.error("logout failed");
    //             }
    //           );
    //         }
    //         setLoading(false);
    //       }
    //     },
    //     (error) => {
    //       setLoading(false);
    //       // eslint-disable-next-line no-console
    //       console.error("walletInstance.chain.getChainStatus:error", error);
    //     }
    //   );
    // }, [currentWallet]);

    const hasLogin = currentWallet && currentWallet.address;
    const propsTile = title || "-";
    const wallet = hasLogin ? currentWallet : defaultWallet;

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
                {/* {!(currentWallet && currentWallet.address && tokenContract) && (
                <Button
                  type="text"
                  className="resource-wallet-address-update update-btn"
                  onClick={() => loginAndInsertKeyPairs(false)}
                >
                  Login
                </Button>
              )} */}

                {(loginState === WebLoginState.initial ||
                  loginState === WebLoginState.lock) && (
                  <Button
                    type="text"
                    className="resource-wallet-address-update update-btn"
                    onClick={() => login()}
                  >
                    {loginState === WebLoginState.lock ? "Unlock" : "Login"}
                  </Button>
                )}

                <Button
                  type="text"
                  className="resource-wallet-address-update update-btn"
                  disabled={loginState !== WebLoginState.logined}
                  onClick={refreshWalletInfo}
                >
                  Refresh
                  <SyncOutlined type="sync" spin={loading} />
                </Button>

                {!isPhone && currentWallet && currentWallet.address && (
                  <Button
                    type="text"
                    className="resource-wallet-address-update update-btn"
                    disabled={
                      !(currentWallet && currentWallet.address && tokenContract)
                    }
                    onClick={logout}
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
);

export default ResourceWallet;
