/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
 */

import React, { Component } from 'react';
import {
  Row,
  Col,
  Input,
  InputNumber,
  Slider,
  message,
  Modal,
  Spin,
  Button,
  Tooltip
} from 'antd';
// import _ from 'lodash';
import {
  feeReceiverContract,
  tokenConverter,
  multiToken
} from '../../../../../../../config/config';
import getMenuName from '../../../../../../utils/getMenuName';
import getEstimatedValueRes from '../../../../../../utils/getEstimatedValueRes';
import getEstimatedValueELF from '../../../../../../utils/getEstimatedValueELF';
import getFees from '../../../../../../utils/getFees';
import contractChange from '../../../../../../utils/contractChange';
import './ResourceBuy.less';
import {
  SYMBOL,
  ELF_DECIMAL,
  GENERAL_PRECISION,
  RESOURCE_OPERATE_LIMIT,
  BALANCE_LESS_THAN_OPERATE_LIMIT_TIP,
  OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP,
  BUY_OR_SELL_MORE_THAN_ASSETS_TIP,
  BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP,
  TRANSACT_LARGE_THAN_ZERO_TIP,
  ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP,
  CHECK_BALANCE_TIP,
  FEE_RATE
} from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';
import { regPos } from '@utils/regExps';

const ELF_TO_RESOURCE_PARAM = 0.00000001;
const A_PARAM_TO_AVOID_THE_MAX_BUY_AMOUNT_LARGE_THAN_ELF_BALANCE = 0.01;
// const processSliderMax = balance => {
//   return +(balance / 1.00001 - 0.01).toFixed(GENERAL_PRECISION);
// };

export default class ResourceBuy extends Component {
  constructor(props) {
    super(props);
    // todo: extract the throttle code
    this.inputThrottleTimer = null;
    this.sliderThrottleTimer = null;
    this.state = {
      menuName: null,
      appName: this.props.appName,
      menuIndex: this.props.menuIndex,
      contracts: null,
      region: 0,
      getSlideMarks: null,
      noCanInput: true,
      nightElf: null,
      account: {
        balance: 0,
        CPU: 0,
        RAM: 0,
        NET: 0,
        STO: 0
      },
      toBuy: true,

      // todo: use an individual variable for slider as it's stuck using the father component's state elfValue
      // todo: after fix the stuck problem, instead with father component's state
      inputMax: 0,
      operateNumToSmall: false
    };

    this.onChangeResourceValue = this.onChangeResourceValue.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentWallet !== state.currentWallet) {
      return {
        currentWallet: props.currentWallet
      };
    }

