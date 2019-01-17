/**
 * @file ResourceBuyModal
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col} from 'antd';
import getMenuName from '../../../../utils/getMenuName';
import './ResourceSellModal.less';

export default class ResourceSellModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuIndex: this.props.menuIndex,
            serviceCharge: 5,
            menuName: null
        };
    }

    componentDidMount() {
        const {menuIndex} = this.state;
        this.setState({
            menuName: getMenuName(menuIndex)
        });
    }

    render() {
        const {serviceCharge, menuName} = this.state;
        return (
            <div className='modal'>
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>地址信息</Col>
                        <Col span={16}>basdkasdjasjdalkjdlkajdladladkjald</Col>
                    </Row>
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>卖出{menuName}数量</Col>
                        <Col span={16}>1000</Col>
                    </Row>
                    <Row className='display-box'>
                        <Col span={8} style={{color: '#c8c7c7'}}>ELF</Col>
                        <Col span={16}>435</Col>
                    </Row>
                    <div className='service-charge'>
                        *手续费: {serviceCharge} ELF
                    </div>
                    <div className='modal-button' style={{background: '#cc2828'}}>Sell</div>
                    <div className='modal-tip'>
                        * To avoid price fluctuations leading to transaction failure, please
                        complete the transaction within 30 seconds.
                    </div>
            </div>
        );
    }
}