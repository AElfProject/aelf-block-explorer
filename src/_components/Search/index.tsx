/*
 * @Author: aelf-lxy
 * @Date: 2023-08-03 14:20:36
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-10 15:36:02
 * @Description: Search component
 */
'use client';
import { Input } from 'antd';
// import request from '@_api';
import { useCallback, useMemo, useState } from 'react';

import { useDebounce } from 'react-use';
import Panel from './resultPanel';
import SearchSelect from './Select';
import { TSearchList, TSingle, TFormatSearchList, TSearchValidator } from './type';

const mock = {
  tokens: {
    total: 8,
    list: [
      {
        image: '',
        name: 'tokens-1111',
        symbol: 'tokens-symbol-1111',
        price: 100,
        unit: 'elf', //货币单位
      },
      {
        image: '',
        name: 'tokens-2222',
        symbol: 'tokens-symbol-2222',
        price: 100,
        unit: 'elf', //货币单位
      },
      {
        image: '',
        name: 'tokens-333',
        symbol: 'tokens-symbol-333',
        price: 100,
        unit: 'elf', //货币单位
      },
      {
        image: '',
        name: 'tokens-444',
        symbol: 'tokens-symbol-444',
        price: 100,
        unit: 'elf', //货币单位
      },
    ],
  },
  nfts: {
    total: 6,
    list: [
      {
        image: '',
        name: 'nfts-1111',
        symbol: 'nfts-symbol-1111',
        price: 0,
      },
      {
        image: '',
        name: 'nfts-2222',
        symbol: 'nfts-symbol-2222',
        price: 0,
      },
      {
        image: '',
        name: 'nfts-3333',
        symbol: 'nfts-symbol-3333',
        price: 0,
      },
      {
        image: '',
        name: 'nfts-4444',
        symbol: 'nfts-symbol-4444',
        price: 0,
      },
    ],
  },
  accounts: {
    total: 33,
    list: [
      {
        address: '3232332323dfdsafsasdjfkasld',
      },
      {
        address: '324sdf4r234234234we2342',
      },
      {
        address: '4235345dfgdfgfgwrwsf234',
      },
      {
        address: '423dfsdfsdfsfsdfsfwr32',
      },
      {
        address: '4234dfd45dfsdfdsfsdfs3434',
      },
      {
        address: '43dsfsadfasdfsa',
      },
      {
        address: '4234dfasfsad45dfsdfdsfsdfs3434',
      },
      {
        address: '2222222223232323',
      },
      {
        address: '4234dfd4444zs5dfsdfdsfsdfs3434',
      },
    ],
  },
  contracts: {
    total: 46,
    list: [
      {
        name: 'brdige',
        address: 'dfadsfasdfasfadsf0fsd90w4r90w3e0dsf9-0sadf',
      },
      {
        name: 'brdige',
        address: '45435sdfasfadsfasfasdfsa-0sadf',
      },
      {
        name: 'brdige',
        address: 'adfg33333333fafadsfasdfas-0sadf',
      },
      {
        name: 'brdige',
        address: 'gfdhgdfghhhhhhhhhhhdsagfads-0sadf',
      },
    ],
  },
};

const Search = ({ searchValidator }: { searchValidator: TSearchValidator }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchList, setSearchList] = useState<TSearchList>(mock);
  const [keywords, setKeywords] = useState<string | undefined>('');
  const formatData: TFormatSearchList = useMemo(() => {
    try {
      const arr: Partial<TSingle>[] = Object.values(searchList).reduce((acc, ele) => {
        return acc.concat(ele.list);
      }, [] as Partial<TSingle>[]);
      arr.forEach((ele, idx) => {
        ele.sortIdx = idx;
      });
      return {
        dataWithOrderIdx: searchList,
        allList: arr,
      };
    } catch (e) {
      throw new Error('format data error');
    }
  }, [searchList]);

  const setKeyWordFnHandler = useCallback((single: Partial<TSingle>) => {
    setKeywords(single.address || single.name);
  }, []);

  // function stopEventHandler(e: MouseEvent) {
  //   e.preventDefault();
  // }
  function resetEmptyHandler() {
    setKeywords('');
  }

  useDebounce(
    () => {
      if (!keywords) {
        return;
      }
      // function tmp(arr) {
      //   return {
      //     tokens: {
      //       total: 11,
      //       list: arr.slice(0, 5).map((ele) => ({ address: ele.description, name: ele.title })),
      //     },
      //     nfts: {
      //       total: 11,
      //       list: arr.slice(5, 10).map((ele) => ({ address: ele.description, name: ele.title })),
      //     },
      //   };
      // }
      // const fetchData = async () => {
      //   // await new Promise((resolve) => setTimeout(resolve, 1000));
      //   const { products } = await request.block.query({ params: { q: keywords } });

      //   setSearchList(tmp(products));
      // };
      // fetchData();
    },
    500,
    [keywords],
  );

  return (
    <div className="flex p-2 rounded-sm border">
      <SearchSelect searchValidator={searchValidator} />
      <div className="flex-1 relative">
        {/* <label>
          <input
            placeholder="Search by Address / Txn Hash / Block"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </label> */}
        <Input
          bordered={false}
          placeholder="Search by Address / Txn Hash / Block"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        {/* TODO: destroy Panel time? */}
        <Panel
          key={!keywords ? Math.random() : 1}
          query={keywords}
          // stopEvent={stopEventHandler}
          searchList={formatData}
          setKeyWordFn={setKeyWordFnHandler}
          resetEmpty={resetEmptyHandler}
        />
      </div>
    </div>
  );
};
export default Search;
