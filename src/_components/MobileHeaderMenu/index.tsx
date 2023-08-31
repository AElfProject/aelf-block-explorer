import { MenuOutlined } from '@ant-design/icons';
import IconFont from '@_components/IconFont';
import { IExplorerItem, INetworkItem } from '@_types';
import { Drawer, Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './index.css';
interface IProps {
  explorerList: IExplorerItem[];
  networkList: INetworkItem[];
}
const NETWORK_TYPE = process.env.NEXT_PUBLIC_NETWORK_TYPE;
const IsMain = !!(NETWORK_TYPE === 'MAIN');
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
type MenuItem = Required<MenuProps>['items'][number];

export default function MobileHeaderMenu({ explorerList, networkList }: IProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const toggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  const pathname = usePathname();
  const [selectKeys, setSelectKeys] = useState(['']);
  useEffect(() => {
    const keys: string[] = [];
    if (pathname === '/') {
      keys.push('/');
    } else {
      // start with /
      // we search from index 1
      const position = pathname.slice(1).indexOf('/');
      const key = pathname.slice(0, position === -1 ? 0 : position);
      keys.push(key);
    }
    setSelectKeys(keys);
    setShowMobileMenu(false);
  }, [pathname]);

  const router = useRouter();
  function getItem(label: React.ReactNode, key: React.Key, children?: MenuItem[], type?: 'group'): MenuItem {
    return {
      key,
      children,
      label,
      type,
    } as MenuItem;
  }
  const jump = (url) => {
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    router.replace(url);
  };
  const items: MenuProps['items'] = [
    getItem(<Link href="/">Home</Link>, '/'),
    getItem('Blockchain', 'blockChain', [
      getItem(<Link href="/blocks">Blocks</Link>, '/blocks'),
      getItem(<Link href="/transactions">Transactions</Link>, '/transactions'),
      getItem(<Link href="/accounts">Top Accounts</Link>, '/accounts'),
      getItem(<Link href="/contracts">Contracts</Link>, '/contracts'),
    ]),
    getItem(<Link href="/token">Token</Link>, '/token'),
    getItem(<Link href="/nfts">NFTs</Link>, '/nfts'),

    getItem('Governance', 'governance', [
      getItem(<a onClick={() => jump('/proposal/proposals')}>Proposal</a>, '/proposal'),
      getItem(<a onClick={() => jump('/vote/election')}>Vote</a>, '/vote'),
      getItem(<a onClick={() => jump('/resource')}>Resource</a>, '/resource'),
    ]),
    { type: 'divider' },
    getItem(
      'Explorers',
      'explorers',
      explorerList.map((ele) => {
        return getItem(<Link href={ele.url}>{ele.title}</Link>, ele.netWorkType);
      }),
    ),
    getItem(
      'Networks',
      'networks',
      networkList.map((ele) => {
        return getItem(<Link href={ele.chainsLink}>{ele.chainsLinkName}</Link>, ele.chainId);
      }),
    ),
  ];

  return (
    <div className={`header-navbar-mobile-more ${IsMain ? 'header-navbar-main-mobile-more' : ''}`}>
      <IconFont type={IsMain ? 'moremainnet' : 'moretestnet'} onClick={() => toggleMenu()} />
      {showMobileMenu && (
        <Drawer
          visible={showMobileMenu}
          placement="top"
          closable={false}
          zIndex={40}
          maskStyle={{ background: 'transparent' }}
          className={`header-drawer-menu-wrapper ${IsMain ? 'header-main-drawer-menu-wrapper' : ''} ${
            pathname === '/' && 'home-header-drawer-menu-wrapper'
          }`}
          rootClassName={`header-drawer-menu-root-wrapper`}
          onClose={() => toggleMenu()}
          title={<>header drawer menu</>}>
          <Menu
            onClick={onClick}
            style={{ width: 256 }}
            expandIcon={<IconFont className="submenu-right-arrow" type="Down"></IconFont>}
            defaultSelectedKeys={selectKeys}
            mode="inline"
            items={items}
          />
        </Drawer>
      )}
    </div>
  );
}
