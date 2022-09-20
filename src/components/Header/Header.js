/* eslint-disable camelcase */
/**
 * @file
 * @author huangzongzhe
 */
import React, { PureComponent } from "react";
import { Menu, Drawer, Divider } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import clsx from "clsx";

import "./header.styles.less";
import { getPathnameFirstSlash } from "@utils/urlUtils";
import { setIsSmallScreen } from "@actions/common";
import { MenuOutlined } from "@ant-design/icons";
import Search from "../Search/Search";
import ChainSelect from "../ChainSelect/ChainSelect";
import config, { NETWORK_TYPE } from "../../../config/config";
import CHAIN_STATE from "../../../config/configCMS.json";
import { isPhoneCheck } from "../../utils/deviceCheck";
import HeaderTop from "./HeaderTop";
import IconFont from "../IconFont";
import NetSelect from "../NetSelect/NetSelect";
import { getCMSDelayRequest } from "../../utils/getCMS";

const networkList = [
  {
    title: "AELF Mainnet",
    url: "https://explorer.aelf.io",
    netWorkType: "MAIN",
  },
  {
    title: "AELF Testnet",
    url: "https://explorer-test.aelf.io",
    netWorkType: "TESTNET",
  },
];

const CHAINS_LIST = CHAIN_STATE.chainItem || [];
const { SubMenu } = Menu;

const WIDTH_BOUNDARY = 942;

function isPhoneCheckWithWindow() {
  const windowWidth = window.innerWidth;
  return isPhoneCheck() || windowWidth <= WIDTH_BOUNDARY;
}

class BrowserHeader extends PureComponent {
  constructor() {
    super();
    this.timerInterval = null;
    this.interval = 300;
    this.showSearchTop = 330;
    this.state = {
      showSearch: this.getSearchStatus(),
      showMobileMenu: false,
      chainList: CHAINS_LIST,
      current:
        window.location.pathname === "/"
          ? "/home"
          : getPathnameFirstSlash(window.location.pathname),
    };
    this.isPhone = isPhoneCheckWithWindow();
    this.handleResize = this.handleResize.bind(this);
  }

  // TODO: 有空的话，回头使用观察者重写一遍，所有跳转都触发Header检测。而不是这种循环。


  componentDidMount() {
    this.setSeleted();
    this.handleResize();
    this.fetchChainList();

    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("resize", this.handleResize);
  }



  componentWillUnmount() {
    clearInterval(this.timerInterval);
    window.removeEventListener("scroll", this.handleScroll);
  }

  getSearchStatus() {
    const { pathname } = window.location;
    let showSearch = false;
    if (pathname === "/" && document.body.offsetWidth > 768) {
      const { scrollTop } = document.documentElement;
      if (scrollTop >= this.showSearchTop) {
        showSearch = true;
      } else {
        showSearch = false;
      }
    } else {
      showSearch = true;
    }
    if (pathname === "/" || pathname.includes("search-")) {
      showSearch = false;
    }
    return showSearch;
  }

  setSeleted() {
    this.timerInterval = setInterval(() => {
      let pathname = `/${window.location.pathname.split("/")[1]}`;
      const { current } = this.state;
      pathname = pathname === "/" ? "/home" : pathname;
      const whiteList = [
        ["/block", "Block"],
        ["/tx", "Transaction"],
        ["/address", "Address"],
        ["/vote", "/vote"],
        ["/voteold", "/vote"],
      ];
      const target = whiteList.find((item) => item[0] === pathname);
      const showSearch = this.getSearchStatus();

      if (target && current !== target[1]) {
        // white list
        [, pathname] = target;
        console.log('first')
        this.setState({
          current: pathname,
          showSearch,
        });
      } else if (!target) {
        this.setState({
          current: pathname,
          showSearch,
        });
      } else if (!target) {
        this.setState({
          current: pathname,
          showSearch,
        });
      }
    }, this.interval);
  }

  handleClick = (e) => {
    clearTimeout(this.timerTimeout);
    this.timerTimeout = setTimeout(() => {
      const { isSmallScreen } = this.props;
      if (isSmallScreen) {
        this.toggleMenu();
      }
      this.setState({
        current: e.key,
      });
    }, this.interval);
  };

