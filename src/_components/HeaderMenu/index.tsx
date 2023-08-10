import { Menu } from 'antd';
import { MenuProps } from 'rc-menu';
import { useState } from 'react';
import clsx from 'clsx';
const clsPrefix = 'header-menu-container';
import './index.css';

const items: MenuProps['items'] = [
  {
    label: 'Home',
    key: 'home',
  },
  {
    label: 'BlockChain',
    key: 'blockChain',
    children: [
      {
        label: 'Blocks',
        key: 'blocks',
      },
      {
        label: 'Transactions',
        key: 'transactions',
      },
      {
        type: 'group',
        label: 'Address',
        children: [
          {
            label: 'Top Accounts',
            key: 'accounts',
          },
          {
            label: 'Contracts',
            key: 'contracts',
          },
        ],
      },
    ],
  },
  {
    label: 'Token',
    key: 'token',
  },
  {
    label: 'NFTs',
    key: 'nfts',
  },
  {
    label: 'Governance',
    key: 'governance',
    children: [
      {
        label: 'Proposals',
        key: 'proposals',
      },
      {
        label: 'Vote',
        key: 'vote',
      },
      {
        label: 'Resource',
        key: 'resource',
      },
    ],
  },
];
export default function HeaderMenu() {
  const [current, setCurrent] = useState('mail');
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <div className={clsx(`${clsPrefix}`)}>
      <div className={`${clsPrefix}-content`}>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          expandIcon={<IconFont className="submenu-right-arrow" type="Down" />}></Menu>
      </div>
    </div>
  );
}
