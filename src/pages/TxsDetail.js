import React from "react";
import { Row, Col } from "antd";
import { isEmpty } from "lodash";
import { aelf } from "../utils";
import { TXSSTATUS } from "../constants";

import "./txsdetail.styles.less";

export default class TxsDetailPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      txsId: props.match.params.id || "",
      status: "Pending",
      blockHeight: -1,
      from: "",
      to: "",
      blockHash: ""
    };
  }

  fetchTxInfo = txsId => {
    if (isEmpty(txsId)) {
      return;
    }

    aelf.chain.connectChain(function(err, result) {
      console.log("connectChain: ", err, result);
    });

    const { result } = aelf.chain.getTxResult(txsId);
    this.setState({
      txsId,
      blockHash: result.block_hash,
      blockHeight: result.block_number,
      from: result.tx_info.From,
      to: result.tx_info.To,
      status: result.tx_status
    });
  };

  componentDidMount() {
    const { params } = this.props.match;
    this.fetchTxInfo(params.id);
  }

  render() {
    const { txsId, blockHash, blockHeight, from, to, status } = this.state;

    return (
      <div className="tx-detail-container">
        <div className="tx-detail-panle">区块信息</div>
        <Row gutter={16} className="tx-detail-body">
          <Col span={3}>交易哈希:</Col>
          <Col span={21}>{txsId}</Col>
          <Col span={3}>交易状态:</Col>
          <Col span={21}>{TXSSTATUS[status]}</Col>
          <Col span={3}>区块高度:</Col>
          <Col span={21}>{blockHeight}</Col>
          <Col span={3}>区块哈希:</Col>
          <Col span={21}>{blockHash}</Col>
          <Col span={3}>发送方:</Col>
          <Col span={21}>{from}</Col>
          <Col span={3}>接收方:</Col>
          <Col span={21}>{to}</Col>
          {/* <Col span={3}>交易费:</Col>
          <Col span={21}>205</Col> */}
        </Row>
      </div>
    );
  }
}
