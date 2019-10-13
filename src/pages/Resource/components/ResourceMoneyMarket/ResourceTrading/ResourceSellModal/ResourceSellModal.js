/**
 * @file ResourceBuyModal
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import { Row, Col, Spin, message, Button } from 'antd';
import { aelf } from '../../../../../../utils';
import { tokenConverter } from '../../../../../../../config/config';
import getEstimatedValueELF from '../../../../../../utils/getEstimatedValueELF';
import addressOmit from '../../../../../../utils/addressOmit';
import getStateJudgment from '../../../../../../utils/getStateJudgment';
import getFees from '../../../../../../utils/getFees';
import './ResourceSellModal.less';
import getMenuName from '../../../../../../utils/getMenuName';
import { thousandsCommaWithDecimal } from '@utils/formater';
import { SYMBOL, ELF_DECIMAL, TEMP_RESOURCE_DECIMAL } from '@src/constants';

export default class ResourceSellModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuIndex: this.props.menuIndex,
      currentWallet: this.props.currentWallet,
      sellNum: this.props.sellNum,
      tokenConverterContract: this.props.tokenConverterContract,
      tokenContract: this.props.tokenContract,
      menuName: getMenuName(this.props.menuIndex),
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
    const { menuName, sellNum } = this.state;
    console.log('result', result);
    console.log('sellNum', sellNum);
    console.log('menuName', menuName);
    const payload = {
      symbol: menuName,
      amount: sellNum * ELF_DECIMAL
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
            console.log('error', error);
            return;
          }
          console.log('result', result);
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
    const { sellFee, SellELFValue, sellEstimateValueLoading, sellNum } = this.props;
    const { menuName, currentWallet } = this.state;
    console.log('sellFee', sellFee);
    console.log('SellELFValue', SellELFValue);
    console.log({
      sellEstimateValueLoading
    });

    return (
      <div className='modal'>
        <Spin size='large' spinning={this.state.loading}>
          <Row className='display-box'>
            <Col span={8} style={{ color: '#c8c7c7' }}>
              Address
            </Col>
            <Col span={16}>{addressOmit(currentWallet.address)}</Col>
          </Row>
          <Row className='display-box'>
            <Col span={8} style={{ color: '#c8c7c7' }}>
              Sell {menuName} Quantity
            </Col>
            <Col span={16}>{thousandsCommaWithDecimal(sellNum)}</Col>
          </Row>
          <Row className='display-box'>
            <Col span={8} style={{ color: '#c8c7c7' }}>
              Sell {SYMBOL}
            </Col>
            <Col span={16}>
              <Spin spinning={sellEstimateValueLoading}>
                {thousandsCommaWithDecimal(SellELFValue)}
              </Spin>
            </Col>
          </Row>
          <div className='service-charge'>
            *Service Charge: {thousandsCommaWithDecimal(sellFee)} {SYMBOL}
          </div>
          <Button
            className='modal-button'
            style={{ background: '#cc2828', border: 'none' }}
            loading={sellEstimateValueLoading}
            onClick={this.getSellRes}
          >
            Sell
          </Button>
          <div className='modal-tip'>
            * To avoid price fluctuations leading to transaction failure, please
            complete the transaction within 30 seconds.
          </div>
        </Spin>
      </div>
    );
  }
}
