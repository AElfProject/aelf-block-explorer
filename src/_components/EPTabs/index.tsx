import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import './index.css';
import { useEffectOnce } from 'react-use';

export interface EPTabsRef {
  setActiveKey: (key: string) => void;
}

const EPTabs = forwardRef<EPTabsRef, { selectKey?: string; items: TabsProps['items'] }>(
  ({ items, selectKey }, ref) => {
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

    useImperativeHandle(ref, () => ({
      setActiveKey
    }));

    return (
      <div className="tab-container">
        <Tabs defaultActiveKey={activeKey} activeKey={activeKey} items={items} onChange={tabChange} />
      </div>
    );
  }
);

export default EPTabs;
