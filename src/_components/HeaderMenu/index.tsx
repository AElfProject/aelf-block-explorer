import { Menu } from 'antd';
import { MenuProps } from 'rc-menu';
import { useState } from 'react';
import clsx from 'clsx';
const clsPrefix = 'header-menu-container';
import './index.css';
import IconFont from '@_components/IconFont';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import microApp from '@micro-zoe/micro-app';

interface IProps {
  isMobile: boolean;
}
export default function HeaderMenu({ isMobile }: IProps) {
  const router = useRouter();
  const jump = (url) => {
    // microApp.setData('governance', { path: url });
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    router.replace(url);
  };
  const items: MenuProps['items'] = [
    {
      label: <a onClick={() => jump('/')}>Home</a>,
      key: '/',
    },
    {
      label: (
        <div>
          <span className="submenu-title-wrapper">BlockChain</span>
          {!isMobile && <IconFont className="submenu-right-arrow" type="menu-down" />}
        </div>
      ),
      key: 'blockChain',
      children: [
        {
          label: <Link href="/blocks">Blocks</Link>,
          key: '/blocks',
        },
        {
          label: <Link href="/transactions">Transactions</Link>,
          key: '/transactions',
        },
        {
          type: 'group',
          label: 'Address',
          children: [
            {
              label: <Link href="/accounts">Top Accounts</Link>,
              key: '/accounts',
            },
            {
              label: <Link href="/contracts">Contracts</Link>,
              key: '/contracts',
            },
          ],
        },
      ],
    },
    {
      label: <Link href="/token">Token</Link>,
      key: '/token',
    },
    {
      label: <Link href="/nfts">NFTs</Link>,
      key: '/nfts',
    },

    {
      label: (
        <div>
          <span className="submenu-title-wrapper">Governance</span>
          <IconFont className="submenu-right-arrow" type="menu-down" />
        </div>
      ),
      key: 'governance',
      children: [
        {
          label: <a onClick={() => jump('/proposal/proposals')}>Proposal</a>,
          key: '/proposal/proposals',
        },
        {
          label: <a onClick={() => jump('/vote/election')}>Vote</a>,
          key: '/vote/election',
        },
        {
          label: <a onClick={() => jump('/resource')}>Resource</a>,
          key: '/resource',
        },
      ],
    },
  ];
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e.key);
    setCurrent(e.key);
  };

  return (
    <div className={clsx(`${clsPrefix}`)}>
      <div className={`${clsPrefix}-content`}>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}></Menu>
      </div>
    </div>
  );
}
