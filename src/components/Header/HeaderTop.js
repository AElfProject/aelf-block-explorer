import { Menu } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import IconFont from "../IconFont";
import "./HeaderTop.styles.less";
import { CHAIN_ID, NETWORK_TYPE } from "../../../config/config";
import Search from "../Search/Search";
import Svg from "../Svg/Svg";
import useMobile from "../../hooks/useMobile";
import { ELF_REALTIME_PRICE_URL, HISTORY_PRICE } from "../../constants";
import { get } from "../../utils";
const TokenIcon = require("../../assets/images/tokenLogo.png");

const { SubMenu, Item: MenuItem } = Menu;

export default function HeaderTop({
  headerClass,
  menuMode,
  networkList,
  showSearch,
}) {
  const isMobile = useMobile()
  const [price, setPrice] = useState({ USD: 0 });
  const [previousPrice, setPreviousPrice] = useState({ usd: 0 });

  const range = useMemo(() => {
    if (price.USD && previousPrice.usd) {
      return ((price.USD - previousPrice.usd) / previousPrice.usd) * 100;
    }
    return 0;
  }, [price.USD, previousPrice.usd]);

  useEffect(() => {
    //todo change this
    // if (CHAIN_ID === "AELF" && NETWORK_TYPE === "MAIN" && !isMobile) {
    if (CHAIN_ID === "AELF" && !isMobile) {
      get(ELF_REALTIME_PRICE_URL).then((price) => setPrice(price));
      get(HISTORY_PRICE, {
        token_id: "aelf",
        vs_currencies: "usd",
        date: new Date(new Date().toLocaleDateString()).valueOf() - 24 * 3600 * 1000,
      }).then((res) => {
        if (!res.message) {
          setPreviousPrice(res);
        }
      });
    }
  }, [isMobile]);

  const menuClick = useCallback((item) => {
    const filter = networkList.filter(
      (network) => network.netWorkType === item.key
    );
    if (filter.length) window.location = filter[0].url;
  }, []);


  return (
    <div
      className={
        "header-container-top" +
        (NETWORK_TYPE === "MAIN" ? " header-container-main-top" : "")
      }
    >
      <div className={headerClass}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Svg icon={NETWORK_TYPE === "MAIN" ? "main_logo" : "test_logo"} className="aelf-logo-container" />
          {!!range
            && <div className="price-container">
              <img src={TokenIcon} />
              <span className="price">$ {price.USD}</span>
              <span className={"range " + (range >= 0 ? "rise" : "fall")}>
                {range >= 0 ? "+" : ""}
                {range.toFixed(2)}%
              </span>
            </div>}
        </div>
        <div className="header-top-content">
          {showSearch && <Search />}
          <Menu
            className="net-change-menu"
            selectedKeys={[NETWORK_TYPE]}
            mode={menuMode}
            onClick={menuClick}
          >
            <SubMenu
              key={"/Explorers"}
              popupOffset={[0, -7]}
              popupClassName="common-header-submenu explorers-popup"
              title={
                <span className="submenu-title-wrapper">
                  Explorers
                  <IconFont className="submenu-arrow" type="Down" />
                </span>
              }
            >
              {/* <MenuItem key="https://explorer.aelf.io/">AELF Mainnet</MenuItem>
            <MenuItem key="https://explorer-test.aelf.io/">
              AELF Testnet
            </MenuItem> */}
              {networkList.map((item) => (
                <MenuItem key={item.netWorkType}>{item.title}</MenuItem>
              ))}
            </SubMenu>
            <MenuItem key="/about">
              <a
                href="https://www.aelf.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
