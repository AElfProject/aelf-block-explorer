import { Menu } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import clsx from "clsx";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import IconFont from "../IconFont";
import "./HeaderTop.styles.less";
import { CHAIN_ID, NETWORK_TYPE } from "../../../config/config";
import Search from "../Search/Search";
import Svg from "../Svg/Svg";
import useMobile from "../../hooks/useMobile";
import { ELF_REALTIME_PRICE_URL, HISTORY_PRICE } from "../../constants";
import { get } from "../../utils";
import { setPriceAndHistoryPrice } from "../../redux/actions/common";
import fetchPriceAndPrevious from "../../utils/fetchPriceAndPrevious";

const TokenIcon = require("../../assets/images/tokenLogo.png");

const { SubMenu, Item: MenuItem } = Menu;
let jumpFlag = false;

export default function HeaderTop({
  headerClass,
  menuMode,
  networkList,
  showSearch,
}) {
  const common = useSelector((state) => state.common, shallowEqual);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isMobile = useMobile();
  const [price, setPrice] = useState({ USD: 0 });
  const [previousPrice, setPreviousPrice] = useState({ usd: 0 });
  useEffect(() => {
    const fetchData = async () => {
      const { price: priceRes, previousPrice: previousPriceRes } =
        await fetchPriceAndPrevious();
      dispatch(setPriceAndHistoryPrice(priceRes, previousPriceRes));
      if (CHAIN_ID === "AELF" && NETWORK_TYPE === "MAIN" && !isMobile) {
        setPrice(priceRes);
        setPreviousPrice(previousPriceRes);
      }
    };
    // include headertop and home page
    if (window.location.pathname === "/") {
      fetchData();
    } else if (CHAIN_ID === "AELF" && NETWORK_TYPE === "MAIN" && !isMobile) {
      // only once
      if (!jumpFlag) {
        jumpFlag = true;
        fetchData();
      }
    }
  }, [pathname]);

  const range = useMemo(() => {
    if (price.USD && previousPrice.usd) {
      return ((price.USD - previousPrice.usd) / previousPrice.usd) * 100;
    }
    return "-";
  }, [price, previousPrice]);

  const menuClick = useCallback((item) => {
    const filter = networkList.filter(
      (network) => network.netWorkType === item.key
    );
    if (filter.length) window.location = filter[0].url;
  }, []);

  return (
    <div
      className={clsx(
        "header-container-top",
        NETWORK_TYPE === "MAIN" && "header-container-main-top"
      )}
    >
      <div className={headerClass}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Svg
            icon={NETWORK_TYPE === "MAIN" ? "main_logo" : "test_logo"}
            className="aelf-logo-container"
          />
          {range !== "-" && (
            <div className="price-container">
              <img src={TokenIcon} alt="elf" />
              <span className="price">$ {price.USD}</span>
              <span className={`range ${range >= 0 ? "rise" : "fall"}`}>
                {range >= 0 ? "+" : ""}
                {range.toFixed(2)}%
              </span>
            </div>
          )}
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
              key="/Explorers"
              popupOffset={[0, -7]}
              popupClassName="common-header-submenu explorers-popup"
              title={
                <span className="submenu-title-wrapper">
                  Explorers
                  <IconFont className="submenu-arrow" type="Down" />
                </span>
              }
            >
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
