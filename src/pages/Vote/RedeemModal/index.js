import React, { PureComponent } from "react";
import { Modal, Form, Input, Button, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import {
  SYMBOL,
  SELECT_SOMETHING_TIP,
  NEED_PLUGIN_AUTHORIZE_TIP,
  FEE_TIP,
} from "@src/constants";
import { ELF_DECIMAL } from "../constants";
import TableLayer from "../../../components/TableLayer/TableLayer";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const pagination = {
  showQuickJumper: true,
  total: 0,
  showTotal: (total) => `Total ${total} items`,
  pageSize: 3,
  showSizeChanger: false,
};

function getColumns() {
  return [
    {
      title: "Vote Amount",
      dataIndex: "amount",
      key: "voteAmount",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.amount - b.amount,
      render: (value) => value / ELF_DECIMAL,
    },
    {
      title: "Lock Time",
      dataIndex: "formatedLockTime",
      key: "lockTime",
      sorter: (a, b) => a.lockTime - b.lockTime,
    },
    {
      title: "Vote Time",
      dataIndex: "formatedVoteTime",
      key: "voteTime",
      sorter: (a, b) => a.voteTimestamp.seconds - b.voteTimestamp.seconds,
    },
  ];
}

class RedeemModal extends PureComponent {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
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
          onClick={() => this.handleReset(clearFilters, confirm)}
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };

  generateVoteRedeemForm() {
    const {
      nodeAddress,
      nodeName,
      redeemableVoteRecordsForOneCandidate,
      activeVoteRecordsForOneCandidate,
      currentWallet,
    } = this.props;

    const activeVoteAmountForOneCandidate =
      activeVoteRecordsForOneCandidate.reduce(
        (total, current) => total + +current.amount,
        0
      );

    const redeemableVoteAmountForOneCandidate =
      redeemableVoteRecordsForOneCandidate.reduce(
        (total, current) => total + +current.amount,
        0
      );
    const redeemVoteSelectedRowKeys = this.formRef.current?.getFieldValue(
      "redeemVoteSelectedRowKeys"
    );

    const columns = getColumns.call(this);
    const rowSelection = {
      selectedRowKeys: redeemVoteSelectedRowKeys,
      onChange: (value) => {
        this.formRef.current?.setFieldsValue({
          redeemVoteSelectedRowKeys: value,
        });
      },
      hideDefaultSelections: true,
      type: "radio",
    };

    return {
      formItems: [
        {
          label: "Node Name",
          render: (
            <span className='form-item-value text-ellipsis'>{nodeName}</span>
          ),
        },
        {
          label: "Node Add",
          render: (
            <span className='form-item-value text-ellipsis'>{nodeAddress}</span>
          ),
        },
        {
          label: "Active Vote",
          render: (
            <span className='form-item-value'>
              {activeVoteAmountForOneCandidate} {SYMBOL}
            </span>
          ),
        },
        {
          label: "Expired Vote",
          render: (
            <span className='form-item-value'>
              {redeemableVoteAmountForOneCandidate} {SYMBOL}
            </span>
          ),
        },
        {
          label: "Select Vote",
          render: (
            <TableLayer>
              <Table
                showSorterTooltip={false}
                dataSource={redeemableVoteRecordsForOneCandidate}
                columns={columns}
                pagination={pagination}
                rowKey={(record) => record.voteId}
                rowSelection={rowSelection}
              />
            </TableLayer>
          ),
          validator: {
            rules: [
              {
                required: true,
                message: SELECT_SOMETHING_TIP,
              },
            ],
            fieldDecoratorid: "redeemVoteSelectedRowKeys",
          },
        },
        {
          label: "Redeem To",
          render: (
            <span className='form-item-value'>
              {currentWallet && currentWallet.name}
            </span>
          ),
        },
      ],
    };
  }

  handleOk() {
    const {
      handleRedeemConfirm,
      form,
      changeVoteState,
      setRedeemConfirmLoading,
    } = this.props;

    setRedeemConfirmLoading(true);

    setTimeout(() => {
      // For old wallet app. We can not receive close event
      setRedeemConfirmLoading(false);
    }, 60 * 1000);

    form.validateFields((err, values) => {
      if (err) {
        setRedeemConfirmLoading(false);
        return;
      }
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
    const { voteRedeemModalVisible, handleCancel, redeemConfirmLoading } =
      this.props;

    const voteRedeemForm = this.generateVoteRedeemForm();

    return (
      <Modal
        className='vote-redeem-modal'
        title='Vote Redeem'
        visible={voteRedeemModalVisible}
        onOk={this.handleOk}
        confirmLoading={redeemConfirmLoading}
        onCancel={handleCancel.bind(this, "voteRedeemModalVisible")}
        width={960}
        centered
        maskClosable
        keyboard
        destroyOnClose
      >
        <Form
          ref={this.formRef}
          {...formItemLayout}
          onSubmit={this.handleSubmit}
        >
          {voteRedeemForm.formItems &&
            voteRedeemForm.formItems.map((item) => (
              <Form.Item
                label={item.label}
                key={item.label}
                name={item.validator?.fieldDecoratorId}
                ruels={item.validator?.rules}
                initialValue={item.validator?.initialValue}
                validateTrigger={item.validator?.validateTrigger}
              >
                (
                {item.validator ? (
                  <span>{item.render}</span> || <Input />
                ) : (
                  <span>{item.render}</span>
                )}
                )
              </Form.Item>
            ))}
        </Form>
        <p className='tip-color' style={{ fontSize: 12 }}>
          {FEE_TIP}
        </p>
        <p style={{ marginTop: 10 }}>{NEED_PLUGIN_AUTHORIZE_TIP}</p>
      </Modal>
    );
  }
}

export default RedeemModal;
