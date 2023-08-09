import { ELF_REALTIME_PRICE_URL, HISTORY_PRICE } from "../constants";
import { get } from "../utils";

export default async function fetchPriceAndPrevious() {
  let price;
  let previousPrice;
  const d = new Date();
  await get(ELF_REALTIME_PRICE_URL, {
    fsym: "ELF",
    tsyms: "USD,BTC,CNY",
    force: true,
  }).then((res) => {
    price = res;
  });
  // set zh to keep correct date type
  await get(HISTORY_PRICE, {
    token_id: "aelf",
    vs_currencies: "usd",
    date:
      new Date(d.toLocaleDateString("zh")).valueOf() -
      d.getTimezoneOffset() * 60000 -
      24 * 3600 * 1000,
  }).then((res) => {
    if (!res?.message) {
      previousPrice = res;
    }
  });
  return {
    price,
    previousPrice,
  };
}