  handleResize() {
    const { setIsSmallScreen: mySetIsSmallScreen, isSmallScreen } = this.props;
    const { offsetWidth } = document.body;

    const newIsMobile = offsetWidth <= 768;

    if (newIsMobile !== isSmallScreen) {
      mySetIsSmallScreen(newIsMobile);
    }
  }

  handleScroll() {
    if (window.location.pathname === "/") {
      const showSearch = this.getSearchStatus();

      const { showSearch: stateShowSearch } = this.state

      if (showSearch !== stateShowSearch) {
        this.setState({
          showSearch,
        });
      }
    }
  }

  // fetch chain list by network
  async fetchChainList() {
    const data = await getCMSDelayRequest(0);
    if (data && data.chainItem && data.updated_at !== CHAIN_STATE.updated_at)
      this.setState({
        chainList: data.chainItem,
      });
  }

  toggleMenu() {
    const { showMobileMenu } = this.state
    this.setState({
      showMobileMenu: !showMobileMenu,
    });
  }

  renderPhoneMenu() {
    const networkHTML = networkList.map((item) => {
      let classSelected = "";
      if (NETWORK_TYPE === item.netWorkType) {
        classSelected = "header-chain-selected";
      }
      return (
        <Menu.Item key={item.netWorkType}>
          <a href={item.url} className={classSelected}>
            {item.title}
          </a>
        </Menu.Item>
      );
    });
    return (
      <SubMenu
        popupClassName='common-header-submenu'
        title={<span className='submenu-title-wrapper'>Explorers</span>}
        className='aelf-submenu-container'
      >
        {networkHTML}
      </SubMenu>
    );
  }

  renderMenu(menuMode, showMenu = true) {
    const { current } = this.state
    const nodeInfo = JSON.parse(localStorage.getItem("currentChain"));
    const { chain_id } = nodeInfo;

    let voteHTML = "";
    let resourceHTML = "";
    if (chain_id === config.MAINCHAINID) {
      voteHTML = (
        <Menu.Item key='/vote'>
          <Link to='/vote'>Vote</Link>
        </Menu.Item>
      );
      resourceHTML = (
        <Menu.Item key='/resource'>
          <Link to='/resource'>Resource</Link>
        </Menu.Item>
      );
    }

    const menuClass = showMenu ? "aelf-menu" : "aelf-menu  aelf-menu-hidden";
    const isPhone = isPhoneCheckWithWindow();

    return (
      // Add style to solve not responsive collapse in Flex layout
      // Menu will render fully item in flex layout and then collapse it.
      // You need tell flex not consider Menu width to enable responsive
      <Menu
        style={{ minWidth: 0, flex: "auto" }}
        onClick={this.handleClick}
        selectedKeys={[current]}
        mode={menuMode}
        key='navbar'
        className={menuClass}
        expandIcon={<IconFont className='submenu-right-arrow' type='Down' />}
      >
        <Menu.Item key='/home'>
          <Link to='/'>Home</Link>
        </Menu.Item>
        <SubMenu
          key='BLOCKCHAIN'
          popupClassName='common-header-submenu'
          popupOffset={[0, -7]}
          title={
            <>
              <span className='submenu-title-wrapper'>Blockchain</span>
              {!isPhone && <IconFont className='submenu-arrow' type='Down' />}
            </>
          }
          className='aelf-submenu-container'
        >
          <>
            <SubMenu key='Block' title='Block' popupOffset={[0, -4]}>
              <Menu.Item key='/blocks'>
                <Link to='/blocks'>Blocks</Link>
              </Menu.Item>
              <Menu.Item key='/unconfirmedBlocks'>
                <Link to='/unconfirmedBlocks'>Unconfirmed Blocks</Link>
              </Menu.Item>
            </SubMenu>
          </>
          <>
            <SubMenu key='Transaction' title='Transaction'>
              <Menu.Item key='/txs'>
                <Link to='/txs'>Transactions</Link>
              </Menu.Item>
              <Menu.Item key='/unconfirmedTxs'>
                <Link to='/unconfirmedTxs'>Unconfirmed Transactions</Link>
              </Menu.Item>
            </SubMenu>
          </>
          <>
            <SubMenu key='Address' title='Address'>
              <Menu.Item key='/accounts'>
                <Link to='/accounts'>Top Accounts</Link>
              </Menu.Item>
              <Menu.Item key='/contracts'>
                <Link to='/contracts'>Contracts</Link>
              </Menu.Item>
            </SubMenu>
          </>
        </SubMenu>

        <Menu.Item key='/token'>
          <Link to='/tokens'>Token</Link>
        </Menu.Item>
        <SubMenu
          key='GOVERNANCE'
          popupOffset={[0, -7]}
          popupClassName='common-header-submenu'
          title={
            <>
              <span className='submenu-title-wrapper'>Governance</span>
              {!isPhone && <IconFont className='submenu-arrow' type='Down' />}
            </>
          }
          className='aelf-submenu-container'
        >
          <Menu.Item key='/proposal'>
            <Link to='/proposal/proposals'>Proposal</Link>
          </Menu.Item>
          {voteHTML}
          {resourceHTML}
        </SubMenu>
        {isPhone && <Divider className='divider-mobile' />}
        {isPhone && this.renderPhoneMenu()}
        {isPhone && (
          <Menu.Item key='/about'>
            <a
              href='https://www.aelf.io/'
              target='_blank'
              rel='noopener noreferrer'
            >
              About
            </a>
          </Menu.Item>
        )}
      </Menu>
    );
  }

