'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ITabsProps } from 'aelf-design';
import Overview from './_overview/OverView';
import EPTabs, { EPTabsRef } from '@_components/EPTabs';
import TransfersTable from './_transfers/Table';
import HoldersTable from './_holders/HoldersTable';
import Inventory from './_inventory/Inventory';
import ItemHoldersTable from './_holders/HoldersTable';
import { CollectionDetailData, CollectionTransfersData, URL_QUERY_KEY } from './type';
import { useEffect, useRef, useState } from 'react';

export interface NFTDetailsProps {
  overview: CollectionDetailData;
  transferList: CollectionTransfersData;
  search?: string;
}
function updateUrlParams(obj) {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  Object.keys(obj).forEach((key) => params.set(key, obj[key]));
  window.history.replaceState({}, '', `${window.location.pathname}?${params}${hash}`);
}

enum TabKey {
  balances = 'balances',
  empty = '',
  inventory = 'inventory',
}
const tabMap = {
  [TabKey.balances]: 'Holders',
  [TabKey.empty]: 'Transfers',
  [TabKey.inventory]: 'Inventory',
};
export default function NFTDetails(props: NFTDetailsProps) {
  const { overview, transferList } = props;
  console.log(overview, 'collection detail');
  const tabRef = useRef<EPTabsRef>(null);
  const [text, setSearchText] = useState<string>('');
  const [searchVal, setSearchVal] = useState<string>(props.search || '');

  // only trigger when onPress / onClear
  const handleSearchChange = (val) => {
    setSearchVal(val);
  };

  const unSearchItem = {
    key: TabKey.balances,
  };
  const tabItems: { key: string }[] = [
    {
      key: TabKey.empty,
    },
    unSearchItem,
    {
      key: TabKey.inventory,
    },
  ];
  const [tabList, setTabList] = useState(tabItems);
  const handlePressEnter = (val) => {
    if (val.trim()) {
      updateUrlParams({
        [URL_QUERY_KEY]: val.trim(),
      });
      const list = tabItems.slice(0);
      list.splice(1, 1);
      setTabList(list);
    }
  };
  const handleClear = () => {
    // setTabItemsList(tabItems);
    updateUrlParams({
      [URL_QUERY_KEY]: '',
    });
    setTabList(tabItems);
    setSearchVal('');
  };

  const handleTabChange = (key: string) => {
    window.location.hash = key;
  };
  const onChange = ({ currentTarget }) => {
    setSearchText(currentTarget.value);
    if (!currentTarget.value.trim()) {
      handleClear();
    }
  };
  const topSearchProps = {
    value: text,
    onChange,
    onSearchChange: handleSearchChange,
    onClear: handleClear,
    onPressEnter: handlePressEnter,
    placeholder: 'Filter Address / Txn Hash / Token Symbol',
  };

  // init tab active key, from url hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '').trim() ?? '';
    if (hash) {
      const tabItem = tabItems.find((item) => item.key === hash);
      if (tabItem) {
        tabRef.current?.setActiveKey(tabItem.key);
      }
    }
  }, []);
  // init search value from url query
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get(URL_QUERY_KEY);
    setSearchVal(query ?? '');
  }, []);
  const list = tabList.map((obj) => {
    const { key } = obj;
    let children = <div></div>;
    if (key === TabKey.empty) {
      children = <TransfersTable transferList={transferList} topSearchProps={topSearchProps} search={searchVal} />;
    } else if (key === TabKey.balances) {
      children = <HoldersTable topSearchProps={topSearchProps} search={searchVal} />;
    } else {
      children = <Inventory topSearchProps={topSearchProps} search={searchVal} />;
    }
    return {
      key,
      label: tabMap[key],
      children: children,
    };
  });
  return (
    <div>
      <Overview overview={overview} />
      <div className="collection-tab-wrap">
        <EPTabs items={list} ref={tabRef} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
