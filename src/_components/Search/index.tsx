/*
 * @Author: aelf-lxy
 * @Date: 2023-08-03 14:20:36
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-04 14:42:35
 * @Description: Search component
 */
'use client';
import { Select } from 'antd';
import request from '@_api';
import { useState } from 'react';
import { SelectProps } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';
let idx = 0;

const Search = () => {
  const [searchList, setSearchList] = useState<any>([]);
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);
  const [keywords, setKeywords] = useState<string>();

  const handleChange = (val: string) => {
    setKeywords(val);
  };

  const cb = (list) => {
    return new Array(1).fill({
      label: 'dd',
      options: list.map((item: any) => ({
        value: item.id,
        label: <div key={item.id}>{item.title}</div>,
      })),
    });
  };

  const [count, setCount] = useState(0);
  useHotkeys('up', () => setCount((prevCount) => prevCount + 1));
  useHotkeys('down', () => setCount((prevCount) => prevCount - 1));

  const handleSearch = (val: string) => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { products } = await request.block.query({ params: { q: val } });
      setSearchList(products);
      setOptions(cb(products));
    };
    fetchData();
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 38) {
      idx--;
      idx = idx < 0 ? searchList.length - 1 : idx;
    } else if (e.keyCode === 40) {
      idx++;
      idx = idx > searchList.length - 1 ? 0 : idx;
    }
    console.log(idx, searchList[idx]?.title);
  };

  return (
    <>
      <p>{count}</p>
      <Select
        loading={true}
        showSearch
        style={{ width: 300 }}
        value={keywords}
        onChange={handleChange}
        onSearch={handleSearch}
        onInputKeyDown={handleKeyDown}
        placeholder="Search by Address / Txn Hash / Block"
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        notFoundContent={null}
        dropdownRender={(menu) => (
          <>
            <div>custom</div>
            {menu}
          </>
        )}
        options={options}
      />
    </>
  );
};
export default Search;
