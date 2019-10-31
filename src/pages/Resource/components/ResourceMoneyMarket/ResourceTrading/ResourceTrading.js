/**
 * @file Resource Trading
 * @author zhouminghui
 * Purchase and Sell of Resources
 */

import React, { PureComponent } from 'react';
import { Row, Col, Modal } from 'antd';
import ResourceBuy from './ResourceBuy/ResourceBuy';
import ResourceSell from './ResourceSell/ResourceSell';
import ResourceBuyModal from './ResourceBuyModal/ResourceBuyModal';
import ResourceSellModal from './ResourceSellModal/ResourceSellModal';
import './ResourceTrading.less';

export default class ResourceTrading extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentWallet: this.props.currentWallet || null,
      menuIndex: this.props.menuIndex,
      contracts: this.props.contracts,
      buyVisible: false,
      sellVisible: false,

      tokenConverterContract: null,
      tokenContract: null,
      ELFValue: 0,
      SellELFValue: 0,
      maskClosable: true,
      nightElf: this.props.nightElf,
      account: {
        balance: 0,
        CPU: 0,
        RAM: 0,
        NET: 0,
        STO: 0
      },

      buyNum: null,
      buyFee: 0,
      buyElfValue: 0,
      buySliderValue: 0,
      buyInputLoading: false,
      buyEstimateValueLoading: false,
      sellNum: null,
      sellFee: 0,
      sellEstimateValueLoading: false
    };

    this.handleModifyTradingState = this.handleModifyTradingState.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentWallet !== state.currentWallet) {
      return {
        currentWallet: props.currentWallet
      };
    }

    if (props.nightElf !== state.nightElf) {
      return {
        nightElf: props.nightElf
      };
    }

    if (props.menuIndex !== state.menuIndex) {
      return {
        menuIndex: props.menuIndex
      };
    }

    if (props.contracts !== state.contracts) {
      return {
        contracts: props.contracts
      };
    }

    if (props.tokenConverterContract !== state.tokenConverterContract) {
      return {
        tokenConverterContract: props.tokenConverterContract
      };
    }

    if (props.tokenContract !== state.tokenContract) {
      return {
        tokenContract: props.tokenContract
      };
    }

    if (props.account !== state.account) {
      return {
        account: props.account
      };
    }

    return null;
  }

  handleSellModalShow(value, ELFValue) {
    this.setState({
      sellVisible: true
      // sellNum: value,
      // ELFValue
    });
  }

  handleCancel = e => {
    this.setState({
      buyVisible: false,
      sellVisible: false
    });
  };

  modalMaskClosable() {
    this.setState({
      maskClosable: false
    });
  }

  modalUnMaskClosable() {
    this.setState({
      maskClosable: true
    });
  }

  handleModifyTradingState(obj, callback) {
    console.log('obj', obj);
    this.setState(obj, callback);
  }

  render() {
    const {
      menuIndex,
      sellVisible,
      buyVisible,
      currentWallet,
      contracts,
      tokenContract,
      tokenConverterContract,
      menuName,
      ELFValue,
      SellELFValue,
      buyElfValue,
      account,
      maskClosable,
      nightElf,

      buyNum,
      buyFee,
      buySliderValue,
      buyInputLoading,
      buyEstimateValueLoading,
      sellNum,
      sellFee,
      sellEstimateValueLoading
    } = this.state;
    return (
      <div className='resource-trading'>
        <div className='resource-trading-head'>Transaction</div>
        <div className='resource-trading-body'>
          <Row>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
              <ResourceBuy
                menuIndex={menuIndex}
                currentWallet={currentWallet}
                contracts={contracts}
                tokenConverterContract={tokenConverterContract}
                tokenContract={tokenContract}
                account={account}
                nightElf={nightElf}
                buyNum={buyNum}
                buyElfValue={buyElfValue}
                buySliderValue={buySliderValue}
                buyInputLoading={buyInputLoading}
                buyEstimateValueLoading={buyEstimateValueLoading}
                handleModifyTradingState={this.handleModifyTradingState}
              />
            </Col>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
              <ResourceSell
                menuIndex={menuIndex}
                currentWallet={currentWallet}
                handleSellModalShow={this.handleSellModalShow.bind(this)}
                contracts={contracts}
                tokenConverterContract={tokenConverterContract}
                tokenContract={tokenContract}
                account={account}
                nightElf={nightElf}
                sellNum={sellNum}
                sellEstimateValueLoading={sellEstimateValueLoading}
                handleModifyTradingState={this.handleModifyTradingState}
              />
            </Col>
          </Row>
        </div>
        <Modal
          className='modal-display-box'
          title='Resource buying'
          destroyOnClose={true}
          closable={false}
          footer={null}
          visible={buyVisible}
          centered={true}
          maskClosable
          onCancel={this.handleCancel}
          width={820}
        >
          <ResourceBuyModal
            currentWallet={currentWallet}
            menuIndex={menuIndex}
            menuName={menuName}
            tokenConverterContract={tokenConverterContract}
            tokenContract={tokenContract}
            handleCancel={this.handleCancel}
            onRefresh={this.props.onRefresh}
            maskClosable={this.modalMaskClosable.bind(this)}
            unMaskClosable={this.modalUnMaskClosable.bind(this)}
            nightElf={nightElf}
            contracts={contracts}
            buyNum={buyNum}
            buyElfValue={buyElfValue}
            buyFee={buyFee}
            buyInputLoading={buyInputLoading}
            buyEstimateValueLoading={buyEstimateValueLoading}
            handleModifyTradingState={this.handleModifyTradingState}
          />
        </Modal>
        <Modal
          className='modal-display-box'
          title='Resource selling'
          destroyOnClose={true}
          closable={false}
          footer={null}
          visible={sellVisible}
          centered={true}
          maskClosable
          onCancel={this.handleCancel}
          width={820}
        >
          <ResourceSellModal
            currentWallet={currentWallet}
            menuIndex={menuIndex}
            tokenConverterContract={tokenConverterContract}
            tokenContract={tokenContract}
            sellNum={sellNum}
            menuName={menuName}
            handleCancel={this.handleCancel}
            onRefresh={this.props.onRefresh}
            maskClosable={this.modalMaskClosable.bind(this)}
            unMaskClosable={this.modalUnMaskClosable.bind(this)}
            nightElf={nightElf}
            contracts={contracts}
            account={account}
            SellELFValue={SellELFValue}
            sellFee={sellFee}
            sellEstimateValueLoading={sellEstimateValueLoading}
          />
        </Modal>
      </div>
    );
  }
}
