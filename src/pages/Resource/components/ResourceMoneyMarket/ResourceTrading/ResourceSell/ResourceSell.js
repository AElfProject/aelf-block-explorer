/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
 */

import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import {
  Input,
  InputNumber,
  Slider,
  message,
  Spin,
  Form,
  Button
} from 'antd';
import {
  multiToken
} from '../../../../../../../config/config';
import getEstimatedValueRes from '../../../../../../utils/getEstimatedValueRes';
import getFees from '../../../../../../utils/getFees';
import './ResourceSell.less';
import {
  SYMBOL,
  OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP,
  BUY_OR_SELL_MORE_THAN_ASSETS_TIP,
  BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP,
  TRANSACT_LARGE_THAN_ZERO_TIP,
  ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP,
  CHECK_BALANCE_TIP,
  BETWEEN_ZEOR_AND_BALANCE_TIP
} from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';
import { regPos } from '@utils/regExps';
import { getMagneticValue } from '@utils/styleUtils';
import NightElfCheck from "../../../../../../utils/NightElfCheck";
import getLogin from "../../../../../../utils/getLogin";
import {isPhoneCheck} from "../../../../../../utils/deviceCheck";

// const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
const status = { ERROR: 'error' };

class ResourceSell extends Component {
  constructor(props) {
    super(props);
    this.region = 0;
    this.state = {
      appName: this.props.appName,
      contracts: null,
      ELFValue: 0,
      purchaseQuantity: 0,
      getSlideMarks: null,
      noCanInput: true,
      toSell: false,

      operateNumToSmall: false,
      // todo: put the validateStatus with the validated value
      validate: {
        validateStatus: null,
        help: ''
      },
      sellBtnLoading: false
    };

    this.onChangeResourceValue = this.onChangeResourceValue.bind(this);
    this.onChangeSlide = this.onChangeSlide.bind(this);
    this.getSellModalShow = this.getSellModalShow.bind(this);
    this.NightELFCheckAndShowSellModal = this.NightELFCheckAndShowSellModal.bind(this);
    this.getElfValue = debounce(this.getElfValue, 500);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentWallet !== state.currentWallet) {
      return {
        currentWallet: props.currentWallet
      };
    }

    if (props.contracts !== state.contracts) {
      return {
        contracts: props.contracts
      };
    }

