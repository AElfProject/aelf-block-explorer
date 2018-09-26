import React, { PureComponent } from "react";
import { Row, Col } from "antd";
import { get, post } from "../utils";
import { ELF_REALTIME_PRICE_URL, ELF_REST_TRADE_API } from "../constants";

import "./tradecards.style.less";

export default class TradeCards extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      price: {
        USD: -1,
        CNY: -1,
        BTC: -1
      }
    };
  }

  async componentDidMount() {
    const price = await get(ELF_REALTIME_PRICE_URL);
    const tradeResult = await get("http://localhost:3000/trade", {
      symbol: "elfbtc"
    });

    console.log(price, tradeResult);
  }
  render() {
    return <div className="tradecards-container"> TradeCards is work </div>;
  }
}
