/**
 * @file ResourceBuyModal
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import { Row, Col, Spin, message, Button } from 'antd';
import { aelf } from '../../../../../../utils';
import {
  CHAIN_ID
} from '@config/config';
import getStateJudgment from '../../../../../../utils/getStateJudgment';
import { thousandsCommaWithDecimal, centerEllipsis } from '@utils/formater';
import { SYMBOL, ELF_DECIMAL } from '@src/constants';

export default class ResourceSellModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentWallet: this.props.currentWallet,
      sellNum: this.props.sellNum,
      tokenConverterContract: this.props.tokenConverterContract,
      tokenContract: this.props.tokenContract,
      loading: false,
      ELFValue: null,
      nightElf: this.props.nightElf,
      contracts: this.props.contracts
    };

    this.getSellRes = this.getSellRes.bind(this);
  }

  getSellRes() {
    const { account, sellFee } = this.props;
    const { currentWallet, nightElf, contracts } = this.state;

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
      address: currentWallet.address
    };
    this.setState({
      loading: true
    });
    nightElf.chain.contractAt(
      contracts.tokenConverter,
      wallet,
      (err, result) => {
        if (result) {
          this.requestSell(result);
        }
      }
    );
  }

  requestSell(result) {
    const { currentResourceType } = this.props;
    const { sellNum } = this.state;
    const payload = {
      symbol: currentResourceType,
      amount: +(sellNum * ELF_DECIMAL)
    };
    result.Sell(payload, (error, result) => {
      if (result.error) {
        this.setState({
          loading: false
        });
        message.error(result.errorMessage.message, 3);
        this.props.handleCancel();
        return;
      }

      this.setState({
        loading: true
      });
      const transactionId = result.result
        ? result.result.TransactionId
        : result.TransactionId;
      setTimeout(() => {
        aelf.chain.getTxResult(transactionId, (error, result) => {
          if (!result) {
            return;
          }
          getStateJudgment(result.Status, transactionId);
          this.props.onRefresh();
          this.setState({
            loading: false
          });
          this.props.handleCancel();
          this.props.unMaskClosable();
        });
      }, 4000);
    });
  }

  render() {
    const {
      sellFee,
      SellELFValue,
      sellEstimateValueLoading,
      sellNum,
      currentResourceType
    } = this.props;
    const { currentWallet, loading } = this.state;

    return (
      <div className='modal resource-modal'>
        <Row className='modal-form-item'>
          <Col span={6}>
            Address
          </Col>
          <Col
              span={18}
              className="text-ellipse"
              title={`ELF_${currentWallet.address}_${CHAIN_ID}`}
          >
            {`ELF_${currentWallet.address}_${CHAIN_ID}`}
          </Col>
        </Row>
        <Row className='modal-form-item'>
          <Col span={6}>
            Sell {currentResourceType} Quantity
          </Col>
          <Col span={18}>{thousandsCommaWithDecimal(sellNum)}</Col>
        </Row>
        <Row className='modal-form-item'>
          <Col span={6}>
            Sell {SYMBOL}
          </Col>
          <Col span={18}>
            <Spin spinning={sellEstimateValueLoading}>
              {thousandsCommaWithDecimal(SellELFValue)}
            </Spin>
          </Col>
        </Row>
        <div className='service-charge'>
          *Service Charge: {thousandsCommaWithDecimal(sellFee)} {SYMBOL}
        </div>
        <Button
          className='modal-button sell-btn'
          loading={sellEstimateValueLoading || loading}
          onClick={this.getSellRes}
        >
          Sell
        </Button>
        <div className='modal-tip'>
          * To avoid price fluctuations leading to transaction failure, please
          complete the transaction within 30 seconds.
        </div>
      </div>
    );
  }
}
