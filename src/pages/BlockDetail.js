import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Icon } from "antd";
import { aelf, format } from "../utils";

import "./blockdetail.styles.less";

const ButtonGroup = Button.Group;

export default class BlockDetailPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      blockHeight: -1,
      txsCount: 0,
      blockHash: "",
      blockTime: 0
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { params } = props.match;
    const { blockHeight } = state;
    if (+params.id !== blockHeight) {
      return {
        blockHeight: +params.id
      };
    }
    return null;
  }

  fetchBlockInfo = blockHeight => {
    const { result } = aelf.chain.getBlockInfo(blockHeight, 0);
    this.setState({
      txsCount: result.Body.TransactionsCount,
      blockHash: result.Blockhash,
      blockTime: result.Header.Time
    });
  };

  componentDidMount() {
    const { params } = this.props.match;
    this.fetchBlockInfo(+params.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.blockHeight !== prevState.blockHeight) {
      this.fetchBlockInfo(this.state.blockHeight);
    }
  }

  render() {
    const { txsCount, blockHash, blockTime } = this.state;
    const { params } = this.props.match;
    const blockHeight = +params.id;
    const prevLink = `/block/${blockHeight - 1}`;
    const nextLink = `/block/${blockHeight + 1}`;

    return (
      <div className="block-detail-container">
        <div className="block-detail-panle">区块信息</div>
        <Row gutter={16} className="block-detail-body">
          <Col span={3}>区块高度:</Col>
          <Col span={21}>{blockHeight}</Col>
          <Col span={3}>交易数量:</Col>
          <Col span={21}>{txsCount}</Col>
          <Col span={3}>区块哈希:</Col>
          <Col span={21}>{blockHash}</Col>
          <Col span={3}>时间戳:</Col>
          <Col span={21}>{format(blockTime)}</Col>
        </Row>
        <ButtonGroup className="block-detail-footer">
          <Link className="ant-btn" to={prevLink}>
            <Icon type="left" />
            上一个
          </Link>
          <Link className="ant-btn" to={nextLink}>
            下一个
            <Icon type="right" />
          </Link>
        </ButtonGroup>
      </div>
    );
  }
}
