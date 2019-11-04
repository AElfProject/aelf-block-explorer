/**
 * @file ResourceBuyModal
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import { Row, Col, Spin, message, Button } from 'antd';
import { aelf } from '../../../../../../utils';
import getFees from '../../../../../../utils/getFees';
import getMenuName from '../../../../../../utils/getMenuName';
import getEstimatedValueELF from '../../../../../../utils/getEstimatedValueELF';
import addressOmit from '../../../../../../utils/addressOmit';
import getStateJudgment from '../../../../../../utils/getStateJudgment';
import config from '@config/config';
import {
  SYMBOL,
  ELF_DECIMAL,
  TEMP_RESOURCE_DECIMAL,
  BUY_MORE_THAN_HALT_OF_INVENTORY_TIP,
  FAILED_MESSAGE_DISPLAY_TIME
} from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';
import { regBuyTooManyResource } from '@utils/regExps';
import './ResourceBuyModal.less';

export default class ResourceBuyModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuIndex: this.props.menuIndex,
      currentWallet: this.props.currentWallet || null,
      tokenConverterContract: this.props.tokenConverterContract,
      tokenContract: this.props.tokenContract,
      menuName: getMenuName(this.props.menuIndex),
      loading: false,
      nightElf: this.props.nightElf,
      contracts: this.props.contracts
    };
  }

  getBuyRes() {
    const { currentWallet, nightElf, contracts } = this.state;
    this.props.maskClosable();
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
        console.log('err, result', err, result);
        if (result) {
          this.requestBuy(result);
        }
      }
    );
  }

  requestBuy(result) {
    const { buyNum, handleModifyTradingState } = this.props;
    const { menuName } = this.state;
    console.log('buyNum * config.ELF_DECIMAL', buyNum, config.ELF_DECIMAL);
    const payload = {
      symbol: menuName,
      amount: buyNum * config.ELF_DECIMAL
    };
    console.log('result', result);
    console.log('payload', payload);
    result.Buy(payload, (error, result) => {
      if (result.error && result.error !== 0) {
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
        console.log('transactionId', transactionId);
        aelf.chain
          .getTxResult(transactionId)
          .then(result => {
            // todo: 没有将token合约的approve方法添加到白名单时，发交易在这里会出错
            console.log({
              error,
              result
            });
            getStateJudgment(result.Status, transactionId);
            this.props.onRefresh();
            this.setState({
              loading: false
            });
            handleModifyTradingState({
              buyNum: null,
              buyFee: 0,
              buyElfValue: 0,
              buySliderValue: 0
            });
            this.props.handleCancel();
            this.props.unMaskClosable();
          })
          .catch(err => {
            this.setState(
              {
                loading: false
              },
              () => {
                console.error('err', err, BUY_MORE_THAN_HALT_OF_INVENTORY_TIP);
                if (regBuyTooManyResource.test(err.Error)) {
                  message.error(
                    BUY_MORE_THAN_HALT_OF_INVENTORY_TIP,
                    FAILED_MESSAGE_DISPLAY_TIME
                  );
                  message.error(
                    `Transaction id: ${transactionId}`,
                    FAILED_MESSAGE_DISPLAY_TIME
                  );
                  return;
                }
                message.error(
                  'Your transaction seems to has some problem, please query the transaction later:',
                  FAILED_MESSAGE_DISPLAY_TIME
                );
                message.error(
                  `Transaction id: ${transactionId}`,
                  FAILED_MESSAGE_DISPLAY_TIME
                );
              }
            );
          });
      }, 4000);
    });
  }

  render() {
    const {
      buyElfValue,
      buyNum,
      buyFee,
      buyInputLoading,
      buyEstimateValueLoading
    } = this.props;
    const { menuName, currentWallet, loading } = this.state;
    console.log('buyEstimateValueLoading', buyEstimateValueLoading);

    return (
      <div className='modal'>
        <Row className='modal-form-item'>
          <Col span={8} style={{ color: '#c8c7c7' }}>
            Address
          </Col>
          <Col span={16}>{addressOmit(currentWallet.address)}</Col>
        </Row>
        <Row className='modal-form-item'>
          <Col span={8} style={{ color: '#c8c7c7' }}>
            Buy{menuName}Quantity
          </Col>
          <Col span={16}>
            <Spin spinning={buyInputLoading}>
              {thousandsCommaWithDecimal(buyNum)}
            </Spin>
          </Col>
        </Row>
        <Row className='modal-form-item'>
          <Col span={8} style={{ color: '#c8c7c7' }}>
            {SYMBOL}
          </Col>
          <Col span={16}>
            <Spin spinning={buyEstimateValueLoading}>
              {thousandsCommaWithDecimal(buyElfValue)}
            </Spin>
          </Col>
        </Row>
        <div className='service-charge'>
          *Service Charge: {thousandsCommaWithDecimal(buyFee)} {SYMBOL}
        </div>
        <Button
          type='primary'
          className='modal-button buy-btn'
          onClick={this.getBuyRes.bind(this)}
          loading={loading}
        >
          Buy
        </Button>
        <div className='modal-tip'>
          * To avoid price fluctuations leading to transaction failure, please
          complete the transaction within 30 seconds.
        </div>
      </div>
    );
  }
}
