import React, { PureComponent } from 'react';
import { Modal, Form, Input, Button, Table, Icon, message } from 'antd';
// import Highlighter from 'react-highlight-words';

import {
  SYMBOL,
  SELECT_SOMETHING_TIP,
  NEED_PLUGIN_AUTHORIZE_TIP,
  FEE_TIP
} from '@src/constants';

const { Search } = Input;

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
  // const { checkedGroup } = this.state;
  const { changeVoteState } = this.props;

  return [
    // {
    //   title: 'Rank',
    //   dataIndex: 'rank',
    //   key: 'rank'
    // },
    // todo: It seems that node name has already displayed in the Modal
    // {
    //   title: 'Node Name',
    //   dataIndex: 'name',
    //   key: 'nodeName',
    //   ...this.getColumnSearchProps('name'),
    //   render: (text, record) => (
    //     // todo: consider to extract the component as a independent component
    //     <Tooltip title={text}>
    //       <Link
    //         to={{
    //           pathname: '/vote/team',
    //           search: `pubkey=${record.candidate}`
    //         }}
    //         className='node-name-in-table'
    //         // style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
    //         style={{ width: 150 }}
    //         onClick={() => {
    //           changeVoteState({
    //             voteModalVisible: false
    //           });
    //         }}
    //       >
    //         {text}
    //       </Link>
    //     </Tooltip>
    //   )
    // },
    {
      title: 'Vote Amount',
      dataIndex: 'amount',
      key: 'voteAmount',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.amount - b.amount
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
    // {
    //   key: 'operations',
    //   render: (text, record, index) => (
    //     <div className='operation-group'>
    //       <Checkbox
    //         type='primary'
    //         checked={checkedGroup[index]}
    //         onChange={checked => {
    //           console.log('click checkbox');
    //           this.handleCheckboxChange(checked, index);
    //         }}
    //       />
    //     </div>
    //   )
    // }
  ];
}

class RedeemModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      // searchText: ''
    };

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
          type='primary'
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon='search'
          size='small'
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type='search' style={{ color: filtered ? '#1890ff' : undefined }} />
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
    // render: text => (
    //   <Highlighter
    //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //     searchWords={[this.state.searchText]}
    //     autoEscape
    //     textToHighlight={text.toString()}
    //   />
    // )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    // this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    // this.setState({ searchText: '' });
  };

  generateVoteRedeemForm() {
    const {
      nodeAddress,
      nodeName,
      redeemableVoteRecordsForOneCandidate,
      activeVoteRecordsForOneCandidate,
      currentWallet,
      // redeemVoteSelectedRowKeys,
      handleRedeemVoteSelectedRowChange
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
      // onChange: handleRedeemVoteSelectedRowChange,
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
          // todo: use iterator optimize
          render: <span className='form-item-value'>{nodeName}</span>
        },
        {
          label: 'Node Add',
          render: <span className='form-item-value'>{nodeAddress}</span>
        },
        {
          label: 'Active Vote',
          render: (
            <span className='form-item-value'>
              {activeVoteAmountForOneCandidate} {SYMBOL}
            </span>
          )
        },
        {
          label: 'Expired Vote',
          render: (
            <span className='form-item-value'>
              {redeemableVoteAmountForOneCandidate} {SYMBOL}
            </span>
          )
        },
        {
          label: 'Select Vote',
          render: (
            <div>
              {/* <Search
                placeholder='Input Node Name'
                onSearch={value => console.log(value)}
                style={{ width: 200 }}
              /> */}
              <Table
                dataSource={redeemableVoteRecordsForOneCandidate}
                columns={columns}
                pagination={pagination}
                rowKey={record => record.voteId.value}
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
            // validateTrigger: ['onBlur']
          }
        },
        // {
        //   label: '赎回数量',
        //   render: (
        //     <div>
        //       <Input
        //         suffix={SYMBOL}
        //         placeholder='Enter vote amount'
        //         style={{ marginRight: 20 }}
        //       />
        //       <Button type='primary'>Redeem All</Button>
        //     </div>
        //   )
        // },
        {
          label: 'Redeem To',
          render: (
            <span className='form-item-value'>
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
        className='vote-redeem-modal'
        title='Vote Redeem'
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
                  {/* todo: Optimize the judge */}
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
        <p className='tip-color' style={{ fontSize: 12 }}>
          {FEE_TIP}
        </p>
        <p style={{ marginTop: 10 }}>{NEED_PLUGIN_AUTHORIZE_TIP}</p>
      </Modal>
    );
  }
}

export default Form.create()(RedeemModal);
