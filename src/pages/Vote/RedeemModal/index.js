import React, { PureComponent } from 'react';
import { Modal, Form, Input, Button, Table } from 'antd';

import {
  SYMBOL,
  SELECT_SOMETHING_TIP,
  NEED_PLUGIN_AUTHORIZE_TIP,
  FEE_TIP
} from '@src/constants';
import {ELF_DECIMAL} from "../constants";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const pagination = {
  showQuickJumper: true,
  total: 0,
  showTotal: total => `Total ${total} items`,
  pageSize: 3
};

function getColumns() {
  return [
    {
      title: 'Vote Amount',
      dataIndex: 'amount',
      key: 'voteAmount',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.amount - b.amount,
      render: value => value / ELF_DECIMAL
    },
    {
      title: 'Lock Time',
      dataIndex: 'formatedLockTime',
      key: 'lockTime',
      sorter: (a, b) => a.lockTime - b.lockTime
    },
    {
      title: 'Vote Time',
      dataIndex: 'formatedVoteTime',
      key: 'voteTime',
      sorter: (a, b) => a.voteTimestamp.seconds - b.voteTimestamp.seconds
    }
  ];
}

class RedeemModal extends PureComponent {
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    }
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleReset = clearFilters => {
    clearFilters();
  };

  generateVoteRedeemForm() {
    const {
      nodeAddress,
      nodeName,
      redeemableVoteRecordsForOneCandidate,
      activeVoteRecordsForOneCandidate,
      currentWallet,
    } = this.props;
    const { getFieldValue, setFieldsValue } = this.props.form;

    const activeVoteAmountForOneCandidate = activeVoteRecordsForOneCandidate.reduce(
      (total, current) => total + +current.amount,
      0
    );

    const redeemableVoteAmountForOneCandidate = redeemableVoteRecordsForOneCandidate.reduce(
      (total, current) => total + +current.amount,
      0
    );

    const redeemVoteSelectedRowKeys = getFieldValue(
      'redeemVoteSelectedRowKeys'
    );

    const columns = getColumns.call(this);
    const rowSelection = {
      selectedRowKeys: redeemVoteSelectedRowKeys,
      onChange: value => {
        setFieldsValue({
          redeemVoteSelectedRowKeys: value
        });
      },
      hideDefaultSelections: true,
      type: 'radio'
    };

    return {
      formItems: [
        {
          label: 'Node Name',
          render: (
            <span className="form-item-value text-ellipsis">{nodeName}</span>
          )
        },
        {
          label: 'Node Add',
          render: (
            <span className="form-item-value text-ellipsis">
              {nodeAddress}
            </span>
          )
        },
        {
          label: 'Active Vote',
          render: (
            <span className="form-item-value">
              {activeVoteAmountForOneCandidate} {SYMBOL}
            </span>
          )
        },
        {
          label: 'Expired Vote',
          render: (
            <span className="form-item-value">
              {redeemableVoteAmountForOneCandidate} {SYMBOL}
            </span>
          )
        },
        {
          label: 'Select Vote',
          render: (
            <div>
              <Table
                dataSource={redeemableVoteRecordsForOneCandidate}
                columns={columns}
                pagination={pagination}
                rowKey={record => record.voteId}
                rowSelection={rowSelection}
              />
            </div>
          ),
          validator: {
            rules: [
              {
                required: true,
                message: SELECT_SOMETHING_TIP
              }
            ],
            fieldDecoratorid: 'redeemVoteSelectedRowKeys'
          }
        },
        {
          label: 'Redeem To',
          render: (
            <span className="form-item-value">
              {currentWallet && currentWallet.name}
            </span>
          )
        }
      ]
    };
  }

  handleOk() {
    const { handleRedeemConfirm, form, changeVoteState } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      const { redeemVoteSelectedRowKeys } = values;
      changeVoteState(
        { redeemVoteSelectedRowKeys: [redeemVoteSelectedRowKeys] },
        () => {
          handleRedeemConfirm();
        }
      );
    });
  }

  render() {
    const { voteRedeemModalVisible, handleCancel } = this.props;
    const { getFieldDecorator } = this.props.form;

    const voteRedeemForm = this.generateVoteRedeemForm();

    return (
      <Modal
        className="vote-redeem-modal"
        title="Vote Redeem"
        visible={voteRedeemModalVisible}
        onOk={this.handleOk}
        onCancel={handleCancel.bind(this, 'voteRedeemModalVisible')}
        width={960}
        centered
        maskClosable
        keyboard
        destroyOnClose
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          {voteRedeemForm.formItems &&
            voteRedeemForm.formItems.map(item => {
              return (
                <Form.Item label={item.label} key={item.label}>
                  {item.validator
                    ? getFieldDecorator(
                        item.validator.fieldDecoratorid,
                        item.validator
                      )(item.render || <Input />)
                    : item.render}
                </Form.Item>
              );
            })}
        </Form>
        <p className="tip-color" style={{ fontSize: 12 }}>
          {FEE_TIP}
        </p>
        <p style={{ marginTop: 10 }}>{NEED_PLUGIN_AUTHORIZE_TIP}</p>
      </Modal>
    );
  }
}

export default Form.create()(RedeemModal);
