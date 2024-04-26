export default function DollarCurrencyRate({ price }: { price: number | string }) {
  return (
    <div className="ml-1 flex h-6 items-center rounded bg-ECEEF2 px-4">
      <span className="mr-1">$</span>
      {price}
    </div>
  );
}
