/**
 * @file ResourceBuyModal
 * @author zhouminghui
 */

import React, { PureComponent } from "react";
import { Row, Col, Spin, message, Button } from "antd";
import { CHAIN_ID } from "@config/config";
import { thousandsCommaWithDecimal } from "@utils/formater";
import { SYMBOL, ELF_DECIMAL } from "@src/constants";
import getStateJudgment from "../../../../../../utils/getStateJudgment";
import { aelf } from "../../../../../../utils";
import walletInstance from "../../../../../../redux/common/wallet";

export default class ResourceSellModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sellNum: this.props.sellNum,
      tokenConverterContract: this.props.tokenConverterContract,
      tokenContract: this.props.tokenContract,
      loading: false,
      ELFValue: null,
      contracts: this.props.contracts,
    };

    this.getSellRes = this.getSellRes.bind(this);
  }

  getSellRes() {
    const { account, sellFee, currentWallet } = this.props;
    const { contracts } = this.state;

    this.props.maskClosable();
    // todo: maybe we can move the judge to component ResourceSell
    // todo: handle the edge case that account.balance is just equal to the sellFee or nearly equal
    if (account.balance <= sellFee) {
      message.warning(
        `Your ${SYMBOL} balance is insufficient to pay the service charge.`
      );
      return;
    }
    const wallet = {
      address: currentWallet.address,
    };
    this.setState({
      loading: true,
    });
    const instance = walletInstance.proxy.elfInstance;
    instance.chain
      .contractAt(contracts.tokenConverter, wallet)
      .then((result) => {
        if (result) {
          this.requestSell(result);
        }
      })
      .catch((error) => {
        console.log("Sell contracts.tokenConverter init", error);
      });
  }

  requestSell(tokenConverterRes) {
    const { currentResourceType, handleModifyTradingState } = this.props;
    const { sellNum } = this.state;
    const payload = {
      symbol: currentResourceType,
      amount: +(sellNum * ELF_DECIMAL),
    };
    tokenConverterRes
      .Sell(payload)
      .then((result) => {
        if (result.error) {
          this.setState({
            loading: false,
          });
          message.error(result.errorMessage.message, 3);
          this.props.handleCancel();
          return;
        }

        this.setState({
          loading: true,
        });
        const transactionId = result.result
          ? result.result.TransactionId
          : result.TransactionId;
        setTimeout(() => {
          aelf.chain.getTxResult(transactionId, (error, txRes) => {
            if (!txRes) {
              return;
            }
            getStateJudgment(txRes.Status, transactionId);
            this.props.onRefresh();
            this.setState({
              loading: false,
            });
            handleModifyTradingState({
              sellNum: null,
            });
            this.props.handleCancel();
            this.props.unMaskClosable();
          });
        }, 4000);
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        message.fail("Sell failed, please try again");
        console.error("result.Sell error", error);
      });
  }

  render() {
    const {
      sellFee,
      SellELFValue,
      sellEstimateValueLoading,
      sellNum,
      currentResourceType,
      currentWallet,
    } = this.props;
    const { loading } = this.state;

    return (
      <div className="modal resource-modal">
        <Row className="modal-form-item">
          <Col span={6}>Address</Col>
          <Col
            span={18}
            className="text-ellipse"
            title={`ELF_${currentWallet.address}_${CHAIN_ID}`}
          >
            {`ELF_${currentWallet.address}_${CHAIN_ID}`}
          </Col>
        </Row>
        <Row className="modal-form-item">
          <Col span={6}>Sell {currentResourceType} Quantity</Col>
          <Col span={18}>{thousandsCommaWithDecimal(sellNum)}</Col>
        </Row>
        <Row className="modal-form-item">
          <Col span={6}>Sell {SYMBOL}</Col>
          <Col span={18}>
            <Spin spinning={sellEstimateValueLoading}>
              {thousandsCommaWithDecimal(SellELFValue)}
            </Spin>
          </Col>
        </Row>
        <div className="service-charge">
          *Service Charge: {thousandsCommaWithDecimal(sellFee)} {SYMBOL}
        </div>
        <Button
          className="modal-button sell-btn"
          loading={sellEstimateValueLoading || loading}
          onClick={this.getSellRes}
        >
          Sell
        </Button>
        <div className="modal-tip">
          * To avoid price fluctuations leading to transaction failure, please
          complete the transaction within 30 seconds.
        </div>
      </div>
    );
  }
}
