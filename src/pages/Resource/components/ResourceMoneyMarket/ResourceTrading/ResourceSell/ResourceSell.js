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
  Spin
} from 'antd';
import contractChange from '../../../../../../utils/contractChange';
import {
  feeReceiverContract,
  tokenConverter,
  multiToken
} from '../../../../../../../config/config';
import getMenuName from '../../../../../../utils/getMenuName';
import getEstimatedValueELF from '../../../../../../utils/getEstimatedValueELF';
import './ResourceSell.less';
import { SYMBOL, ELF_DECIMAL, TEMP_RESOURCE_DECIMAL } from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';

export default class ResourceSell extends Component {
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
      value: null,
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

      getEstimateValueLoading: false
    };
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
    if (prevProps.menuIndex !== this.props.menuIndex) {
      this.setState({
        menuName: getMenuName(this.props.menuIndex),
        value: null,
        purchaseQuantity: 0,
        ELFValue: 0
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

  // todo: to be more friendly, verify the input after click buy/sell?
  onChangeResourceValue(input) {
    console.log("hey I'm here");
    const { value } = this.state;
    // todo: make the reg allow the format like 0.
    const regPos = /^\d+(\.\d*)?$/; // 非负浮点数, allow 0.
    console.log({
      value,
      input
    });
    // todo: give a friendly notify when verify the max and min
    // todo: used to handle the case such as 0.5, when you input 0.5 then blur it will verify again, it should be insteaded by reducing th useless verify later
    // the symbol '+' used to handle the case of 0.===0 && 1.===1
    if (+value === +input) return;
    if (!regPos.test(input) || +input === 0) {
      this.setState({
        value: null,
        ELFValue: 0
      });
      if (input !== '' && +input !== 0) {
        message.error('Only support positive float or interger.');
      }
      return;
    }
    // todo: use async instead
    // todo: Is it neccessary to make the loading code write in the same place? And if the answer is yes, how to make it?
    this.setState({
      getEstimateValueLoading: true,
      value: input
    });
    this.debounce(input);
  }

  // todo: throttle
  // todo: why is the debounce useless?
  debounce(value) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      const { menuName, tokenConverterContract, tokenContract } = this.state;
      // todo: maybe the judge code is useless
      if (value === '') {
        this.setState({
          ELFValue: 0,
          value: ''
        });
        return;
      }
      getEstimatedValueELF(
        menuName,
        value,
        tokenConverterContract,
        tokenContract,
        'Sell'
      ).then(result => {
        let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
        if (regPos.test(result) || regNeg.test(result)) {
          // todo: the code of rounding off maybe wrong so I comment it.
          // let ELFValue = Math.abs(Math.ceil(result));
          const ELFValue = result;
          // ELFValue += getFees(ELFValue);
          this.setState({
            ELFValue,
            toSell: true,
            getEstimateValueLoading: false
          });
        } else {
          this.setState({
            toSell: false,
            getEstimateValueLoading: false
          });
        }
      });
    }, 500);
    return this.debounceTimer;
  }

  getRegion(index) {
    const { account } = this.state;
    const menuName = getMenuName(index);
    let value = account[menuName];
    this.region = value / 4;
  }

  getSlideMarks() {
    const { account, menuIndex } = this.state;
    const region = this.region;

    let menuName = getMenuName(menuIndex);
    // if (region < 4) {
    //     const regionLine = [0, 25, 50, 75, 100];
    //     let marks = {};
    //     regionLine.map(item => {
    //         marks[item] = '';
    //     });
    //     return marks;
    // }
    const regionLine = [0, region, region * 2, region * 3, account[menuName]];
    let marks = {};
    regionLine.map(item => {
      marks[item] = '';
    });
    return marks;
  }

  onChangeSlide(e) {
    this.setState({
      purchaseQuantity: e
    });

    this.onChangeResourceValue(e);
  }

  getSellModalShow() {
    const {
      value,
      account,
      currentWallet,
      contracts,
      menuIndex,
      toSell,
      appName,
      nightElf
    } = this.state;
    let menuName = getMenuName(menuIndex);
    // let reg = /^[1-9]\d*$/;
    // if (!reg.test(value)) {
    // message.error('The value must be numeric and greater than 0');
    // return;
    // }
    if (parseInt(value, 10) > account[menuName]) {
      message.warning('Buy and sell more than available assets');
      return;
    } else if (!toSell) {
      message.warning(
        'Please purchase or sell a smaller amount of resources than the inventory in the resource contract.'
      );
      return;
    } else {
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
          }
        }
      );
    }
  }

  // todo: there are same code in ResourceBuy
  checkPermissionsModify(result, contracts, currentWallet, appName) {
    const { nightElf, value } = this.state;
    const wallet = {
      address: currentWallet.address
    };
    contractChange(nightElf, result, currentWallet, appName).then(result => {
      if (value && !result) {
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

  getApprove(result, time = 0) {
    const { value, ELFValue, menuName } = this.state;
    const contract = result || null;
    if (contract) {
      if (result) {
        this.props.handleSellModalShow(value, ELFValue);
      }
    }
  }

  getSlideMarksHTML() {
    let { account, menuIndex, purchaseQuantity } = this.state;
    const region = this.region;
    let menuName = getMenuName(menuIndex);
    let disabled = false;
    let balance = account[menuName];
    console.log('account', account, menuIndex, menuName, balance, region);
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

  render() {
    const {
      purchaseQuantity,
      menuName,
      value,
      account,
      getEstimateValueLoading,
      ELFValue
    } = this.state;
    console.log('getEstimateValueLoading', getEstimateValueLoading);
    this.getRegion(this.state.menuIndex);
    const slideHTML = this.getSlideMarksHTML();
    return (
      <div className='trading-box trading-sell'>
        <div className='trading'>
          <div className='trading-title'>Sell</div>
          <div className='trading-input'>
            <Row type='flex' align='middle'>
              <Col span={6} style={{ color: '#fff' }}>
                Selling quantity{' '}
              </Col>
              <Col span={18}>
                <InputNumber
                  // addonAfter={`x100,000 ${menuName}`}
                  value={value}
                  onChange={this.onChangeResourceValue.bind(this)}
                  placeholder={`Enter ${menuName} amount`}
                  // todo: use parser to set the max decimal to 8, e.g. using parseFloat
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  formatter={value =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  min={0}
                  max={account[menuName]}
                  // precision={8}
                />
              </Col>
            </Row>
            <div className='ELF-value'>
              <Spin spinning={getEstimateValueLoading}>
                ≈ {thousandsCommaWithDecimal(ELFValue)} {SYMBOL}
              </Spin>
            </div>
            <Row type='flex' align='middle'>
              <Col span={6} style={{ color: '#fff' }}>
                Available
              </Col>
              <Col span={18}>
                <Input
                  value={thousandsCommaWithDecimal(account[menuName])}
                  addonAfter={menuName}
                  disabled={true}
                />
              </Col>
            </Row>
          </div>
          <div className='trading-slide'>
            {slideHTML}
            <div className='ElF-value'>
              {thousandsCommaWithDecimal(purchaseQuantity)} {menuName}
            </div>
          </div>
          <div
            className='trading-button'
            style={{ background: '#8c042a' }}
            onClick={this.getSellModalShow.bind(this)}
          >
            Sell
          </div>
        </div>
      </div>
    );
  }
}