  renderMobileMore() {
    return (
      <div
        className={`header-navbar-mobile-more ${NETWORK_TYPE === "MAIN" ? "header-navbar-main-mobile-more" : ""
          }`}
      >
        <IconFont
          type={NETWORK_TYPE === "MAIN" ? "aelf" : "aelf-test"}
          className='aelf-logo-container'
        />
        <MenuOutlined onClick={() => this.toggleMenu()} />
      </div>
    );
  }

  renderDrawerMenu(menuMode, showMenu = true) {
    const { chainList } = this.state
    return (
      <Drawer
        getContainer={false}
        visible={showMenu}
        placement='right'
        width="80%"
        closable={false}
        className={`header-drawer-menu-wrapper ${NETWORK_TYPE === "MAIN" ? "header-main-drawer-menu-wrapper" : ""
          }`}
        onClose={() => this.toggleMenu()}
        title={
          <>
            <IconFont
              type={NETWORK_TYPE === "MAIN" ? "aelf" : "aelf-test"}
              className='aelf-logo-container'
            />
            <IconFont
              type='ErrorClose'
              className='close-icon'
              onClick={() => this.toggleMenu()}
            />
          </>
        }
      >
        <NetSelect chainList={chainList} />
        {this.renderMenu(menuMode, showMenu)}
      </Drawer>
    );
  }

  render() {
    const menuMode = this.isPhone ? "inline" : "horizontal";
    const mobileMoreHTML = this.isPhone ? this.renderMobileMore() : "";
    const { showMobileMenu, showSearch, chainList } = this.state

    let menuHtml;
    if (this.isPhone) {
      menuHtml = this.renderDrawerMenu(menuMode, showMobileMenu);
    } else {
      menuHtml = this.renderMenu(menuMode);
    }

    const isMain = NETWORK_TYPE === "MAIN"
    const headerClass = clsx('header-container', this.isPhone && 'header-container-mobile');

    const networkClass = clsx(isMain && `header-main-container${this.isPhone ? '-mobile' : ''}`)

    const onlyMenu = showSearch ? "" : "only-menu ";
    const isMainNet = isMain ? "main-net" : "test-net";

    return (
      <div className={`header-fixed-container ${onlyMenu}${isMainNet}`}>
        <div>
          {!this.isPhone && (
            <HeaderTop
              showSearch={showSearch}
              headerClass={clsx(headerClass)}
              menuMode={menuMode}
              networkList={networkList}
            />
          )}
          <div className={clsx(headerClass, networkClass)}>
            {mobileMoreHTML}

            <nav
              className={clsx('header-navbar', isMain && "header-main-navbar")}
            >
              {menuHtml}
              {this.isPhone && showSearch && (
                <div className='search-mobile-container'>
                  <Search />
                </div>
              )}
              {!this.isPhone && (
                <ChainSelect chainList={chainList} />
              )}
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.common });

const mapDispatchToProps = (dispatch) => ({
  setIsSmallScreen: (isSmallScreen) =>
    dispatch(setIsSmallScreen(isSmallScreen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowserHeader);
