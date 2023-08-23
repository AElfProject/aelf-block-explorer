'use client';
import HeadTitle from '@_components/HeaderTitle';
import JumpButton, { JumpTypes } from '@_components/JumpButton';
import { useRouter } from 'next/navigation';
import './detail.css';
import { useCallback, useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import BaseInfo from './baseInfo';
import MoreContainer from '@_components/MoreContainer';
import ExtensionInfo from './ExtensionInfo';
import LogsContainer from '@_components/LogsContainer';
import { TxnSData } from '../type';
export default function Detail({ SSRData }: { SSRData: TxnSData }) {
  const router = useRouter();
  const [detailData] = useState(SSRData);
  const isFirst = detailData.previousTransactionHash === '';
  const isLast = detailData.nextTransactionHash === '';
  const jump = (type: JumpTypes) => {
    switch (type) {
      case JumpTypes.Prev:
        router.push(`/tx/${detailData.previousTransactionHash}`);
        break;
      case JumpTypes.Next:
        router.push(`/tx/${detailData.nextTransactionHash}`);
    }
  };
  const [showMore, setShowMore] = useState<boolean>(false);
  const moreChange = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);
  const items: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div className="overview-container">
          <BaseInfo data={detailData} />
          {showMore && <ExtensionInfo data={detailData} />}
          <MoreContainer diver={true} showMore={showMore} onChange={moreChange} />
        </div>
      ),
    },
    {
      key: 'logs',
      label: (
        <div>
          Logs<span className="ml-[2px]">({detailData.total})</span>
        </div>
      ),
      children: <LogsContainer Logs={detailData.logs} />,
    },
  ];
  const [activeKey, setActiveKey] = useState<string>(window && window.location.hash === '#logs' ? 'logs' : 'overview');

  const tabChange = (activeKey) => {
    if (activeKey === 'overview') {
      window.location.hash = '';
    } else {
      window.location.hash = 'logs';
    }
    setActiveKey(activeKey);
  };

  return (
    <div className="tx-detail-container">
      <HeadTitle content="Transactions Details">
        <JumpButton isFirst={isFirst} isLast={isLast} jump={jump} />
      </HeadTitle>
      <div className="detail-table">
        <Tabs defaultActiveKey={activeKey} activeKey={activeKey} items={items} onChange={tabChange} />
      </div>
    </div>
  );
}
