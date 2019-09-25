/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-25 15:55:24
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-25 16:11:03
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Checkbox, Row, Col, Modal } from 'antd';

import './index.less';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

export default class DividendModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false
    };
  }

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };

  render() {
    const { dividendModalVisible } = this.props;
    const { checkAll, indeterminate } = this.state;

    return (
      <Modal
        className='dividend-modal'
        title='Get Dividend'
        visible={true}
        // onOk={this.handleVoteConfirmOk}
        // confirmLoading={confirmLoading}
        // onCancel={this.handleCancel.bind(this, 'voteConfirmModalVisible')}
        width={860}
        centered
        maskClosable
        keyboard
      >
        <div style={{ borderBottom: '1px solid #E9E9E9', textAlign: 'right' }}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
          >
            Check all
          </Checkbox>
        </div>
        <Checkbox.Group style={{ width: '60%' }} onChange={this.onChange}>
          <Row>
            <Col span={12}>
              <Checkbox value='A'>A</Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value='A'>A</Checkbox>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Checkbox value='A'>A</Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value='A'>A</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Modal>
    );
  }
}
