import { Menu } from 'antd';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import IconFont from '../IconFont';
import config, { NETWORK_TYPE } from 'constants/config/config';
import Search from '../Search/Search';
import Svg from '../Svg/Svg';
import { ELF_REALTIME_PRICE_URL, HISTORY_PRICE } from 'constants/api';
import { get } from 'utils/axios';
import TokenIcon from '../../assets/images/tokenLogo.png';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import { PriceDto } from './types';
require('./HeaderTop.styles.less');

const { SubMenu, Item: MenuItem } = Menu;
interface PropsDto {
  headerClass: string;
  menuMode: any;
  networkList: any[];
  showSearch: boolean;
  headers: any;
}
export default function HeaderTop({ headerClass, menuMode, networkList, showSearch, headers }: PropsDto) {
  const { CHAIN_ID } = config;
  let isMobile: boolean;
  const [price, setPrice] = useState({ USD: 0 });
  const [previousPrice, setPreviousPrice] = useState({ usd: 0 });
  if (typeof window !== 'undefined') {
    isMobile = isPhoneCheck();
  } else {
    isMobile = isPhoneCheckSSR(headers);
  }
  const range = useMemo(() => {
    if (price.USD && previousPrice.usd) {
      return ((price.USD - previousPrice.usd) / previousPrice.usd) * 100;
    }
    return '-';
  }, [price, previousPrice]);

  useEffect(() => {
    //todo change this
    if (CHAIN_ID === 'AELF' && !isMobile) {
      get(ELF_REALTIME_PRICE_URL).then((price) => setPrice(price as PriceDto));
      get(HISTORY_PRICE, {
        token_id: 'aelf',
        vs_currencies: 'usd',
        date: new Date(new Date().toLocaleDateString()).valueOf() - 24 * 3600 * 1000,
      }).then((res: any) => {
        if (!res.message) {
          setPreviousPrice(res);
        }
      });
    }
  }, [isMobile]);

  const menuClick = useCallback(
    (item: any) => {
      const filter = networkList.filter((network) => network.netWorkType === item.key);
      if (filter.length) window.location = filter[0].url;
    },
    [networkList],
  );

  return (
    <div className={`header-container-top`}>
      <div className={headerClass}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Svg icon={'test_logo'} className="aelf-logo-container" />
          {range !== '-' && (
            <div className="price-container">
              <img src={TokenIcon} />
              <span className="price">$ {price.USD}</span>
              <span className={'range ' + (range >= 0 ? 'rise' : 'fall')}>
                {range >= 0 ? '+' : ''}
                {range.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className="header-top-content">
          {showSearch && <Search />}
          <Menu className="net-change-menu" selectedKeys={[NETWORK_TYPE]} mode={menuMode} onClick={menuClick}>
            <SubMenu
              key="/Explorers"
              popupOffset={[0, -7]}
              popupClassName="common-header-submenu explorers-popup"
              title={
                <span className="submenu-title-wrapper">
                  Explorers
                  <IconFont className="submenu-arrow" type="Down" />
                </span>
              }>
              {networkList.map((item) => (
                <MenuItem key={item.netWorkType}>{item.title}</MenuItem>
              ))}
            </SubMenu>
            <MenuItem key="/about">
              <a href="https://www.aelf.io/" target="_blank" rel="noopener noreferrer">
                About
              </a>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
