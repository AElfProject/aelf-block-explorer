import React, { useEffect } from 'react';
import Link from 'next/link';
import Dividends from 'components/Dividends';
import IconFont from 'components/IconFont';
import { getFormattedDate } from 'utils/timeUtils';
import { BlockItem, TXItem } from '../types';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
interface PropsDto {
  blocks: BlockItem[];
  transactions: TXItem[];
  headers: any;
}
export default function LatestInfo({ blocks = [], transactions = [], headers }: PropsDto) {
  let isMobile = !!isPhoneCheckSSR(headers);
  useEffect(() => {
    isMobile = !!isPhoneCheck();
  }, []);

  return (
    <div className="latest-info">
      <div className="blocks">
        <div className="title">
          <h3>Latest Blocks</h3>
          {isMobile || (
            <Link href="/blocks">
              <>
                View All Blocks <IconFont type="right2" />
              </>
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
              <div key={`${block.block_height}_${index}`} className="row">
                <p className="block">
                  <Link href={`/block/${block.block_height}`}>{block.block_height}</Link>
                </p>
                <p className="age" suppressHydrationWarning>
                  {getFormattedDate(block.time)}
                </p>
                <Link href={`/block/${block.block_height}?tab=txns`} className="txns">
                  {block.tx_count}
                </Link>
                <div className="reward">
                  <Dividends
                    dividends={
                      typeof block.dividends === 'string' ? JSON.parse(block.dividends) : block.dividends || {}
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="table-footer">
          {isMobile && (
            <Link href="/blocks">
              <>
                View All Blocks <IconFont type="right2" />
              </>
            </Link>
          )}
        </div>
      </div>
      <div className="transactions">
        <div className="title">
          <h3>Latest Transactions</h3>
          {isMobile || (
            <Link href="/txs">
              <>
                View All Txns <IconFont type="right2" />
              </>
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
                  <Link href={`/tx/${transactions.tx_id}`}>{transactions.tx_id}</Link>
                </p>
                <p className="from">
                  <Link href={`/address/${transactions.address_from}`}>{transactions.address_from}</Link>
                </p>
                <p className="to">
                  <Link href={`/address/${transactions.address_to}`}>{transactions.address_to}</Link>
                </p>
                <p className="age" suppressHydrationWarning>
                  {getFormattedDate(transactions.time)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="table-footer">
          {isMobile && (
            <Link href="/txs">
              <>
                View All Txns <IconFont type="right2" />
              </>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
