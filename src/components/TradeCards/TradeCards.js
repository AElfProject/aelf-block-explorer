import React, { Component } from 'react';
// import isEmpty from "lodash/isEmpty";
import { get } from '../../utils';
import { ELF_REALTIME_PRICE_URL } from '../../constants';

import './tradecards.style.less';

export default class TradeCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: {
        USD: '-',
        CNY: '-',
        BTC: '-',
      },
      tick: {
        vol: 0,
        open: 0,
        close: 0,
        count: 0,
        low: 0,
        high: 0,
      },
    };
  }

  async componentDidMount() {
    const price = await get(ELF_REALTIME_PRICE_URL);
    try {
      //   const detail = await get("/market/detail", {
      //     symbol: "elfbtc"
      //   });
      //   const tick = isEmpty(detail) ? { vol: 0 } : detail.tick;

      this.setState({
        price,
        // tick
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { price, tick } = this.state;
    return (
      <div className="tradecards-container">
        <div className="tradecard">
          <h2 />
          <ul className="card-left">
            <li className="card-left-title">
              ￥
              {price.CNY}
            </li>
            <li className="card-left-desc">
              <span>
                ≈$
                {price.USD}
              </span>
              <span>
                ≈
                {price.BTC}
                BTC
              </span>
            </li>
            {/* <li className="card-left-desc">
                        开盘价: <span>{tick.open} BTC</span>
                        </li>
                        <li className="card-left-desc">
                        24H累计成交数: <span>{tick.count}</span>
                        </li> */}
          </ul>
          {/* <ul className="card-right">
                        <li>
                        24H 最高 <span>{tick.high} BTC</span>
                        </li>
                        <li>
                        24H 最低 <span>{tick.low} BTC</span>
                        </li>
                        <li>
                        当前价: <span>{tick.open} BTC</span>
                        </li>
                        <li>
                        24H累计成交额: <span>{tick.vol.toFixed(6)} BTC</span>
                        </li>
                    </ul> */}
        </div>
      </div>
    );
  }
}
