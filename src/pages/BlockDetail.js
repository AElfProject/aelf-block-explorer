import React from "react";
import { get } from "../utils";

import "./blockdetail.styles.less";

const API_URL = "/block/transactions";

export default class BlockDetail extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {}

  render() {
    return <div> detail </div>;
  }
}
