import { MenuOutlined } from '@ant-design/icons';
import IconFont from '@_components/IconFont';
import { IExplorerItem, IMenuItem, INetworkItem } from '@_types';
import { Drawer, Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import './index.css';
interface IProps {
  explorerList: IExplorerItem[];
  networkList: INetworkItem[];
  menuList: IMenuItem[];
}
const NETWORK_TYPE = process.env.NEXT_PUBLIC_NETWORK_TYPE;
const IsMain = !!(NETWORK_TYPE === 'MAIN');
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
type MenuItem = Required<MenuProps>['items'][number];

export default function MobileHeaderMenu({ explorerList, networkList, menuList }: IProps) {
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
  const convertMenuItems = (list) => {
    return list?.map((ele) => {
      if (!ele.children?.length) {
        return getItem(<a onClick={() => jump(ele.link)}>{ele.label}</a>, ele.link);
      }
      return getItem(ele.label, ele.link, convertMenuItems(ele.children));
    });
  };
  const items: MenuProps['items'] = [
    ...convertMenuItems(menuList),
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
