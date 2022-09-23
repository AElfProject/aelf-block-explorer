import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useCallback } from 'react';
import IconFont from '../../../components/IconFont';
import { get, isAElfAddress } from '../../../utils/axios';
import { useMemo } from 'react';
import { TXS_BLOCK_API_URL } from '../../../constants';
import { withRouter } from 'next/router';

function Search(props) {
  const [value, setValue] = useState('');
  const navigate = props.router.push;

  const searchRules = useMemo(
    () => ({
      hash: async (val) => {
        const getTxsOption = {
          limit: 1,
          page: 0,
          block_hash: val,
        };

        const blockInfo = await get(TXS_BLOCK_API_URL, getTxsOption);
        const isBlock = blockInfo.transactions && blockInfo.transactions.length;
        searchRules[isBlock ? 'block' : 'transaction'](val);
      },
      address: (val) => {
        navigate(`/address/${val}`);
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
      invalid: (val) => {
        navigate(`/search-invalid/${value}`);
      },
    }),
    [value],
  );

  const getInputType = useCallback((value) => {
    const isTxId = [64];
    if (isAElfAddress(value)) {
      return 'address';
    }
    const length = value.length;

    if (isTxId.includes(length)) {
      return 'hash';
    }
    const number = parseInt(value, 10).toString();
    if (number === value) {
      return 'blockHeight';
    }
    return 'invalid';
  }, []);

  const handleInput = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  const handleSearch = useCallback(() => {
    let tempValue = value.trim();
    if (!tempValue) return;

    if (tempValue.indexOf('_') > 0) {
      tempValue = tempValue.split('_')[1];
    }
    // address.length === 38/66 && address.match(/^0x/)
    // search
    // 0. 0x
    // 1. transaction 66
    // 2. block   66
    // 3. address length=38
    if (`${tempValue}`.startsWith('-')) {
      location.href = '/search-invalid/' + tempValue;
      return;
    }
    if (+tempValue === 0) {
      location.href = '/search-invalid/' + tempValue;
      return;
    }
    const searchType = getInputType(tempValue);

    searchRules[searchType](tempValue);
  }, [value]);

  return (
    <div className="new-search">
      <Input
        value={value}
        placeholder="Search by Address / Txn Hash / Block"
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
