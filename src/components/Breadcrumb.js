import React, { PureComponent } from "react";
import { Link, withRouter } from "react-router-dom";
import { Breadcrumb } from "antd";

import "./breadcrumb.styles.less";

const breadcrumbNameMap = {
  "/blocks": "区块",
  "/txs": "交易"
};

const pageNameMap = {
  "/blocks": "区块",
  "/txs": "交易"
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
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}> {breadcrumbNameMap[url]} </Link>
        </Breadcrumb.Item>
      );
    });
    const breadcrumbItems = [
      <Breadcrumb.Item key="/">
        <Link to="/"> Home </Link>
      </Breadcrumb.Item>
    ].concat(extraBreadcrumbItems);

    return (
      <div className={cls}>
        <h1 className="breadcrumb-title">{pageNameMap[location.pathname]}</h1>
        <Breadcrumb>{breadcrumbItems}</Breadcrumb>
      </div>
    );
  }
}

export default withRouter(BrowserBreadcrumb);
