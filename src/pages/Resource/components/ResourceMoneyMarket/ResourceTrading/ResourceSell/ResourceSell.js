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
  Form,
  Button
} from 'antd';
import contractChange from '../../../../../../utils/contractChange';
import {
  feeReceiverContract,
  tokenConverter,
  multiToken
} from '../../../../../../../config/config';
import getMenuName from '../../../../../../utils/getMenuName';
import getEstimatedValueRes from '../../../../../../utils/getEstimatedValueRes';
import getFees from '../../../../../../utils/getFees';
import './ResourceSell.less';
import {
  SYMBOL,
  ELF_DECIMAL,
  TEMP_RESOURCE_DECIMAL,
  GENERAL_PRECISION,
  BALANCE_LESS_THAN_OPERATE_LIMIT_TIP,
  OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP,
  BUY_OR_SELL_MORE_THAN_ASSETS_TIP,
  BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP,
  TRANSACT_LARGE_THAN_ZERO_TIP,
  ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP,
  CHECK_BALANCE_TIP,
  INPUT_NUMBER_TIP,
  BETWEEN_ZEOR_AND_BALANCE_TIP
} from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';
import { regPos } from '@utils/regExps';

// const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
const status = { ERROR: 'error' };

class ResourceSell extends Component {
  constructor(props) {
    super(props);
    this.debounceTimer;
    this.state = {
      menuName: null,
      appName: this.props.appName,
      menuIndex: this.props.menuIndex,
      contracts: null,
      ELFValue: 0,
      // region: 0,
      purchaseQuantity: 0,
      getSlideMarks: null,
      noCanInput: true,
      account: {
        balance: 0,
        CPU: 0,
        RAM: 0,
        NET: 0,
        STO: 0
      },
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
    const { handleModifyTradingState } = this.props;

    if (prevProps.menuIndex !== this.props.menuIndex) {
      this.setState({
        menuName: getMenuName(this.props.menuIndex),
        purchaseQuantity: 0,
        ELFValue: 0
      });
      handleModifyTradingState({
        sellNum: null
      });
      // this.getRegion(this.state.menuIndex);
    }

    // if (prevProps.account !== this.props.account) {
    //     this.getRegion(this.state.menuIndex);
    // }

    if (
      prevProps.tokenConverterContract !== this.props.tokenConverterContract
    ) {
      this.setState({
        noCanInput: false
      });
    }
  }

  getRegion(index) {
    const { account } = this.state;
    const menuName = getMenuName(index);
    let value = account[menuName];
    this.region = value / 4;
  }

  getSlideMarks() {
    const { account, menuIndex } = this.state;
    const { region } = this;

    console.log({
      region
    });

    const menuName = getMenuName(menuIndex);
    // if (region < 4) {
    //     const regionLine = [0, 25, 50, 75, 100];
    //     let marks = {};
    //     regionLine.map(item => {
    //         marks[item] = '';
    //     });
    //     return marks;
    // }
    const regionLine = [0, region, region * 2, region * 3, account[menuName]];
    const marks = {};
    regionLine.forEach(item => {
      marks[item] = '';
    });
    return marks;
  }

  getSlideMarksHTML() {
    const { account, menuIndex, purchaseQuantity } = this.state;
    const { region } = this;
    const menuName = getMenuName(menuIndex);
    const disabled = false;
    const balance = account[menuName];
    console.log({ account, menuIndex, menuName, balance, region });
    // if (region < 4) {
    //     region = 25;
    //     balance = 100;
    //     disabled = true;
    // }
    return (
      <Slider
        marks={this.getSlideMarks()}
        step={region}
        disabled={disabled}
        min={0}
        value={purchaseQuantity}
        onChange={e => this.onChangeSlide(e)}
        max={balance}
        tooltipVisible={false}
      />
    );
  }

  // todo: to be more friendly, verify the input after click buy/sell?
  onChangeResourceValue(input) {
    const { handleModifyTradingState, sellNum } = this.props;
    console.log({
      sellNum,
      input
    });
    console.log("hey I'm here");
    // todo: give a friendly notify when verify the max and min
    // todo: used to handle the case such as 0.5, when you input 0.5 then blur it will verify again, it should be insteaded by reducing th useless verify later
    // todo: use antd's Form validate instead
    this.setState({
      validate: {
        validateStatus: null,
        help: ''
      }
    });
    // the symbol '+' used to handle the case of 0.===0 && 1.===1
    if (+sellNum === +input) return;
    // todo: use a util function to instead the regExp in page Resource
    if (!regPos.test(input) || +input === 0) {
      this.setState({
        ELFValue: 0
      });
      handleModifyTradingState({
        sellNum: null
      });
      if (input !== '' && +input !== 0) {
        message.error('Only support positive float or interger.');
      }
      return;
    }
    // todo: use async instead
    // todo: Is it neccessary to make the loading code write in the same place? And if the answer is yes, how to make it?
    // todo: It seems that it will cause some problem?
    const nextSellNum = Number.isNaN(+input) ? input : +input;
    console.log({
      nextSellNum
    });
    handleModifyTradingState({
      sellEstimateValueLoading: true,
      sellNum: nextSellNum
    });
    // todo: use antd's Form validate instead
    if (nextSellNum > this.inputMax) {
      this.setState({
        validate: {
          validateStatus: status.ERROR,
          help: BETWEEN_ZEOR_AND_BALANCE_TIP
        }
      });
    }
    // todo: how to validate all?
    // eslint-disable-next-line react/destructuring-assignment
    // this.props.form.validateFields('inputSellNum', { force: true });
    // this.props.form.validateFields((err, values) => {
    //   console.log({
    //     err,
    //     values
    //   });
    // });
    this.debounce(input);
  }

  // todo: throttle
  // todo: why is the debounce useless?
  debounce(value) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      const { handleModifyTradingState } = this.props;
      const { menuName, tokenConverterContract, tokenContract } = this.state;
      // todo: maybe the judge code is useless
      if (value === '') {
        this.setState({
          ELFValue: 0
        });
        handleModifyTradingState({
          sellNum: ''
        });
        return;
      }
      console.log(`I'm here`);
      getEstimatedValueRes(
        menuName,
        value,
        tokenConverterContract,
        tokenContract
      )
        .then(result => {
          console.log({
            result: typeof result
          });
          // todo: handle the case BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP
          if (true) {
            // todo: the code of rounding off maybe wrong so I comment it.
            // let ELFValue = Math.abs(Math.ceil(result));
            const amountToReceive = result;
            const fee = getFees(amountToReceive);
            const amountToReceiveMinusFee = amountToReceive - fee;
            console.log({
              amountToReceive,
              fee,
              amountToReceiveMinusFee,
              result
            });
            if (amountToReceiveMinusFee > 0) {
              handleModifyTradingState({
                sellEstimateValueLoading: false,
                sellFee: fee,
                SellELFValue: amountToReceiveMinusFee
              });
              this.setState({
                // todo: what is the role of the state ELFValue
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
          } else {
            this.setState({
              toSell: false
            });
            handleModifyTradingState({
              sellEstimateValueLoading: false
            });
          }
        })
        .catch(err => {
          console.error('err', err);
        });
    }, 500);
    return this.debounceTimer;
  }

  onChangeSlide(e) {
    this.setState({
      purchaseQuantity: +e
    });

    this.onChangeResourceValue(e);
  }

  getSellModalShow() {
    const { sellNum } = this.props;
    const {
      account,
      currentWallet,
      contracts,
      menuIndex,
      toSell,
      appName,
      nightElf,
      operateNumToSmall
    } = this.state;

    console.log({
      operateNumToSmall
    });

    this.setState({
      sellBtnLoading: true
    });
    const menuName = getMenuName(menuIndex);
    // let reg = /^[1-9]\d*$/;
    // if (!reg.test(value)) {
    // message.error('The value must be numeric and greater than 0');
    // return;
    // }
    // todo: extract the repeating code
    if (!regPos.test(sellNum) || sellNum === 0) {
      // if (sellNum !== '' && sellNum !== 0) {
      // todo: the case of balance insufficient will enter here, so I put the balance message here, after rewrite the verify code please seperate the message notification code.
      message.error(
        `${ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP}${CHECK_BALANCE_TIP}`
      );
      // }
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
    if (sellNum > account[menuName]) {
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

    console.log(nightElf);
    nightElf.checkPermission(
      {
        appName,
        type: 'address',
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
          this.setState({
            sellBtnLoading: false
          });
        }
      }
    );
  }

  // todo: there are same code in ResourceBuy
  checkPermissionsModify(result, contracts, currentWallet, appName) {
    const { sellNum } = this.props;
    const { nightElf } = this.state;
    const wallet = {
      address: currentWallet.address
    };
    contractChange(nightElf, result, currentWallet, appName).then(result => {
      if (sellNum && !result) {
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
        this.setState({
          sellBtnLoading: false
        });
      }
    });
  }

  getApprove(result, time = 0) {
    const { handleModifyTradingState } = this.props;
    const contract = result || null;
    // todo: handle the error case's loading
    if (contract) {
      if (result) {
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
    }
  }

  render() {
    const { sellEstimateValueLoading, sellNum } = this.props;
    const {
      purchaseQuantity,
      menuIndex,
      menuName,
      account,
      ELFValue,
      validate,
      sellBtnLoading
    } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    // const { getFieldDecorator } = this.props.form;

    this.inputMax = account[menuName];
    console.log('In sell render', {
      sellEstimateValueLoading,
      sellNum,
      inputMax: this.inputMax
    });
    this.getRegion(menuIndex);
    const slideHTML = this.getSlideMarksHTML();
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
                <InputNumber
                    // addonAfter={`x100,000 ${menuName}`}
                    value={sellNum}
                    onChange={this.onChangeResourceValue}
                    placeholder={`Enter ${menuName} amount`}
                    // todo: use parser to set the max decimal to 8, e.g. using parseFloat
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    min={0}
                    max={this.inputMax}
                    // precision={GENERAL_PRECISION}
                />
                {/* )} */}
              </Form.Item>
            </div>
            <div className='ELF-value'>
              <Spin spinning={sellEstimateValueLoading}>
                ≈ {thousandsCommaWithDecimal(ELFValue)} {SYMBOL}
              </Spin>
            </div>
            <div className="resource-action-block">
              <span className="resource-action-title">
                Available:
              </span>
              <Input
                  className="resource-action-input"
                  value={thousandsCommaWithDecimal(account[menuName])}
                  addonAfter={menuName}
                  disabled={true}
              />
            </div>
          </div>
          <div className='trading-slide'>
            {slideHTML}
            <div className='ElF-value'>
              {thousandsCommaWithDecimal(purchaseQuantity)} {menuName}
            </div>
          </div>
          <Button
            className='trading-button sell-btn'
            onClick={this.getSellModalShow.bind(this)}
            loading={sellBtnLoading}
            disabled={validate.validateStatus === status.ERROR}
          >
            Sell
          </Button>
        </div>
      </div>
    );
  }
}

// todo: we can also use antd's validateStatus instead of Form.create and getFieldDecorator
// export default Form.create({
//   onFieldsChange(props, changedFields) {
//     const { value } = changedFields.inputSellNum;
//     console.log({
//       value,
//       changedFields
//     });
//     if (value !== null && value !== undefined && !Number.isNaN(+value)) {
//       props.handleModifyTradingState({
//         sellNum: value
//       });
//     }
//   },
//   mapPropsToFields(props) {
//     console.log({
//       props
//     });
//     // return {
//     //   inputSellNum: Form.createFormField({
//     //     inputSellNum: props.sellNum
//     //   })
//     // };
//     return {
//       inputSellNum: Form.createFormField(props.sellNum)
//     };
//   }
// })(ResourceSell);
export default ResourceSell;
