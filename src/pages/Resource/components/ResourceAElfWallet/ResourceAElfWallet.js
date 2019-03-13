/**
 * @file ResourceAElfWallet.js
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Spin} from 'antd';
import Svg from '../../../../components/Svg/Svg';
import {Link} from 'react-router-dom';
import hexToArrayBuffer from '../../../../utils/hexToArrayBuffer';
import proto from 'protobufjs';
import './ResourceAElfWallet.less';

export default class ResourceAElfWallet extends PureComponent {
    constructor(props) {
        super(props);
        this.resource = null;
        this.wallet = null;
        this.state = {
            walletInfoList: this.props.walletInfoList || [],
            currentWallet: JSON.parse(localStorage.currentWallet),
            resourceContract: this.props.resourceContract,
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

    componentDidMount() {
        const {currentWallet, resourceContract, tokenContract} = this.state;
        if (currentWallet.length > 0) {
            this.props.onRefresh();
            this.getCurrentWalletBalance();
        }

        if (tokenContract) {
            this.props.onRefresh();
            this.getCurrentWalletBalance();
        }

        if (resourceContract) {
            this.getCurrentWalletResource();
        }
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

    // REVIEW: this.props.xxxx This method transfers state and shares values with other components

    getCurrentWalletBalance = async () => {
        const {tokenContract, currentWallet} = this.state;
        tokenContract.BalanceOf(currentWallet.address, (error, result) => {
            const balance = new proto.Reader(hexToArrayBuffer(result)).uint64();
            this.setState({
                balance: balance.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentBalance(balance);
        });
    }

    getCurrentWalletResource = async () => {
        const {resourceContract, currentWallet} = this.state;
        resourceContract.GetUserBalance(currentWallet.address, 'RAM', (error, result) => {
            const resource = new proto.Reader(hexToArrayBuffer(result)).uint64();
            this.setState({
                RAM: resource === 0 ? '--.--' : resource.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentRam(resource);
        });

        resourceContract.GetUserBalance(currentWallet.address, 'CPU', (error, result) => {
            const resource = new proto.Reader(hexToArrayBuffer(result)).uint64();
            this.setState({
                CPU: resource === 0 ? '--.--' : resource.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentCpu(resource);
        });

        resourceContract.GetUserBalance(currentWallet.address, 'NET', (error, result) => {
            const resource = new proto.Reader(hexToArrayBuffer(result)).uint64();
            this.setState({
                NET: resource === 0 ? '--.--' : resource.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentNet(resource);
        });

        resourceContract.GetUserBalance(currentWallet.address, 'STO', (error, result) => {
            const resource = new proto.Reader(hexToArrayBuffer(result)).uint64();
            this.setState({
                STO: resource === 0 ? '--.--' : resource.toLocaleString(),
                resourceReady: this.state.resourceReady + 1
            });
            this.props.getCurrentSto(resource);
        });
    }

    componentWillUnmount() {
        this.state = {};
        this.setState = () => {};
    }

    accountListHTML() {
        const {currentWallet} = this.state;
        return <Row key={currentWallet.name} className='list-col-padding'>
                    <Col>
                        <Col span={24} >
                            <div className='current-name'>
                                {currentWallet.name}
                            </div>
                        </Col>
                    </Col>
                </Row>;
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
                                {walltetHTML}
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
