import { TXS_BLOCK_API_URL } from "../constants";
import { get, isAElfAddress } from "../utils";
import addressFormat from "./addressFormat";

/* eslint-disable import/prefer-default-export */
export function getHandleSearch(navigate, value) {
  const searchRules = {
    hash: async (val) => {
      const getTxsOption = {
        limit: 1,
        page: 0,
        block_hash: val,
      };

      const blockInfo = await get(TXS_BLOCK_API_URL, getTxsOption);
      const isBlock = blockInfo.transactions && blockInfo.transactions.length;
      searchRules[isBlock ? "block" : "transaction"](val);
    },
    address: (val) => {
      navigate(`/address/${addressFormat(val)}`);
    },
    transaction: async (val) => {
      navigate(`/tx/${val}`);
    },
    block: (val) => {
      navigate(`/block/${val}`);
    },
    blockHeight: (val) => {
      navigate(`/block/${val}`);
    },
    invalid: () => {
      navigate(`/search-invalid/${value}`);
    },
  };

  const getInputType = (inputValue) => {
    const isTxId = [64];
    if (isAElfAddress(inputValue)) {
      return "address";
    }
    const { length } = inputValue;

    if (isTxId.includes(length)) {
      return "hash";
    }
    const number = parseInt(inputValue, 10).toString();
    if (number === inputValue) {
      return "blockHeight";
    }
    return "invalid";
  };

  const handleSearch = () => {
    let tempValue = value.trim();
    if (!tempValue) return;

    if (tempValue.indexOf("_") > 0) {
      [, tempValue] = tempValue.split("_");
    }
    // address.length === 38/66 && address.match(/^0x/)
    // search
    // 0. 0x
    // 1. transaction 66
    // 2. block   66
    // 3. address length=38
    if (`${tempValue}`.startsWith("-")) {
      navigate(`/search-invalid/${tempValue}`);
      return;
    }
    if (+tempValue === 0) {
      navigate(`/search-invalid/${tempValue}`);
      return;
    }
    const searchType = getInputType(tempValue);

    searchRules[searchType](tempValue);
  };
  return handleSearch;
}
