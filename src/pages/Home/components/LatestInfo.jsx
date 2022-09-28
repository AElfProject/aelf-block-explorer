import React from "react";
import { Link } from "react-router-dom";
import Dividends from "../../../components/Dividends";
import IconFont from "../../../components/IconFont";
import useMobile from "../../../hooks/useMobile";
import { getFormattedDate } from "../../../utils/timeUtils";

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
                <Link
                  to={`/block/${block.block_height}?tab=txns`}
                  className="txns"
                >
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
            {transactions.map((transactions) => (
              <div key={transactions.tx_id} className="row">
                <p className="hash">
                  <Link to={`/tx/${transactions.tx_id}`}>
                    {transactions.tx_id}
                  </Link>
                </p>
                <p className="from">
                  <Link to={`/address/${transactions.address_from}`}>
                    {transactions.address_from}
                  </Link>
                </p>
                <p className="to">
                  <Link to={`/contract/${transactions.address_to}`}>
                    {transactions.address_to}
                  </Link>
                </p>
                <p className="age">{getFormattedDate(transactions.time)}</p>
              </div>
            ))}
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
