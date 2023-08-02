/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 11:05:51
 * @Description: BlockList
 */
'use client';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '@_store/features/counterSlice';
import { Button } from 'antd';
export default function BlockList() {
  const { value } = useSelector((store: any) => store.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <p>{value}</p>
      <Button
        onClick={() => {
          dispatch(increment());
        }}>
        加
      </Button>
      <Button
        onClick={() => {
          dispatch(decrement());
        }}>
        减
      </Button>
    </div>
  );
}
