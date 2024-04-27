export default function DollarCurrency({ price }: { price: string }) {
  return (
    <div className="ml-1 flex h-6 cursor-pointer items-center rounded bg-ECEEF2 px-4">
      <span className="mr-1">${price}</span>
    </div>
  );
}
