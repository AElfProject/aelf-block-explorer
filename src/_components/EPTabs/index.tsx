import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import './index.css';
import { useEffectOnce } from 'react-use';
export default function EPTabs({ items, selectKey }: { selectKey?: string; items: TabsProps['items'] }) {
  const [activeKey, setActiveKey] = useState<string>('');
  useEffectOnce(() => {
    setActiveKey(window.location.hash.replace('#', ''));
  });

  useEffect(() => {
    if (!selectKey) return;
    window.location.hash = selectKey as string;
    setActiveKey(selectKey as string);
  }, [selectKey]);

  const tabChange = (activeKey) => {
    if (activeKey === '') {
      window.location.hash = '';
    } else {
      window.location.hash = activeKey;
    }
    setActiveKey(activeKey);
  };
  return (
    <div className="tab-container">
      <Tabs defaultActiveKey={activeKey} activeKey={activeKey} items={items} onChange={tabChange} />
    </div>
  );
}
