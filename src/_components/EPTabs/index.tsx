import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useState } from 'react';
import './index.css';
import { useEffectOnce } from 'react-use';
export default function EPTabs({ items }: { items: TabsProps['items'] }) {
  const [activeKey, setActiveKey] = useState<string>('');
  useEffectOnce(() => {
    setActiveKey(window.location.hash.replace('#', ''));
  });

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
