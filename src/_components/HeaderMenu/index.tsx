import { Menu } from 'antd';
import { MenuProps } from 'rc-menu';
import { useState } from 'react';
import clsx from 'clsx';
const clsPrefix = 'header-menu-container';
import './index.css';
import IconFont from '@_components/IconFont';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IProps {
  isMobile: boolean;
}
export default function HeaderMenu({ isMobile }: IProps) {
  const items: MenuProps['items'] = [
    {
      label: <Link href="/">Home</Link>,
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
          label: <Link href="/proposals">Proposals</Link>,
          key: '/proposals',
        },
        {
          label: <Link href="/vote">Vote</Link>,
          key: '/vote',
        },
        {
          label: <Link href="/resource">Resource</Link>,
          key: '/resource',
        },
      ],
    },
  ];
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);
  console.log(current, 'current');
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
