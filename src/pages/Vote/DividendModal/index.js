/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-25 15:55:24
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-07 21:22:37
 * @Description: file content
 */
import React, { PureComponent, Fragment } from 'react';
import { If, Then, Else } from 'react-if';
import { Spin, Row, Col, Modal, Button } from 'antd';

import { schemeIds } from '@config/config';
import './index.less';

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
      handleClaimDividendClick,
      loading
    } = this.props;

    return (
      <Modal
        className="dividend-modal"
        title="Get Dividend"
        visible={dividendModalVisible}
        onOk={() => {
          changeModalVisible('dividendModalVisible', false);
        }}
        // confirmLoading={confirmLoading}
        onCancel={() => {
          changeModalVisible('dividendModalVisible', false);
        }}
        okText="Get!"
        width={860}
        centered
        maskClosable
        keyboard
        footer={null}
      >
        <If condition={!!loading}>
          <Then>
            <Spin spinning={loading} />
          </Then>
          <Else>
            <Fragment>
              {dividends.amounts.map(item => {
                return (
                    <Row key={item.type} className="claim-profit-item">
                      <Col span={12} className="text-left">
                        <span className="profit-item-key">{item.type}: </span>
                        <span className="profit-item-value">
                  {item.amount.toFixed(2)}
                </span>
                      </Col>
                      <Col span={12} className="text-right">
                        <Button
                            disabled={item.amount <= 0}
                            type="primary"
                            shape="round"
                            onClick={() => {
                              handleClaimDividendClick(item.schemeId);
                            }}
                        >
                          Claim Profit
                        </Button>
                      </Col>
                    </Row>
                );
              })}
            </Fragment>
          </Else>
        </If>
      </Modal>
    );
  }
}
