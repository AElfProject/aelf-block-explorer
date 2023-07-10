import React from "react";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import Dividends from "../../../components/Dividends";
import IconFont from "../../../components/IconFont";
import useMobile from "../../../hooks/useMobile";
import { getFormattedDate } from "../../../utils/timeUtils";
import addressFormat, { hiddenAddress } from "../../../utils/addressFormat";

export default function LatestInfo({ blocks = [], transactions = [] }) {
  const isMobile = useMobile();
  return (
    <div className="latest-info">
      <div className="blocks">
        <div className="title">
          <h3>Latest Blocks</h3>
          {isMobile || (
            <Link to="/blocks">
              View All Blocks <IconFont type="right2" />
            </Link>
          )}
        </div>
        <div className="mobile-scroll">
          <div className="table-header">
            <p className="block">Block</p>
            <p className="age">Age</p>
            <p className="txns">Txns</p>
            <p className="reward">Reward</p>
          </div>
          <div className="table-body">
            {blocks.map((block, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={`${block.block_height}_${index}`} className="row">
                <p className="block">
                  <Link to={`/block/${block.block_height}`}>
                    {block.block_height}
                  </Link>
                </p>
                <p className="age">{getFormattedDate(block.time)}</p>
                <Link to={`/block/${block.block_height}#txns`} className="txns">
                  {block.tx_count}
                </Link>
                <div className="reward">
                  <Dividends
                    dividends={
                      typeof block.dividends === "string"
                        ? JSON.parse(block.dividends)
                        : block.dividends || {}
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="table-footer">
          {isMobile && (
            <Link to="/blocks">
              View All Blocks <IconFont type="right2" />
            </Link>
          )}
        </div>
      </div>
      <div className="transactions">
        <div className="title">
          <h3>Latest Transactions</h3>
          {isMobile || (
            <Link to="/txs">
              View All Txns <IconFont type="right2" />
            </Link>
          )}
        </div>
        <div className="mobile-scroll">
          <div className="table-header">
            <p className="hash">Txn Hash</p>
            <p className="from">From</p>
            <p className="to">To</p>
            <p className="age">Age</p>
          </div>
          <div className="table-body">
            {transactions.map((transaction) => {
              const fromHtml = (
                <Link
                  to={`/address/${addressFormat(transaction.address_from)}`}
                >
                  {addressFormat(hiddenAddress(transaction.address_from))}
                </Link>
              );
              const toHtml = (
                <Link to={`/address/${addressFormat(transaction.address_to)}`}>
                  {addressFormat(hiddenAddress(transaction.address_to))}
                </Link>
              );
              return (
                <div key={transaction.tx_id} className="row">
                  <p className="hash">
                    <Link to={`/tx/${transaction.tx_id}`}>
                      {transaction.tx_id}
                    </Link>
                  </p>
                  <p className="from">
                    {isMobile ? (
                      fromHtml
                    ) : (
                      <Tooltip
                        title={addressFormat(transaction.address_from)}
                        overlayClassName="table-item-tooltip__white"
                      >
                        {fromHtml}
                      </Tooltip>
                    )}
                  </p>
                  <p className="to">
                    {isMobile ? (
                      toHtml
                    ) : (
                      <Tooltip
                        title={addressFormat(transaction.address_to)}
                        overlayClassName="table-item-tooltip__white"
                      >
                        {toHtml}
                      </Tooltip>
                    )}
                  </p>
                  <p className="age">{getFormattedDate(transaction.time)}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="table-footer">
          {isMobile && (
            <Link to="/txs">
              View All Txns <IconFont type="right2" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
