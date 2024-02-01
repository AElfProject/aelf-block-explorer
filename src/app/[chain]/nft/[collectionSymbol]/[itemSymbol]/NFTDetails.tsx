'use client';
import Image from 'next/image';
import Link from 'next/link';
import { TabsProps } from 'antd';
import Overview from './_overview/OverView';
import EPTabs from '@_components/EPTabs';
import ItemActivityTable from './_itemActivity/ItemActivityTable';
// import ItemHoldersTable from './_holders/HoldersTable';
import { ItemSymbolDetailActivity, ItemSymbolDetailHolders, ItemSymbolDetailOverview } from './type';
import { useState } from 'react';

export interface NFTDetailsProps {
  activity: ItemSymbolDetailActivity,
  holder: ItemSymbolDetailHolders,
  overview: ItemSymbolDetailOverview,
}
const holders = 'Holders';
export default function NFTDetails(props: NFTDetailsProps) {
  const { activity, holder, overview } = props;
  const [selectKey, setSelectKey] = useState<string>('');
  const tabItems: TabsProps['items'] = [
    {
      key: '',
      label: 'Item Activity',
      children: <ItemActivityTable activeData={activity} />,
    },
    {
      key: holders,
      label: 'Holders',
      // children: <ItemHoldersTable holder={holder}/>,
      children: <div>123</div>,
    },
  ];
  const handleHolderClick = () => {
    setSelectKey(holders);
  }

  return (
    <div className="nft-wrap">
      <Overview overview={overview} onHolderClick={handleHolderClick}/>
      <div className="ntf-list-wrap">
        <EPTabs items={tabItems} selectKey={selectKey}/>
      </div>
    </div>
  );
}
