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
import { Button, Space, Tag } from 'antd';
import HeadTitle from '@_components/HeaderTitle';
import Table, { DataType } from '@_components/Table';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
export default function BlockList() {
  const { value } = useSelector((store: any) => store.counter);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(101);

  const pageChange = (page: number, pageSize?: number) => {
    console.log(page, pageSize, 'blocks');
    setCurrentPage(page);
  };

  const pageSizeChange = (size) => {
    console.log(size, 'size blocks');
    setPageSize(size);
  };
  return (
    <div>
      <HeadTitle content="Blocks"></HeadTitle>
      <Table
        titleType="multi"
        dataSource={data}
        columns={columns}
        rowKey="key"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
        multiTitle="A total of 344,256,109 transactions found"
        multiTitleDesc="(Showing blocks between #17785761 to #17785785)"></Table>
      <iconpark-icon name="question-circle"></iconpark-icon>
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
