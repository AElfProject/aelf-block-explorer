/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:47:40
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-09 20:47:33
 * @Description: pages for vote & election
 */
import React, { Component } from 'react';
import { Tabs, Modal, Radio, Form, Input, Select, Slider } from 'antd';

import ElectionNotification from './ElectionNotification/ElectionNotification';
import MyVote from './MyVote/MyVote';
import './Vote.style.less';

const { TabPane } = Tabs;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

const marks = {
  3: '3个月',
  6: '6个月',
  9: '9个月'
};

const formItems = [
  {
    label: '节点名称'
  },
  {
    label: '地址'
  },
  {
    label: '钱包'
  },
  {
    label: '可用票数'
  },
  {
    label: '投票数量'
  },
  {
    label: '锁定期',
    // render: (
    //   <Select placeholder='Please select a country'>
    //     <Option value='3'>3个月</Option>
    //     <Option value='6'>6个月</Option>
    //     <Option value='9'>9个月</Option>
    //   </Select>
    // )
    render: <Slider defaultValue={3} marks={marks} max={9} min={3} step={3}/>
  },
  {
    label: '预估投票收益'
  }
];

class VoteContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      voteFrom: 1
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      voteFrom: e.target.value
    });
  };

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    // this.setState({
    //   // ModalText: 'The modal will be closed after two seconds',
    //   // confirmLoading: true,
    // });
    setTimeout(() => {
      this.setState({
        visible: false
        // confirmLoading: false,
      });
    }, 2000);
  }

  handleCancel() {
    console.log('Clicked cancel button');
    this.setState({
      visible: false
    });
  }

  render() {
    const { visible, voteFrom } = this.state;

    // const { getFieldDecorator } = this.props.form;

    return (
      <section>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='节点公示' key='1'>
            <ElectionNotification />
          </TabPane>
          <TabPane tab='我的投票' key='2'>
            <MyVote></MyVote>
          </TabPane>
        </Tabs>

        <Modal
          title='节点投票'
          visible={visible}
          onOk={this.handleOk}
          // confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Radio.Group onChange={this.onChange} value={voteFrom}>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
          </Radio.Group>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            {formItems.map(item => {
              return (
                <Form.Item label={item.label} key={item.label}>
                  {/* {getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!'
                    },
                    {
                      required: true,
                      message: 'Please input your E-mail!'
                    }
                  ]
                })(<Input />)} */}
                  {item.render ? item.render : <Input></Input>}
                </Form.Item>
              );
            })}
          </Form>
        </Modal>
        <button onClick={this.showModal}>show modal</button>
      </section>
    );
  }
}

export default VoteContainer;
