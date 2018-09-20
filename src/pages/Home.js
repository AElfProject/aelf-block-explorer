import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Icon, List } from "antd";
import InfoList from "../components/InfoList";
import { get } from "../utils";
import { ALL_BLOCKS_API_URL, ALL_TXS_API_URL, PAGE_SIZE } from "../constants";

import "./home.styles.less";

export default class HomePage extends PureComponent {
  state = {
    blocksList: [],
    transactionsList: [],
    left_loading: false,
    right_loading: false
  };

  async componentDidMount() {
    const { blocks } = await this.fetch(ALL_BLOCKS_API_URL);
    const { transactions } = await this.fetch(ALL_TXS_API_URL);

    this.setState({
      blocksList: blocks,
      transactionsList: transactions
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

  renderItem = item => {
    const content = item.block_hash.slice(0, 17);
    return (
      <List.Item key={content}>
        <List.Item.Meta
          title={<a href="https://ant.design">{content}</a>}
          description={content}
        />
        <div>Content</div>
      </List.Item>
    );
  };

  render() {
    const { blocksList, transactionsList } = this.state;
    return (
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        className="content-container"
      >
        <Col span="11" className="container-list">
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
            renderItem={this.renderItem}
          />
        </Col>
        <Col span="11" className="container-list">
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
            renderItem={this.renderItem}
          />
        </Col>
      </Row>
    );
  }
}
