import { Menu } from "antd";
import { useCallback } from "react";
import IconFont from "../IconFont";
import "./HeaderTop.styles.less";
import { NETWORK_TYPE } from "../../../config/config";
import Search from "../Search/Search";

const { SubMenu, Item: MenuItem } = Menu;

export default function HeaderTop({
  headerClass,
  menuMode,
  networkList,
  showSearch,
}) {
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
        <IconFont
          type={NETWORK_TYPE === "MAIN" ? "aelf" : "aelf-test"}
          className="aelf-logo-container"
        />
        <div className="header-top-content">
          {showSearch && <Search />}
          <Menu
            className="net-change-menu"
            defaultSelectedKeys={[NETWORK_TYPE]}
            mode={menuMode}
            onClick={menuClick}
          >
            <SubMenu
              key={"/Explorers"}
              popupClassName="common-header-submenu"
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
                Abount
              </a>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
