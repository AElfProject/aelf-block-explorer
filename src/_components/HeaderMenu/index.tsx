'use client';
import { Menu } from 'antd';
import { MenuProps } from 'rc-menu';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import './index.css';
import IconFont from '@_components/IconFont';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ChainSelect from '@_components/ChainSelect';
import { MenuItem, NetworkItem } from '@_types';
import { getPathnameFirstSlash } from '@_utils/urlUtils';
import { useMemoizedFn } from 'ahooks';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
interface IProps {
  networkList: NetworkItem[];
  headerMenuList: MenuItem[];
}

const clsPrefix = 'header-menu-container';
export default function HeaderMenu({ networkList, headerMenuList }: IProps) {
  const { isMobile } = useMobileAll();
  const router = useRouter();
  const jump = useMemoizedFn((url) => {
    // microApp.setData('governance', { path: url });
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    router.replace(url);
  });

  // TODO: use cms
  const items: MenuProps['items'] = useMemo(() => {
    return headerMenuList?.map((ele) => {
      if (!ele.children?.length) {
        // one layer
        return {
          label: <a onClick={() => jump(ele.path)}>{ele.label}</a>,
          key: ele.path,
        };
      } else {
        // parent of two layer
        const item = {
          label: (
            <div className="flex items-center">
              <span className="submenu-title-wrapper">{ele.label}</span>
              <IconFont className="submenu-right-arrow" type="menu-down" />
            </div>
          ),
          key: ele.path,
          popupClassName: `${clsPrefix}-popup`,
          children: [] as MenuProps['items'],
        };
        ele.children.forEach((element) => {
          const { label, path } = element;
          const secondSlashIndex = path.slice(1).indexOf('/');
          item.children?.push({
            label: <a onClick={() => jump(path)}>{label}</a>,
            key: secondSlashIndex === -1 ? path : getPathnameFirstSlash(path),
          });
        });
        return item;
      }
    });
  }, [headerMenuList, jump]);
  const pathname = usePathname();
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const [current, setCurrent] = useState(secondSlashIndex === -1 ? pathname : getPathnameFirstSlash(pathname));
  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className={clsx(`${clsPrefix}`)}>
      <div className={`${clsPrefix}-content`}>
        <Menu className="flex-1" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}></Menu>
        <ChainSelect />
      </div>
    </div>
  );
}
