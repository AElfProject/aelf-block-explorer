import { numberFormatter } from '@_utils/formatter';

export default function DollarCurrencyRate({ nowPrice, tradePrice }: { nowPrice: string; tradePrice: string }) {
  return (
    <div className="ml-1 flex h-6 cursor-pointer items-center rounded bg-ECEEF2 px-4">
      <span className="mr-1">$</span>
      {numberFormatter(nowPrice, '')}
    </div>
  );
}
