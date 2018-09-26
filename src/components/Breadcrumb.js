import React, { PureComponent } from "react";
import { Link, withRouter } from "react-router-dom";
import { Breadcrumb } from "antd";

import "./breadcrumb.styles.less";

const BREADCRUMBNAMEMAP = {
  "/blocks": "区块",
  "/block": "区块",
  "/txs": "交易",
  "/txs/block": "区块交易",
  "/adresses": "地址",
  "/block": "区块信息",
  "/tx": "交易信息",
  "/address": "地址信息"
};

const pageNameMap = {
  blocks: "区块",
  block: "区块",
  txs: "交易",
  tx: "交易详情",
  address: "地址"
};

class BrowserBreadcrumb extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { location } = this.props;
    const cls = location.pathname !== "/" ? "breadcrumb" : "breadcrumb hide";
    const pathSnippets = location.pathname.split("/").filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      // first route pathname determine last breadcrumb name
      const breadcrumbTitle =
        index + 1 < pathSnippets.length
          ? BREADCRUMBNAMEMAP[url]
          : BREADCRUMBNAMEMAP[`/${pathSnippets[0]}`];
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}> {breadcrumbTitle} </Link>
        </Breadcrumb.Item>
      );
    });
    const breadcrumbItems = [
      <Breadcrumb.Item key="/">
        <Link to="/"> Home </Link>
      </Breadcrumb.Item>
    ].concat(extraBreadcrumbItems);

    // route children limit to 2, so using pathSnippets[1] as condition
    const title = !!pathSnippets[1]
      ? [
          pageNameMap[pathSnippets[0]],
          <span className="breadcrumb-sub-title" key="breadcrumb-sub-title">
            #{pathSnippets[1]}
          </span>
        ]
      : pageNameMap[pathSnippets[0]];

    return (
      <div className={cls}>
        <h1 className="breadcrumb-title">{title}</h1>
        <Breadcrumb>{breadcrumbItems}</Breadcrumb>
      </div>
    );
  }
}

export default withRouter(BrowserBreadcrumb);
