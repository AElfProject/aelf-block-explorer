import React, { PureComponent } from "react";
import { Row, Col } from "antd";
import InfoList from "../components/InfoList";
import { get } from "../utils";
import { ALL_BLOCKS_API_URL, ALL_TXS_API_URL, PAGE_SIZE } from "../constants";

import "./home.styles.less";

export default class HomePage extends PureComponent {
  state = {
    blocksList: [],
    transactionsList: []
  };

  async componentDidMount() {
    const { blocks } = await get(ALL_BLOCKS_API_URL, {
      page: 0,
      limit: PAGE_SIZE,
      order: "desc"
    });
    const { transactions } = await get(ALL_TXS_API_URL, {
      page: 0,
      limit: PAGE_SIZE,
      order: "desc"
    });
    this.setState({
      blocksList: blocks,
      transactionsList: transactions
    });
  }

  render() {
    const { blocksList, transactionsList } = this.state;
    return (
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        className="content-container"
      >
        <Col span="12">
          <InfoList title="Blocks" iconType="gold" dataSource={blocksList} />
        </Col>
        <Col span="12">
          <InfoList
            title="Transaction"
            iconType="pay-circle"
            dataSource={transactionsList}
          />
        </Col>
      </Row>
    );
  }
}
