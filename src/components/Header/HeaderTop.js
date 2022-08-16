import { Menu } from "antd";
import { useCallback } from "react";
import IconFont from "../IconFont";
import "./HeaderTop.styles.less";
import { NETWORK_TYPE } from "../../../config/config";
import Search from "../Search/Search";
import Svg from "../Svg/Svg";

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
      className={`header-container-top${
        NETWORK_TYPE === "MAIN" ? " header-container-main-top" : ""
      }`}
    >
      <div className={headerClass}>
        <Svg
          icon={NETWORK_TYPE === "MAIN" ? "main_logo" : "test_logo"}
          className='aelf-logo-container'
        />
        <div className='header-top-content'>
          {showSearch && <Search />}
          <Menu
            className='net-change-menu'
            selectedKeys={[NETWORK_TYPE]}
            mode={menuMode}
            onClick={menuClick}
          >
            <SubMenu
              key='/Explorers'
              popupOffset={[0, -7]}
              popupClassName='common-header-submenu explorers-popup'
              title={
                <span className='submenu-title-wrapper'>
                  Explorers
                  <IconFont className='submenu-arrow' type='Down' />
                </span>
              }
            >
              {networkList.map((item) => (
                <MenuItem key={item.netWorkType}>{item.title}</MenuItem>
              ))}
            </SubMenu>
            <MenuItem key='/about'>
              <a
                href='https://www.aelf.io/'
                target='_blank'
                rel='noopener noreferrer'
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
