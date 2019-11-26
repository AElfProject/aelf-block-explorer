/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-25 15:55:24
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-11-06 13:30:00
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Checkbox, Row, Col, Modal, Button } from 'antd';

import { schemeIds } from '@pages/Vote/constants';
import './index.less';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

export default class DividendModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      indeterminate: false,
      checkAll: false
    };
  }

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < schemeIds.length,
      checkAll: checkedList.length === schemeIds.length
    });
  };

  onCheckAllChange = e => {
    const { dividends } = this.props;

    this.setState({
      checkedList: e.target.checked
        ? dividends.amounts.map(
            item => `${item.type}:    ${(+item.amount).toFixed(2)}`
          )
        : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };

  render() {
    const {
      dividendModalVisible,
      changeModalVisible,
      dividends,
      handleClaimDividendClick
    } = this.props;
    const { checkAll, indeterminate, checkedList } = this.state;
    console.log('dividends', dividends);

    return (
      <Modal
        className='dividend-modal'
        title='Get Dividend'
        visible={dividendModalVisible}
        onOk={() => {
          changeModalVisible('dividendModalVisible', false);
        }}
        // confirmLoading={confirmLoading}
        onCancel={() => {
          changeModalVisible('dividendModalVisible', false);
        }}
        okText='Get!'
        width={860}
        centered
        maskClosable
        keyboard
        footer={null}
      >
        {/* <div
          style={{
            borderBottom: '1px solid #E9E9E9',
            textAlign: 'right',
            marginBottom: 20,
            paddingBottom: 10
          }}
        >
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
          >
            Check all
          </Checkbox>
        </div>
        <Checkbox.Group
          style={{ width: '80%' }}
          onChange={this.onChange}
          value={checkedList}
          // todo: fix
          // options={dividends.amounts.map(
          //   item => `${item.type}:    ${(+item.amount).toFixed(2)}`
          // )}
        >
          <Row>
            {dividends.amounts.map(item => {
              console.log('item', item);
              return (
                <Col span={12} key={item.type}>
                  <Checkbox
                    value={`${item.type}${item.amount.toFixed(2)}`}
                    disabled={item.amount > 0 ? false : true}
                  >
                    {item.type}
                  </Checkbox>
                  ;
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group> */}
        <Row style={{ width: '80%', margin: '0 auto' }}>
          {dividends.amounts.map(item => {
            console.log('item', item);
            return (
              <Col className='claim-profit-item' span={12} key={item.type}>
                <Col span={12}>
                  <label>{`${item.type}: ${item.amount.toFixed(2)}`}</label>
                </Col>
                <Col span={12}>
                  <Button
                    disabled={item.amount > 0 ? false : true}
                    type='primary'
                    shape='round'
                    onClick={() => {
                      handleClaimDividendClick(item.schemeId);
                    }}
                    // style={{ width: 200 }}s
                  >
                    Claim Profit
                  </Button>
                </Col>
              </Col>
            );
          })}
        </Row>
      </Modal>
    );
  }
}
