/*
 * @Author: aelf-lxy
 * @Date: 2023-08-09 20:35:48
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:01:27
 * @Description: filter condition
 */
import { Select } from 'antd';
import { useState, useEffect } from 'react';
import { TSearchValidator } from './type';

export default function SearchSelect({ searchValidator }: { searchValidator: TSearchValidator }) {
  const [selectValue, setSelectValue] = useState<number>(0);

  useEffect(() => {
    console.log(selectValue);
  }, [selectValue]);

  function selectChangeHandler(val) {
    setSelectValue(val);
  }

  if (Object.keys(searchValidator).length === 0) {
    return null;
  }
  return (
    <Select
      defaultValue={0}
      onChange={selectChangeHandler}
      bordered={false}
      style={{ width: 120 }}
      options={Object.entries(searchValidator).map(([k, v]) => ({ value: v.value, label: k }))}
    />
  );
}
