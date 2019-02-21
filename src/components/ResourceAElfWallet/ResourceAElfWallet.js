/**
 * @file ResourceAElfWallet.js
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Radio, Spin} from 'antd';
import Svg from '../../components/Svg/Svg';
import {Link} from 'react-router-dom';
import './ResourceAElfWallet.less';
import getHexNumber from '../../utils/getHexNumber';
const RadioGroup = Radio.Group;

export default class ResourceAElfWallet extends PureComponent {
    constructor(props) {
        super(props);
        this.resource = null;
        this.wallet = null;
        this.state = {
            walletInfoList: this.props.walletInfoList || [],
            currentWallet: JSON.parse(localStorage.currentWallet),
            resourceContract: null,
            tokenContract: null,
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
        if (props.resourceContract !== state.resourceContract) {
            return {
                resourceContract: props.resourceContract
            };
        }

        if (props.tokenContract !== state.tokenContract) {
            return {
                tokenContract: props.tokenContract
            };
        }

        if (props.loading !== state.loading) {
            return {
                loading: props.loading
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.resourceContract !== this.props.resourceContract) {
            this.props.onRefresh();
            this.getCurrentWalletResource();
        }

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
            const {resourceContract, tokenContract, currentWallet} = this.state;
            if (resourceContract && tokenContract && currentWallet) {
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

    getCurrentWalletBalance = async () => {
        const {tokenContract, currentWallet} = this.state;
        tokenContract.BalanceOf(currentWallet.address, (error, result) => {
            this.setState({
                balance: getHexNumber(result.return).toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentBalance(getHexNumber(result.return));
        });
    }

    getCurrentWalletResource = async () => {
        const {resourceContract, currentWallet} = this.state;
        resourceContract.GetUserBalance(currentWallet.address, 'RAM', (error, result) => {
            let resource = getHexNumber(result.return);
            this.setState({
                RAM: resource === 0 ? '--.--' : resource.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentRam(resource);
        });

        resourceContract.GetUserBalance(currentWallet.address, 'CPU', (error, result) => {
            let resource = getHexNumber(result.return);
            this.setState({
                CPU: resource === 0 ? '--.--' : resource.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentCpu(resource);
        });

        resourceContract.GetUserBalance(currentWallet.address, 'NET', (error, result) => {
            let resource = getHexNumber(result.return);
            this.setState({
                NET: resource === 0 ? '--.--' : resource.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentNet(resource);
        });

        resourceContract.GetUserBalance(currentWallet.address, 'STO', (error, result) => {
            let resource = getHexNumber(result.return);
            this.setState({
                STO: resource === 0 ? '--.--' : resource.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentSto(resource);
        });
    }

    onChangeRadio(e) {
        const {walletInfoList} = this.state;
        walletInfoList.map(item => {
            if (e.target.value === item.address) {
                this.setState({
                    currentWallet: item
                });
                // this.initializeWallet(item.address);
                localStorage.setItem('currentWallet', JSON.stringify(item));
                this.props.getChangeWallet();
            }
        });
    }

    componentWillUnmount() {
        this.state = {};
        this.setState = () => {};
    }

    accountListHTML() {
        const {walletInfoList} = this.state;
        let walletHTMl = walletInfoList.map((item, index) =>
            <Row key={index} className='list-col-padding'>
                <Col>
                    <Col span={24} >
                        <Radio style={{marginLeft: '10px'}} value={item.address} >
                            {item.name}
                        </Radio>
                    </Col>
                </Col>
            </Row>
        );

        return walletHTMl;
    }

    render() {
        const walltetHTML = this.accountListHTML();
        const {currentWallet, balance, RAM, CPU, NET, STO} = this.state;
        return (
            <div className='resource-wallet'>
                <div className='resource-wallet-head'>
                    <div className='title'>
                        {this.props.title}
                    </div>
                </div>
                <div className='resource-wallet-body'>
                    <Spin
                        tip='loading....'
                        size='large'
                        spinning={this.state.loading}
                    >
                        <div className='refresh-button' onClick={() => this.props.onRefresh()}>
                            <Svg
                                className={this.state.loading ? 'refresh-animate' : ''}
                                icon='refresh'
                                style={{width: '60px', height: '45px'}}
                            />
                        </div>
                        <Row type='flex' align='middle'>
                            <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6} className='list-border'>
                                <RadioGroup
                                    value={currentWallet.address}
                                    onChange={this.onChangeRadio.bind(this)}
                                >
                                    {walltetHTML}
                                </RadioGroup>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={18} style={{paddingLeft: '1%'}}>
                                <Row gutter={16} type='flex' align='middle'>
                                    <Col span={19} style={{marginTop: '10px'}}>
                                        Account balance: <span className='number' >{balance} ELF</span>
                                    </Col>
                                </Row>
                                <Row style={{marginTop: '20px'}} gutter={16}>
                                    <Col
                                        xs={12} sm={12} md={5}
                                        lg={5} xl={5} xxl={5}
                                        style={{margin: '10px 0'}}
                                    >
                                        RAM quantity: <span className='number'>{RAM}</span>
                                    </Col>
                                    <Col
                                        xs={12} sm={12} md={5}
                                        lg={5} xl={5} xxl={5}
                                        style={{margin: '10px 0'}}
                                    >
                                        CPU quantity: <span className='number'>{CPU}</span>
                                    </Col>
                                    <Col
                                        xs={12} sm={12} md={5}
                                        lg={5} xl={5} xxl={5}
                                        style={{margin: '10px 0'}}
                                    >
                                        NET quantity: <span className='number'>{NET}</span>
                                    </Col>
                                    <Col
                                        xs={12} sm={12} md={5}
                                        lg={5} xl={5} xxl={5}
                                        style={{margin: '10px 0'}}
                                    >
                                        STO quantity: <span className='number'>{STO}</span>
                                    </Col>
                                    <Col
                                        xs={12} sm={12} md={4}
                                        lg={4} xl={4} xxl={4}
                                        style={{margin: '10px 0'}}
                                    >
                                        <Link to={'/resourceDetail/' + currentWallet.address}>
                                            <span style={{marginRight: '10px'}}>Transaction details</span>
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
