/**
 * @file ResourceAElfWallet.js
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import { Row, Col, Spin } from 'antd';
import Svg from '../../../../components/Svg/Svg';
import { Link } from 'react-router-dom';
import './ResourceAElfWallet.less';
import { SYMBOL, ELF_DECIMAL } from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';

export default class ResourceAElfWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.resource = null;
    this.wallet = null;
    this.state = {
      currentWallet: this.props.currentWallet,
      tokenContract: this.props.tokenContract,
      balance: null,
      RAM: 0,
      CPU: 0,
      NET: 0,
      STO: 0,
      resourceReady: 0,
      loading: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.tokenContract !== state.tokenContract) {
      return {
        tokenContract: props.tokenContract
      };
    }

    if (props.currentWallet !== state.currentWallet) {
      return {
        currentWallet: props.currentWallet
      };
    }

    if (props.loading !== state.loading) {
      return {
        loading: props.loading
      };
    }

    return null;
  }

  componentDidMount() {
    if (this.state.tokenContract && this.state.currentWallet) {
      this.getCurrentWalletBalance();
      this.getCurrentWalletResource();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tokenContract !== this.props.tokenContract) {
      this.props.onRefresh();
      this.getCurrentWalletBalance();
    }

    if (prevState.currentWallet !== this.state.currentWallet) {
      this.props.onRefresh();
      this.getCurrentWalletResource();
      this.getCurrentWalletBalance();
    }

    if (prevState.loading !== this.state.loading) {
      const { tokenContract, currentWallet } = this.state;
      if (tokenContract && currentWallet) {
        if (this.state.loading) {
          this.getCurrentWalletResource();
          this.getCurrentWalletBalance();
        }
      }
    }

    if (this.state.resourceReady === 5) {
      this.setState({
        resourceReady: 0
      });
      this.props.endRefresh();
    }
  }

  // REVIEW: this.props.xxxx This method transfers state and shares values with other components
  // 获取token数量
  getCurrentWalletBalance = async () => {
    const { tokenContract, currentWallet } = this.state;
    const payload = {
      symbol: SYMBOL,
      owner: currentWallet.address || currentWallet
    };
    tokenContract.GetBalance.call(payload, (error, result) => {
      if (result) {
        const balance = result.balance || 0;
        this.setState({
          balance: +balance / ELF_DECIMAL,
          resourceReady: this.state.resourceReady + 1
        });
        this.props.getCurrentBalance(+balance / ELF_DECIMAL);
      }
    });
  };

  // 获取资源币数量
  getCurrentWalletResource = async () => {
    const { tokenContract, currentWallet } = this.state;
    const payloadRAM = {
      symbol: 'RAM',
      owner: currentWallet.address || currentWallet
    };
    tokenContract.GetBalance.call(payloadRAM, (error, result) => {
      if (result) {
        this.setState({
          RAM: +result.balance / ELF_DECIMAL,
          resourceReady: this.state.resourceReady + 1
        });
        this.props.getCurrentRam(+result.balance / ELF_DECIMAL);
      } else {
        this.setState({
          RAM: 0,
          resourceReady: this.state.resourceReady + 1
        });
      }
    });

    const payloadCPU = {
      symbol: 'CPU',
      owner: currentWallet.address || currentWallet
    };
    tokenContract.GetBalance.call(payloadCPU, (error, result) => {
      if (result) {
        this.setState({
          CPU: +result.balance / ELF_DECIMAL,
          resourceReady: this.state.resourceReady + 1
        });
        this.props.getCurrentCpu(+result.balance / ELF_DECIMAL);
      } else {
        this.setState({
          CPU: 0,
          resourceReady: this.state.resourceReady + 1
        });
      }
    });

    const payloadNET = {
      symbol: 'NET',
      owner: currentWallet.address || currentWallet
    };
    tokenContract.GetBalance.call(payloadNET, (error, result) => {
      if (result) {
        this.setState({
          NET: +result.balance / ELF_DECIMAL,
          resourceReady: this.state.resourceReady + 1
        });
        this.props.getCurrentNet(+result.balance / ELF_DECIMAL);
      } else {
        this.setState({
          NET: 0,
          resourceReady: this.state.resourceReady + 1
        });
      }
    });

    const payloadSTO = {
      symbol: 'STO',
      owner: currentWallet.address || currentWallet
    };
    tokenContract.GetBalance.call(payloadSTO, (error, result) => {
      if (result) {
        this.setState({
          STO: +result.balance / ELF_DECIMAL,
          resourceReady: this.state.resourceReady + 1
        });
        this.props.getCurrentSto(+result.balance / ELF_DECIMAL);
      } else {
        this.setState({
          STO: 0,
          resourceReady: this.state.resourceReady + 1
        });
      }
    });
  };

  componentWillUnmount() {
    this.state = {};
    this.setState = () => {};
  }

  accountListHTML() {
    const { currentWallet } = this.state;
    return (
      <Row key={currentWallet.name} className='list-col-padding'>
        <Col>
          <Col span={24}>
            <div className='current-name'>{currentWallet.name}</div>
          </Col>
        </Col>
      </Row>
    );
  }

  render() {
    const walltetHTML = this.accountListHTML();
    const { currentWallet, balance, RAM, CPU, NET, STO } = this.state;
    return (
      <div className='resource-wallet'>
        <div className='resource-wallet-head'>
          <div className='title'>{this.props.title}</div>
          <div
            className='refresh-button'
            onClick={() => this.props.onRefresh()}
          >
            <Svg
              className={this.state.loading ? 'refresh-animate' : ''}
              icon='refresh'
              style={{ width: '60px', height: '45px' }}
            />
          </div>
        </div>
        <div className='resource-wallet-body'>
          <Spin tip='loading....' size='large' spinning={this.state.loading}>
            <Row type='flex' align='middle'>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={6}
                xxl={6}
                className='list-border'
              >
                {walltetHTML}
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={18}
                xxl={18}
                style={{ paddingLeft: '1%' }}
              >
                <Row gutter={16} type='flex' align='middle'>
                  <Col span={19} style={{ marginTop: '10px' }}>
                    {/* todo:  */}
                    {/* Account balance: <span className='number' >{thousandsCommaWithDecimal(balance/ELF_DECIMAL)} {SYMBOL}</span> */}
                    Account balance:{' '}
                    <span className='number'>
                      {thousandsCommaWithDecimal(balance)} {SYMBOL}
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginTop: '20px' }} gutter={16}>
                  <Col
                    xs={12}
                    sm={12}
                    md={5}
                    lg={5}
                    xl={5}
                    xxl={5}
                    style={{ margin: '10px 0' }}
                  >
                    RAM quantity:{' '}
                    <span className='number'>
                      {thousandsCommaWithDecimal(RAM)}
                    </span>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={5}
                    lg={5}
                    xl={5}
                    xxl={5}
                    style={{ margin: '10px 0' }}
                  >
                    CPU quantity:{' '}
                    <span className='number'>
                      {thousandsCommaWithDecimal(CPU)}
                    </span>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={5}
                    lg={5}
                    xl={5}
                    xxl={5}
                    style={{ margin: '10px 0' }}
                  >
                    NET quantity:{' '}
                    <span className='number'>
                      {thousandsCommaWithDecimal(NET)}
                    </span>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={5}
                    lg={5}
                    xl={5}
                    xxl={5}
                    style={{ margin: '10px 0' }}
                  >
                    STO quantity:{' '}
                    <span className='number'>
                      {thousandsCommaWithDecimal(STO)}
                    </span>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={4}
                    lg={4}
                    xl={4}
                    xxl={4}
                    style={{ margin: '10px 0' }}
                  >
                    <Link to={'/resourceDetail/' + currentWallet.address}>
                      <span style={{ marginRight: '10px' }}>
                        Transaction details
                      </span>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Spin>
        </div>
      </div>
    );
  }
}
