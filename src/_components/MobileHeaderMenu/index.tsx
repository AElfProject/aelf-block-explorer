import { MenuOutlined } from '@ant-design/icons';
import IconFont from '@_components/IconFont';
import { MenuItem, NetworkItem } from '@_types';
import { Drawer, Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import './index.css';
import { useAppDispatch, useAppSelector } from '@_store';
import { setDefaultChain } from '@_store/features/chainIdSlice';
import { getPathnameFirstSlash } from '@_utils/urlUtils';
import { isMainNet } from '@_utils/isMainNet';
interface IProps {
  headerMenuList: MenuItem[];
  networkList: NetworkItem[];
}
type AntdMenuItem = Required<MenuProps>['items'][number];

export default function MobileHeaderMenu({ headerMenuList, networkList }: IProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { chainArr } = useAppSelector((state) => state.getChainId);
  const toggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    setShowMobileMenu(false);
  };

  const pathname = usePathname();
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const [current, setCurrent] = useState(secondSlashIndex === -1 ? pathname : getPathnameFirstSlash(pathname));
  const router = useRouter();
  function getItem(label: React.ReactNode, key: React.Key, children?: AntdMenuItem[], type?: 'group'): AntdMenuItem {
    return {
      key,
      children,
      label,
      type,
    } as AntdMenuItem;
  }
  const jump = (url) => {
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    router.replace(url);
  };
  const convertMenuItems = (list) => {
    return list?.map((ele) => {
      const { children, path, label } = ele;
      if (!children?.length) {
        const secondSlashIndex = path.slice(1).indexOf('/');
        const key = secondSlashIndex === -1 ? path : getPathnameFirstSlash(path);
        return getItem(<a onClick={() => jump(path)}>{label}</a>, key);
      }
      return getItem(label, path, convertMenuItems(children));
    });
  };
  const dispatch = useAppDispatch();
  const onSelectHandler = (value: string) => {
    dispatch(setDefaultChain(value));
    router.push(`/?chainId=${value}`);
  };
  const items: MenuProps['items'] = [
    ...convertMenuItems(headerMenuList),
    { type: 'divider' },
    getItem(
      'Explorers',
      'explorers',
      networkList.map((ele) => {
        return getItem(<Link href={ele.path}>{ele.label}</Link>, ele.key);
      }),
    ),
    getItem(
      'Networks',
      'networks',
      chainArr?.map((ele) => {
        return getItem(<a onClick={() => onSelectHandler(ele.key)}>{ele.label}</a>, ele.label);
      }),
    ),
  ];

  return (
    <div className={`header-navbar-mobile-more ${isMainNet ? 'header-navbar-main-mobile-more' : ''}`}>
      <IconFont type={isMainNet ? 'moremainnet' : 'moretestnet'} onClick={() => toggleMenu()} />
      {showMobileMenu && (
        <Drawer
          open={showMobileMenu}
          placement="top"
          closable={false}
          zIndex={40}
          styles={{ mask: { background: 'transparent' } }}
          className={`header-drawer-menu-wrapper ${isMainNet ? 'header-main-drawer-menu-wrapper' : ''} ${
            pathname === '/' && 'home-header-drawer-menu-wrapper'
          }`}
          rootClassName={`header-drawer-menu-root-wrapper`}
          onClose={() => toggleMenu()}>
          <Menu
            onClick={onClick}
            style={{ width: 256 }}
            expandIcon={<IconFont className="submenu-right-arrow" type="Down"></IconFont>}
            selectedKeys={[current]}
            mode="inline"
            items={items}
          />
        </Drawer>
      )}
    </div>
  );
}
