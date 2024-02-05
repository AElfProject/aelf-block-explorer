'use client';
import EPTabs from '@_components/EPTabs';
import HeadTitle from '@_components/HeaderTitle';
import { TabsProps } from 'antd';
import { useMemo } from 'react';
import Holders from './_components/Holders';
import OverView from './_components/Overview';
import Transfers from './_components/Transfers';

export default function Detail() {
  const items: TabsProps['items'] = useMemo(() => {
    return [
      {
        key: 'transfers',
        label: 'Transfers',
        children: <Transfers SSRData={{} as any} />,
      },
      {
        key: 'holders',
        label: 'Holders',
        children: <Holders SSRData={{} as any} />,
      },
    ];
  }, []);

  return (
    <div className="token-detail">
      <HeadTitle content="Token">
        <span>ELF</span>
        <span>{`(ELF)`}</span>
      </HeadTitle>

      <OverView />

      <div className="token-detail-table">
        <EPTabs items={items} selectKey="transfers" />
      </div>
    </div>
  );
}