    if (props.account !== state.account) {
      return {
        account: props.account
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

  componentDidMount() {
    this.setState({
      menuName: getMenuName(this.state.menuIndex)
    });
  }

  componentDidUpdate(prevProps) {
    const { handleModifyTradingState, account } = this.props;
    const { menuName } = this.state;

    if (prevProps.menuIndex !== this.props.menuIndex) {
      this.setState({
        menuName: getMenuName(this.props.menuIndex)
      });
      // todo: seems useless
      handleModifyTradingState({ buyNum: 0, buyElfValue: 0 });
    }

    if (prevProps.account !== this.props.account) {
      this.getRegion();
    }

    if (prevProps.account.balance !== account.balance) {
      this.getInputMaxValue();
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
    const { account } = this.state;
    this.setState({
      region: account.balance / 4
    });
  }

  getSlideMarks() {
    const { region, account } = this.state;
    console.log({
      region
    });
    if (region < RESOURCE_OPERATE_LIMIT) return { 0: '' };

    const regionLine = [
      0,
      region,
      region * 2,
      region * 3,
      account.balance.toFixed(GENERAL_PRECISION)
    ];
    let marks = {};
    regionLine.map(item => {
      marks[item] = '';
    });
    return marks;
  }

  // todo: to be more friendly, verify the input after click buy/sell?
  onChangeResourceValue(input) {
    const { handleModifyTradingState, buyNum } = this.props;
    console.log({
      buyNum,
      input
    });
    input = +input;
    // todo: give a friendly notify when verify the max and min
    // todo: used to handle the case such as 0.5, when you input 0.5 then blur it will verify again, it should be insteaded by reducing th useless verify later
    // todo: why is the input like -- still setState successfully?
    // the symbol '+' used to handle the case of 0.===0 && 1.===1
    if (+buyNum === input) return;
    if (!regPos.test(input) || input === 0) {
      clearTimeout(this.inputThrottleTimer);
      handleModifyTradingState({
        buyElfValue: 0,
        buyNum: null,
        buyEstimateValueLoading: false
      });
      if (input !== '' && input !== 0) {
        message.error('Only support positive float or interger.');
      }
      return;
    }
    // todo: use async instead
    // todo: Is it neccessary to make the loading code write in the same place? And if the answer is yes, how to make it?
    handleModifyTradingState(
      {
        buyEstimateValueLoading: true,
        buyNum: input
      },
      () => {
        this.getEstimatedElf(input);
      }
    );
  }

  // todo: throttle
  // todo: why is the throttle useless?
  getEstimatedElf(value) {
    let interval = 0;
    if (this.inputThrottleTimer) {
      interval = 500;
      clearTimeout(this.inputThrottleTimer);
    }
    this.inputThrottleTimer = setTimeout(() => {
      const { handleModifyTradingState } = this.props;
      const {
        menuName,
        tokenConverterContract,
        tokenContract,
        account
      } = this.state;
      // todo: maybe the judge code is useless
      // if (value === '') {
      //   this.setState({
      //     value: ''
      //   });
      //   return;
      // }
      console.log('value', value);
      value = +value;
      getEstimatedValueELF(
        menuName,
        value,
        tokenConverterContract,
        tokenContract
      ).then(result => {
        let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
        if (regPos.test(result) || regNeg.test(result)) {
          // todo: the code of rounding off maybe wrong so I comment it.
          const amountToPay = result;
          const buyFee = getFees(amountToPay);

          // todo: figure out the case need to add the fees.
          const amountToPayPlusFee = amountToPay + buyFee;
          // ---- Start: Handle the case input's cost larger than the elf's balance ----
          // buySliderValue = buyElfValue >= balance ? balance : buyElfValue;
          // ---- End: Handle the case input's cost larger than the elf's balance ----

          console.log({
            amountToPay,
            buyFee,
            amountToPayPlusFee
          });
          if (amountToPayPlusFee > 0) {
            this.setState({
              toBuy: true,
              operateNumToSmall: false
            });
            handleModifyTradingState({
              buyElfValue: amountToPayPlusFee,
              buyFee,
              buyEstimateValueLoading: false
            });
          } else {
            message.warning(OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP);
            this.setState({
              operateNumToSmall: true
            });
            handleModifyTradingState({
              // buyNum: null,
              buyElfValue: 0,
              buyFee: 0,
              buyEstimateValueLoading: false
            });
          }
        } else {
          this.setState({
            toBuy: false
          });

          handleModifyTradingState({
            buyEstimateValueLoading: false
          });
        }
      });
    }, interval);
  }

  onChangeSlide(e) {
    const { handleModifyTradingState } = this.props;
    console.log('change slide', e);
    if (e === 0) {
      // todo: seems useless
      handleModifyTradingState({
        buyNum: null,
        buyElfValue: 0,
        buySliderValue: 0
      });
      return;
    }
    console.log({
      e
    });
    // todo: the judge code as follows are temp method to handle the max slide
    // if (e === account.balance) {
    //   e /= 1.000138857990899;
    // }
    console.log({
      e
    });
    handleModifyTradingState({
      buySliderValue: e
    });
    this.getEstimatedInput(e);
  }

  getEstimatedInput(e) {
    let interval = 0;
    if (this.sliderThrottleTimer) {
      interval = 500;
      clearTimeout(this.sliderThrottleTimer);
    }
    this.sliderThrottleTimer = setTimeout(() => {
      const { handleModifyTradingState } = this.props;

      const buyFee = getFees(e);
      console.log('buyFee', buyFee);
      handleModifyTradingState({
        buyInputLoading: true,
        buyElfValue: e,
        buyFee
      });

      // elfCont -= getFees(elfCont);
      this.prepareParamsForEstimatedResource(e / (1 + FEE_RATE)).then(
        result => {
          let value = 0;
          if (Math.ceil(result) > 0) {
            value = Math.abs(result).toFixed(GENERAL_PRECISION);
            handleModifyTradingState({ buyInputLoading: false, buyNum: value });
          }
        }
      );
    }, interval);
  }

  prepareParamsForEstimatedResource(elfAmount) {
    const { menuName, tokenConverterContract, tokenContract } = this.state;

    if (!tokenConverterContract || !tokenContract) return Promise.resolve(0);
    console.log({
      elfAmount,
      menuName
    });
    return getEstimatedValueRes(
      menuName,
      elfAmount,
      tokenConverterContract,
      tokenContract,
      true
    );
  }

  getBuyModalShow() {
    const { buyElfValue, buyNum } = this.props;
    const {
      account,
      currentWallet,
      contracts,
      toBuy,
      appName,
      nightElf,
      operateNumToSmall
    } = this.state;
    console.log({
      buyNum,
      buyElfValue,
      account
    });
    // todo: also verify the input here? fix the error message here appeared in the case didn't verify by the way(such as input -1)

    if (!regPos.test(buyNum) || buyNum === 0) {
      // if (buyNum !== '' && buyNum !== 0) {
      // todo: the case of balance insufficient will enter here, so I put the balance message here, after rewrite the verify code please seperate the message notification code.
      message.error(
        `${ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP}${CHECK_BALANCE_TIP}`
      );
      // }
      return;
    }
    if (+buyNum === 0) {
      message.warning(TRANSACT_LARGE_THAN_ZERO_TIP);
      return;
    }
    if (operateNumToSmall) {
      message.warning(OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP);
      return;
    }
    if (buyElfValue > account.balance) {
      message.warning(BUY_OR_SELL_MORE_THAN_ASSETS_TIP);
      return;
    }
    if (!toBuy) {
      message.warning(BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP);
      return;
    }

    nightElf.checkPermission(
      {
        appName,
        type: 'addresss',
        address: currentWallet.address
      },
      (error, result) => {
        if (result && result.error === 0) {
          result.permissions.map(item => {
            const multiTokenObj = item.contracts.filter(data => {
              return data.contractAddress === multiToken;
            });
            this.checkPermissionsModify(
              result,
              contracts,
              currentWallet,
              appName
            );
          });
        } else {
          message.warning(result.errorMessage.message, 3);
        }
      }
    );
  }

  checkPermissionsModify(result, contracts, currentWallet, appName) {
    const { buyNum } = this.props;
    const { nightElf } = this.state;
    const wallet = {
      address: currentWallet.address
    };
    console.log({
      buyNum
    });
    contractChange(nightElf, result, currentWallet, appName).then(result => {
      if (buyNum && !result) {
        nightElf.chain.contractAt(
          contracts.multiToken,
          wallet,
          (err, contract) => {
            if (contract) {
              this.getApprove(contract);
            }
          }
        );
      } else {
        message.info('Contract renewal completed...', 3);
      }
    });
  }

  // todo: remove the useless code
  getApprove(result, time = 0) {
    const { buyElfValue, buyNum, handleModifyTradingState } = this.props;
    const contract = result || null;
    if (contract) {
      if (result) {
        console.log('Approve', contract);
        handleModifyTradingState({
          buyVisible: true
        });
      }
    }
  }

  getSlideMarksHTML() {
    const { buyNum, buyElfValue, buySliderValue } = this.props;
    let { region, account } = this.state;
    let disabled = false;
    const balance = account.balance.toFixed(GENERAL_PRECISION);
    // balance less than RESOURCE_OPERATE_LIMIT is temp not allowed to use slider
    if (balance < RESOURCE_OPERATE_LIMIT) {
      disabled = true;
    }
    if (region < RESOURCE_OPERATE_LIMIT) {
      region = 0;
      disabled = true;
    }
    console.log('In slider', {
      buyNum,
      balance
    });
    return (
      // todo: why is the tooltip didn't work?
      <Tooltip
        title={BALANCE_LESS_THAN_OPERATE_LIMIT_TIP}
        // placement='topLeft'
      >
        <Slider
          marks={this.getSlideMarks()}
          step={region}
          // dots
          disabled={disabled}
          min={0}
          value={buySliderValue}
          onChange={e => this.onChangeSlide(e)}
          // todo: the max is set in this way for avoid the elf paid larger than elf's balance
          max={
            +(
              +balance -
              A_PARAM_TO_AVOID_THE_MAX_BUY_AMOUNT_LARGE_THAN_ELF_BALANCE
            ).toFixed(GENERAL_PRECISION)
          }
          // tooltipVisible={false}
          // todo: optimize the tooltip
          tipFormatter={
            disabled ? () => BALANCE_LESS_THAN_OPERATE_LIMIT_TIP : null
          }
        />
      </Tooltip>
    );
  }

  getInputMaxValue() {
    const { account } = this.state;

    // Add the ELF_TO_RESOURCE_PARAM to avoid the case elf is insufficient to pay
    // todo: the input max may be has problem in some case
    this.prepareParamsForEstimatedResource(account.balance / (1 + FEE_RATE))
      .then(res => {
        const inputMax = +res;
        console.log({
          inputMax
        });
        this.setState({
          inputMax
        });
      })
      .catch(err => {
        console.error('err', err);
      });
  }

  render() {
    const {
      buyNum,
      buyElfValue,
      buySliderValue,
      buyInputLoading,
      buyEstimateValueLoading
    } = this.props;
    const { menuName, account, inputMax } = this.state;
    const sliderHTML = this.getSlideMarksHTML();
    console.log("In buy's render", {
      buyElfValue,
      inputMax,
      buyNum
    });

    return (
      <div className='trading-box trading-buy'>
        <div className='trading'>
          <div className='trading-title'>Buy</div>
          <div className='trading-input'>
            <Row type='flex' align='middle'>
              <Col span={6} style={{ color: '#fff' }}>
                Buying quantity{' '}
              </Col>
              <Col span={18}>
                <Spin spinning={buyInputLoading}>
                  <InputNumber
                    // addonAfter={`x100,000 ${menuName}`}
                    // todo: get the step according to the user's balance
                    value={buyNum}
                    onChange={this.onChangeResourceValue}
                    placeholder={`Enter ${menuName} amount`}
                    // todo: use parser to set the max decimal to 8, e.g. using parseFloat
                    // parser={value => value.replace(/[^.\d]+/g, '')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    min={0}
                    max={
                      +(
                        inputMax -
                        A_PARAM_TO_AVOID_THE_MAX_BUY_AMOUNT_LARGE_THAN_ELF_BALANCE
                      ).toFixed(GENERAL_PRECISION)
                    }
                    // precision={8}
                  />
                </Spin>
              </Col>
            </Row>
            <div className='ELF-value'>
              <Spin spinning={buyEstimateValueLoading}>
                ≈ {thousandsCommaWithDecimal(buyElfValue)} {SYMBOL}
              </Spin>
            </div>
            <Row type='flex' align='middle'>
              <Col span={6} style={{ color: '#fff' }}>
                Available
              </Col>
              <Col span={18}>
                <Input
                  value={thousandsCommaWithDecimal(account.balance)}
                  addonAfter={SYMBOL}
                  disabled={true}
                />
              </Col>
            </Row>
          </div>
          <div className='trading-slide'>
            {sliderHTML}
            <div className='ElF-value'>
              {thousandsCommaWithDecimal(buySliderValue)} {SYMBOL}
            </div>
          </div>
          <Button
            className='trading-button'
            style={{ background: '#007130', border: 'none', color: '#fff' }}
            onClick={this.getBuyModalShow.bind(this)}
            loading={buyEstimateValueLoading}
          >
            Buy
          </Button>
        </div>
      </div>
    );
  }
}
