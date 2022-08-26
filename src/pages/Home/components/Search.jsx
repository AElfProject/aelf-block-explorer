import { Button, Input, message, Select } from "antd";
import React, { useState } from "react";
import { useCallback } from "react";
import IconFont from "../../../components/IconFont";
import { get, isAElfAddress } from "../../../utils";
import { useMemo } from "react";
import { withRouter } from "react-router";
import {
  INPUT_STARTS_WITH_MINUS_TIP,
  INPUT_ZERO_TIP,
  TXS_BLOCK_API_URL,
} from "../../../constants";

const { Option } = Select;

function Search(props) {
  const [type, setType] = useState("all");
  const [value, setValue] = useState("");
  const { history } = props;

  const searchRules = useMemo(
    () => ({
      hash: async (value) => {
        const getTxsOption = {
          limit: 1,
          page: 0,
          block_hash: value,
        };

        const blockInfo = await get(TXS_BLOCK_API_URL, getTxsOption);
        const isBlock = blockInfo.transactions && blockInfo.transactions.length;
        searchRules[isBlock ? "block" : "transaction"](value);
      },
      address: (value) => {
        history.push(`/address/${value}`);
      },
      transaction: async (value) => {
        history.push(`/tx/${value}`);
      },
      block: (value) => {
        history.push(`/block/${value}`);
      },
      blockHeight: (value) => {
        history.push(`/block/${value}`);
      },
    }),
    []
  );

  const getInputType = useCallback((value) => {
    const isTxId = [64];
    if (isAElfAddress(value)) {
      return "address";
    }
    const length = value.length;

    if (isTxId.includes(length)) {
      return "hash";
    }
    return "blockHeight";
  }, []);

  const handleTypeChange = useCallback((val) => {
    setType(val);
  }, []);
  const handleInput = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  const handleSearch = useCallback(() => {
    let tempValue = value.trim();

    if (tempValue.indexOf("_") > 0) {
      tempValue = tempValue.split("_")[1];
    }
    // address.length === 38/66 && address.match(/^0x/)
    // search
    // 0. 0x
    // 1. transaction 66
    // 2. block   66
    // 3. address length=38
    if (`${tempValue}`.startsWith("-")) {
      message.error(INPUT_STARTS_WITH_MINUS_TIP);
      return;
    }
    if (+tempValue === 0) {
      message.error(INPUT_ZERO_TIP);
      return;
    }
    const searchType = type === "all" ? getInputType(tempValue) : type;

    searchRules[searchType](tempValue);
  }, [value]);

  return (
    <div className="new-search">
      <Select
        defaultValue="all"
        getPopupContainer={(node) => node.parentElement}
        onChange={handleTypeChange}
      >
        <Option value="all">All Filters</Option>
        <Option value="address">Address</Option>
        <Option value="transaction">Txn Hash</Option>
        <Option value="block">Block</Option>
        <Option value="blockHeight">Block Height</Option>
      </Select>
      <Input
        value={value}
        placeholder="Search by Address / Txn Hash / Block / Block Height"
        onChange={handleInput}
        onPressEnter={handleSearch}
      />
      <Button type="primary" onClick={handleSearch}>
        <IconFont type="Search" />
      </Button>
    </div>
  );
}

export default withRouter(Search);
