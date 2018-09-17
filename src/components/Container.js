import React, { PureComponent } from "react";
import { Layout } from "antd";

import "./container.styles.less";

const { Content } = Layout;

export default class Container extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;
    return <Content className="body-container">{children}</Content>;
  }
}