    if (props.nightElf !== state.nightElf) {
      return {
        nightElf: props.nightElf
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

    return null;
  }

  componentDidUpdate(prevProps) {
    const { handleModifyTradingState } = this.props;

    if (prevProps.currentResourceType !== this.props.currentResourceType) {
      this.setState({
        purchaseQuantity: 0,
        ELFValue: 0
      });
      handleModifyTradingState({
        sellNum: null
      });
    }
    if (
      prevProps.tokenConverterContract !== this.props.tokenConverterContract
    ) {
      this.setState({
        noCanInput: false
      });
    }
  }

  getRegion() {
    const { account, currentResourceIndex } = this.props;
    const balance = account.resourceTokens[currentResourceIndex].balance;
    this.region = balance / 4;
  }

  getSlideMarks() {
    const { account, currentResourceIndex } = this.props;
    const { region } = this;
    const balance = account.resourceTokens[currentResourceIndex].balance;
    this.regionLine = [0, region, region * 2, region * 3, balance];
    const marks = {};
    this.regionLine.forEach(item => {
      marks[item] = '';
    });
    return marks;
  }

  getSlideMarksHTML() {
    const { account, currentResourceIndex, sellEstimateValueLoading, sellNum } = this.props;
    const { purchaseQuantity, sellBtnLoading } = this.state;
    const disabled = false;
    const balance = account.resourceTokens[currentResourceIndex].balance;
    return (
      <Slider
        marks={this.getSlideMarks()}
        step={0.01}
        disabled={disabled || sellEstimateValueLoading || sellBtnLoading}
        min={0}
        value={sellNum ? purchaseQuantity : 0}
        onChange={this.onChangeSlide}
        max={balance}
        tooltipVisible={false}
      />
    );
  }

  onChangeResourceValue(input) {
    // console.log('onChangeResourceValue,', !input.target && input, input.target && input.target.value);
    input = input.target && input.target.value ? input.target.value : input;

    const { handleModifyTradingState, sellNum, account, currentResourceIndex } = this.props;
    this.inputMax = account.resourceTokens[currentResourceIndex].balance;
    this.setState({
      purchaseQuantity: isNaN(+input) ? 0 : +input,
      validate: {
        validateStatus: null,
        help: ''
      }
    });

    input = +input
    input = input > this.inputMax ? this.inputMax : input;

    if (+sellNum === +input) {
      handleModifyTradingState({
        sellNum: input
      });
      return;
    }
    if (!regPos.test(input) || +input === 0) {
      this.setState({
        ELFValue: 0
      });
      handleModifyTradingState({
        sellNum: null
      });
      if (input !== '' && +input !== 0) {
        message.error('Only support positive float or integer.');
      }
      return;
    }
    const nextSellNum = Number.isNaN(+input) ? input : +input;
    handleModifyTradingState({
      sellEstimateValueLoading: true,
      sellNum: nextSellNum
    });
    if (nextSellNum > this.inputMax) {
      this.setState({
        validate: {
          validateStatus: status.ERROR,
          help: BETWEEN_ZEOR_AND_BALANCE_TIP
        }
      });
    }
    this.getElfValue(input);
  }

  getElfValue(value) {
    const { handleModifyTradingState, currentResourceType } = this.props;
    const { tokenConverterContract, tokenContract } = this.state;
    if (value === '') {
      this.setState({
        ELFValue: 0
      });
      handleModifyTradingState({
        sellNum: ''
      });
      return;
    }
    getEstimatedValueRes(
        currentResourceType,
        value,
        tokenConverterContract,
        tokenContract
    ).then(result => {
      // todo: handle the case BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP
      const amountToReceive = result;
      const fee = getFees(amountToReceive);
      const amountToReceiveMinusFee = amountToReceive - fee;
      if (amountToReceiveMinusFee > 0) {
        handleModifyTradingState({
          sellEstimateValueLoading: false,
          sellFee: fee,
          SellELFValue: amountToReceiveMinusFee
        });
        this.setState({
          ELFValue: amountToReceiveMinusFee,
          toSell: true,
          operateNumToSmall: false
        });
      } else {
        message.warning(
            OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP
        );
        this.setState({
          operateNumToSmall: true
        });
        handleModifyTradingState({
          // buyNum: null,
          SellELFValue: 0,
          sellFee: 0,
          sellEstimateValueLoading: false
        });
      }
    })
    .catch(err => {
      message.error(err.message || err.msg || 'Error happened');
      console.error('err', err);
    });
  }

  onChangeSlide(e) {
    e = getMagneticValue(e, this.regionLine);

    this.setState({
      purchaseQuantity: +e
    });

    this.onChangeResourceValue(e);
  }

  // TODO: in ResourceBuy, there are same codes.
  NightELFCheckAndShowSellModal() {
    NightElfCheck.getInstance().check.then(ready => {
      const nightElf = NightElfCheck.getAelfInstanceByExtension();
      getLogin(nightElf, {}, result => {

        this.props.loginAndInsertKeypairs(true, false);
        if (result.error) {
          if (result.error === 200010) {
            message.warn('Please Login.');
          } else {
            message.warn(result.errorMessage.message || 'Please check your NightELF browser extension.')
          }
        } else {
          this.getSellModalShow();
        }
      });
    }).catch(() => {
      message.warn('Please download and install NightELF browser extension.');
    });
  }

  getSellModalShow() {
    const { sellNum, currentResourceIndex, account } = this.props;
    const {
      currentWallet,
      contracts,
      toSell,
      appName,
      nightElf,
      operateNumToSmall
    } = this.state;

    this.setState({
      sellBtnLoading: true
    });

    if (!regPos.test(sellNum) || sellNum === 0) {
      message.error(
        `${ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP}${CHECK_BALANCE_TIP}`
      );
      this.setState({
        sellBtnLoading: false
      });
      return;
    }
    if (+sellNum === 0) {
      message.warning(TRANSACT_LARGE_THAN_ZERO_TIP);
      this.setState({
        sellBtnLoading: false
      });
      return;
    }
    if (operateNumToSmall) {
      message.warning(OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP);
      this.setState({
        sellBtnLoading: false
      });
      return;
    }
    if (sellNum > account.resourceTokens[currentResourceIndex].balance) {
      message.warning(BUY_OR_SELL_MORE_THAN_ASSETS_TIP);
      this.setState({
        sellBtnLoading: false
      });
      return;
    }
    if (!toSell) {
      message.warning(BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP);
      this.setState({
        sellBtnLoading: false
      });
      return;
    }

    const wallet = {
      address: currentWallet.address
    };
    nightElf.chain.contractAt(contracts.multiToken, wallet).then(contract => {
      if (contract) {
        this.getApprove(contract);
      }
    });
  }

  getApprove(result, time = 0) {
    const { handleModifyTradingState } = this.props;
    // console.log('getApprove sell result: ', result);
    if (!result) {
      return;
    }
    // todo: handle the error case's loading
    handleModifyTradingState(
      {
        sellVisible: true
      },
      () => {
        this.setState({
          sellBtnLoading: false
        });
      }
    );
  }

  render() {
    const { sellEstimateValueLoading, sellNum, currentResourceIndex, currentResourceType, account } = this.props;
    const {
      purchaseQuantity,
      ELFValue,
      validate,
      sellBtnLoading
    } = this.state;

    this.inputMax = account.resourceTokens[currentResourceIndex].balance;

    this.getRegion();
    const slideHTML = this.getSlideMarksHTML();

    // console.log('sell num', ELFValue, sellNum, this.inputMax);
    return (
      <div className='trading-box trading-sell'>
        <div className='trading'>
          <div className='trading-input'>
            <div className="resource-action-block">
              <span className="resource-action-title">
                Selling quantity:
              </span>
              <Form.Item
                  className="resource-action-input"
                  validateStatus={validate.validateStatus}
                  help={validate.help}
                  style={{ padding: 3 }}
              >
                {!isPhoneCheck() ? <InputNumber
                    value={sellNum}
                    onChange={this.onChangeResourceValue}
                    placeholder={`Enter ${currentResourceType} amount`}
                    // todo: use parser to set the max decimal to 8, e.g. using parseFloat
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    disabled={!this.inputMax}
                    min={0}
                    max={this.inputMax}
                /> : <input
                  className="mobile-trading-input"
                  placeholder={`Enter ${currentResourceType} amount`}
                  value={sellNum}
                  onChange={this.onChangeResourceValue}
                  disabled={!this.inputMax}
                  min={0}
                  max={this.inputMax}
                />}
              </Form.Item>
            </div>
            <div className='ELF-value'>
              <Spin spinning={sellEstimateValueLoading}>
                ≈ {sellNum && ELFValue ? thousandsCommaWithDecimal(ELFValue) : '0.00'} {SYMBOL}
              </Spin>
            </div>
            <div className="resource-action-block">
              <span className="resource-action-title">
                Available: {sellNum}
              </span>
              {
                isPhoneCheck()
                  ? <div className="resource-action-input">
                    {this.inputMax ? thousandsCommaWithDecimal(this.inputMax) : '-'} {currentResourceType}
                  </div>
                  : <Input
                    className="resource-action-input"
                    value={thousandsCommaWithDecimal(this.inputMax)}
                    placeholder={thousandsCommaWithDecimal(this.inputMax)}
                    addonAfter={currentResourceType}
                    disabled={true}
                  />
              }
            </div>
          </div>
          <div className='trading-slide'>
            {slideHTML}
            <div className='ElF-value'>
              {sellNum && purchaseQuantity ? thousandsCommaWithDecimal(purchaseQuantity) : '0.00'} {currentResourceType}
            </div>
          </div>
          <Button
            className='trading-button sell-btn'
            onClick={this.NightELFCheckAndShowSellModal}
            loading={sellBtnLoading || sellEstimateValueLoading}
            disabled={validate.validateStatus === status.ERROR}
          >
            Sell
          </Button>
        </div>
      </div>
    );
  }
}

export default ResourceSell;
