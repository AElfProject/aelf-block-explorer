import { numberFormatter } from '@_utils/formatter';
import { useState } from 'react';

export default function DollarCurrencyRate({ nowPrice, tradePrice }: { nowPrice: string; tradePrice: string }) {
  const [showNowPrice, setShowNowPrice] = useState(true);
  return (
    <div
      className="ml-1 flex h-6 cursor-pointer items-center rounded bg-ECEEF2 px-4"
      onClick={() => setShowNowPrice(!showNowPrice)}>
      <span className="mr-1">$</span>
      {showNowPrice ? numberFormatter(nowPrice) : numberFormatter(tradePrice)}
    </div>
  );
}
