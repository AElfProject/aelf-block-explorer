import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Icon, List } from "antd";
import { get as _get } from "lodash/get";
import InfoList from "../components/InfoList";
import TradeCards from "../components/TradeCards";
import TradeChart from "../components/TradeChart";
import { get, format, aelf } from "../utils";
import {
  ALL_BLOCKS_API_URL,
  ALL_TXS_API_URL,
  PAGE_SIZE,
  TXSSTATUS
} from "../constants";

import "./home.styles.less";

export default class HomePage extends Component {
  loopId = 0;

  state = {
    blocksList: [],
    transactionsList: []
  };

  componentDidCatch(error) {
    console.error(error);
    clearInterval(this.loopId);
  }

  async componentDidMount() {
    // it's making two xhr to get realtime block_height and transaction data.
    // it's simplest that it do not need block_scan_api to get full chain data.
    // but it need a some sugar.
    const { blocks } = await this.fetch(ALL_BLOCKS_API_URL);
    const { transactions } = await this.fetch(ALL_TXS_API_URL);

    this.setState({
      blocksList: blocks,
      transactionsList: transactions
    });

    // this.loopId = setInterval(() => {
    //   this.fetchChain();
    // }, 5000);
    this.fetchChain();
  }

  // @TODO: take it work. gettting block info and transactions from chain.
  fetchChain() {
    const { blocksList, transactions } = this.state;
    const {
      result: { block_height }
    } = aelf.chain.getBlockHeight();
    const {
      result: { Blockhash, Body, Header }
    } = aelf.chain.getBlockInfo(block_height, 100);

    const chainBlocks = {
      block_hash: Blockhash,
      block_height,
      chain_id: Header.ChainId,
      merkle_root_state: Header.MerkleTreeRootOfWorldState,
      merkle_root_tx: Header.MerkleTreeRootOfTransactions,
      pre_block_hash: Header.PreviousBlockHash,
      time: Header.Time,
      tx_count: Body.TransactionsCount
    };

    if (block_height === blocksList[0].block_height) {
      return;
    }

    this.setState({
      blocksList: [chainBlocks, ...blocksList]
    });
  }

  async fetch(url) {
    const res = await get(url, {
      page: 0,
      limit: PAGE_SIZE,
      order: "desc"
    });

    return res;
  }

  blockRenderItem = item => {
    const blockHeight = item.block_height;
    const title = (
      <span>
        区块: <Link to={`/block/${blockHeight}`}>{blockHeight}</Link>
      </span>
    );
    const desc = (
      <span className="infoList-desc">
        交易数:
        <Link to={`/txs/block?${item.block_hash}`}>{item.tx_count}</Link>
      </span>
    );
    return (
      <List.Item key={blockHeight}>
        <List.Item.Meta title={title} description={desc} />
        <div>{format(item.time)}</div>
      </List.Item>
    );
  };

  txsRenderItem = item => {
    const blockHeight = item.block_height;
    const title = (
      <span>
        交易:
        <Link to={`/block/${item.block_height}`}>
          {item.tx_id.slice(0, 20)}
          ...
        </Link>
      </span>
    );
    const desc = (
      <span className="infoList-desc">
        发送方:
        <Link to={`/address/${item.address_from}`}>
          {item.address_from.slice(0, 6)}
          ...
        </Link>
        接收方:
        <Link to={`/address/${item.address_to}`}>
          {item.address_to.slice(0, 6)}
          ...
        </Link>
      </span>
    );
    return (
      <List.Item key={blockHeight}>
        <List.Item.Meta title={title} description={desc} />
        <div>交易状态: {TXSSTATUS[item.tx_status]}</div>
      </List.Item>
    );
  };

  render() {
    const { blocksList, transactionsList } = this.state;
    return [
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        className="content-container"
        key="tradeinfo"
        gutter={16}
      >
        <Col span="12">
          <TradeCards key="tradecards" />
        </Col>
        <Col span="12">
          <TradeChart key="tradechart" />
        </Col>
      </Row>,
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        className="content-container"
        key="infolist"
        gutter={16}
      >
        <Col span="12" className="container-list">
          <div className="panel-heading">
            <h2 className="panel-title">
              <Icon type="gold" className="anticon" />
              区块
            </h2>
            <Link to="/blocks" className="pannel-btn">
              查看全部
            </Link>
          </div>
          <InfoList
            title="Blocks"
            iconType="gold"
            dataSource={blocksList}
            renderItem={this.blockRenderItem}
          />
        </Col>
        <Col span="12" className="container-list">
          <div className="panel-heading">
            <h2 className="panel-title">
              <Icon type="gold" className="anticon" />
              交易
            </h2>
            <Link to="/txs" className="pannel-btn">
              查看全部
            </Link>
          </div>
          <InfoList
            title="Transaction"
            iconType="pay-circle"
            dataSource={transactionsList}
            renderItem={this.txsRenderItem}
          />
        </Col>
      </Row>
    ];
  }
}
