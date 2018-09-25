import React from "react";
import { Row, Col } from "antd";
import { get } from "../utils";
import { TXSSTATUS } from "../constants";

import "./txsdetail.styles.less";

const API_URL = "/block/transactions";

export default class TxsDetailPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {}

  render() {
    const { params } = this.props.match;
    const txsId = params.id;
    const status = TXSSTATUS["Mined"];

    return (
      <div className="block-detail-container">
        <div className="block-detail-panle">区块信息</div>
        <Row gutter={16} className="block-detail-body">
          <Col span={3}>交易哈希:</Col>
          <Col span={21}>{txsId}</Col>
          <Col span={3}>交易状态:</Col>
          <Col span={21}>{status}</Col>
          <Col span={3}>区块高度:</Col>
          <Col span={21}>5</Col>
          <Col span={3}>时间戳:</Col>
          <Col span={21}>205</Col>
          <Col span={3}>发送方:</Col>
          <Col span={21}>205</Col>
          <Col span={3}>接收方:</Col>
          <Col span={21}>205</Col>
          <Col span={3}>交易费:</Col>
          <Col span={21}>205</Col>
        </Row>
      </div>
    );
  }
}
