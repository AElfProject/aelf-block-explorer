import React, { PureComponent } from "react";
import { Row, Col } from "antd";
import InfoList from "../components/InfoList";

import "./home.styles.less";

export default class HomePage extends PureComponent {
  render() {
    return (
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        className="content-container"
      >
        <Col span="12">
          <InfoList title="Blocks" iconType="gold" />
        </Col>
        <Col span="12">
          <InfoList title="Transaction" iconType="pay-circle" />
        </Col>
      </Row>
    );
  }
}
