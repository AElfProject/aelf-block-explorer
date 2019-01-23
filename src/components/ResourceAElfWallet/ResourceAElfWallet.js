/**
 * @file ResourceAElfWallet.js
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Radio} from 'antd';
import Button from '../../components/Button/Button';
import Svg from '../../components/Svg/Svg';
import {Link} from 'react-router-dom';
import './ResourceAElfWallet.less';
import getWallet from '../../utils/getWallet';
import getResource from '../../utils/getResource';
import getHexNumber from '../../utils/getHexNumber';
const RadioGroup = Radio.Group;

export default class ResourceAElfWallet extends PureComponent {
    constructor(props) {
        super(props);
        const walletInfoList = JSON.parse(localStorage.walletInfoList) || [];
        const currentWallet = JSON.parse(localStorage.currentWallet) || '';
        this.resource = null;
        this.wallet = null;
        if (currentWallet !== '') {
            this.wallet = getWallet(currentWallet.privateKey);
            this.resource = getResource(this.wallet);
        }
        this.state = {
            currentWallet,
            walletInfoList,
            voteContracts: this.props.voteContracts,
            resource: this.resource,
            wallet: this.wallet,
            balance: null,
            RAM: null,
            CPU: null,
            NET: null,
            STO: null
        };
    }

    componentDidMount() {
        const {currentWallet} = this.state;
        this.initializeWallet(currentWallet.address);
    }

    onChangeRadio(e) {
        const {walletInfoList} = this.state;
        walletInfoList.map(item => {
            if (e.target.value === item.privateKey) {
                this.setState({
                    currentWallet: item
                });
                this.initializeWallet(item.address);
                localStorage.setItem('currentWallet', JSON.stringify(item));
                this.props.getChangeWallet();
            }
        });
    }

    initializeWallet(address) {
        const {resource, voteContracts} = this.state;
        this.setState({
            balance: getHexNumber(voteContracts.tokenContract.BalanceOf(address).return).toLocaleString(),
            RAM: getHexNumber(resource.GetUserBalance(address, 'RAM').return) || '--.--',
            CPU: getHexNumber(resource.GetUserBalance(address, 'CPU').return) || '--.--',
            NET: getHexNumber(resource.GetUserBalance(address, 'NET').return) || '--.--',
            STO: getHexNumber(resource.GetUserBalance(address, 'STO').return) || '--.--'
        });
    }

    accountListHTML() {
        const {walletInfoList} = this.state;
        let walletHTMl = walletInfoList.map((item, index) =>
            <Row key={index} className='list-col-padding'>
                <Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={12} xxl={12}>
                        <Radio style={{marginLeft: '10px'}} value={item.privateKey} >
                            {item.walletName}
                        </Radio>
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={12} xxl={12} align='right'>
                        <Button title='Unbind'/>
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
                    <div className='button'>
                        <Button title='+ New Wallet' />
                    </div>
                </div>
                <div className='resource-wallet-body'>
                     <div className='refresh-button'>
                        <Svg
                            className={this.state.loading ? 'refresh-animate' : ''}
                            icon='refresh'
                            style={{width: '60px', height: '45px'}}
                        />
                    </div>
                    <Row type='flex' align='middle'>
                        <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6} className='list-border'>
                            <RadioGroup
                                value={currentWallet.privateKey}
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
                                    <Link to='/app/details/'>
                                        <span style={{marginRight: '10px'}}>Transaction details</span>
                                    </Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
