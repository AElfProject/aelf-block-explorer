/**
 * @file
 * @author huangzongzhe
 */
import React, { PureComponent } from 'react';
import { Drawer, Divider } from 'antd';
import Menu, { SubMenu, Item as MenuItem } from 'rc-menu';
import Link from 'next/link';
import { connect } from 'react-redux';
require('rc-menu/assets/index.css');
require('./header.styles.less');
import { getPathnameFirstSlash } from 'utils/urlUtils';
import { setIsSmallScreen } from 'redux/features/smallScreen/isSmallScreen';
import Search from '../Search/Search';
import ChainSelect from '../ChainSelect/ChainSelect';
import config, { NETWORK_TYPE } from 'constants/config/config';
import CHAIN_STATE from 'constants/config/configCMS.json';
import { isPhoneCheck } from 'utils/deviceCheck';
import HeaderTop from './HeaderTop';
import IconFont from '../IconFont';
import NetSelect from '../NetSelect/NetSelect';
import { getCMSDelayRequest } from 'utils/getCMS';
import { MenuOutlined } from '@ant-design/icons';
import withNoSSR from 'utils/withNoSSR';

const networkList = [
  {
    title: 'AELF Mainnet',
    url: 'https://explorer.aelf.io',
    netWorkType: 'MAIN',
  },
  {
    title: 'AELF Testnet',
    url: 'https://explorer-test.aelf.io',
    netWorkType: 'TESTNET',
  },
];

const CHAINS_LIST = CHAIN_STATE.chainItem || [];

const WIDTH_BOUNDARY = 942;

function isPhoneCheckWithWindow() {
  const windowWidth = window.innerWidth;
  return isPhoneCheck() || windowWidth <= WIDTH_BOUNDARY;
}

class BrowserHeader extends PureComponent {
  constructor(props) {
    super();
    this.timerInterval = null;
    this.interval = 300;
    this.showSearchTop = 330;
    this.state = {
      showSearch: this.getSearchStatus(),
      showMobileMenu: false,
      chainList: CHAINS_LIST,
      current: window.location.pathname === '/' ? '/home' : getPathnameFirstSlash(window.location.pathname),
    };
    this.isPhone = isPhoneCheckWithWindow();
    this.handleResize = this.handleResize.bind(this);
  }

  getSearchStatus() {
    const { pathname } = window.location;
    let showSearch = false;
    if (pathname === '/' && document.body.offsetWidth > 768) {
      const { scrollTop } = document.documentElement;
      if (scrollTop >= this.showSearchTop) {
        showSearch = true;
      } else {
        showSearch = false;
      }
    } else {
      showSearch = true;
    }
    if (pathname === '/' || pathname.includes('search-')) {
      showSearch = false;
    }
    return showSearch;
  }

  // TODO: 有空的话，回头使用观察者重写一遍，所有跳转都触发Header检测。而不是这种循环。
  setSeleted() {
    this.timerInterval = setInterval(() => {
      let pathname = `/${window.location.pathname.split('/')[1]}`;
      const { current } = this.state;
      pathname = pathname === '/' ? '/home' : pathname;
      const whiteList = [
        ['/block', 'Block'],
        ['/tx', 'Transaction'],
        ['/address', '/address'],
        ['/vote', '/vote'],
        ['/voteold', '/vote'],
      ];
      const target = whiteList.find((item) => item[0] === pathname);
      const showSearch = this.getSearchStatus();

      if (target && current !== target[1]) {
        // white list
        pathname = target[1];
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

  componentDidMount() {
    this.setSeleted();
    this.handleResize();
    this.fetchChainList();

    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize);
  }

  // fetch chain list by network
  async fetchChainList() {
    const data = await getCMSDelayRequest(0);
    if (data && data.chainItem && data.updated_at !== CHAIN_STATE.updated_at)
      this.setState({
        chainList: data.chainItem,
      });
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (window.location.pathname === '/') {
      const showSearch = this.getSearchStatus();

      if (showSearch !== this.state.showSearch) {
        this.setState({
          showSearch,
        });
      }
    }
  }

  handleResize() {
    const { setIsSmallScreen, isSmallScreen } = this.props;
    const { offsetWidth } = document.body;

    const newIsMobile = offsetWidth <= 768;

    if (newIsMobile !== isSmallScreen) {
      setIsSmallScreen(newIsMobile);
    }
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

  renderPhoneMenu() {
    const networkHTML = networkList.map((item) => {
      let classSelected = '';
      if (NETWORK_TYPE === item.netWorkType) {
        classSelected = 'header-chain-selected';
      }
      return (
        <MenuItem key={item.netWorkType}>
          <a href={item.url} className={classSelected}>
            {item.title}
          </a>
        </MenuItem>
      );
    });
    return (
      <SubMenu
        {...this.props}
        popupClassName="common-header-submenu"
        title={<span className="submenu-title-wrapper">Explorers</span>}
        className="aelf-submenu-container">
        {networkHTML}
      </SubMenu>
    );
  }

  renderMenu(menuMode, showMenu = true) {
    const nodeInfo = JSON.parse(localStorage.getItem('currentChain'));
    const { chain_id } = nodeInfo;

    let voteHTML = '';
    let resourceHTML = '';
    if (chain_id === config.MAINCHAINID) {
      voteHTML = (
        <MenuItem key="/vote">
          <Link href="/vote">Vote</Link>
        </MenuItem>
      );
      resourceHTML = (
        <MenuItem key="/resource">
          <Link href="/resource">Resource</Link>
        </MenuItem>
      );
    }

    const menuClass = showMenu ? 'aelf-menu' : 'aelf-menu  aelf-menu-hidden';
    const isPhone = isPhoneCheckWithWindow();

    return (
      // Add style to solve not responsive collapse in Flex layout
      // Menu will render fully item in flex layout and then collapse it.
      // You need tell flex not consider Menu width to enable responsive
      <Menu
        style={{ minWidth: 0, flex: 'auto' }}
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode={menuMode}
        key="navbar"
        className={menuClass}
        expandIcon={<IconFont className="submenu-right-arrow" type="Down" />}>
        <MenuItem key="/home">
          <Link href="/">Home</Link>
        </MenuItem>
        <SubMenu
          {...this.props}
          key="BLOCKCHAIN"
          popupClassName="common-header-submenu"
          popupOffset={[0, -7]}
          title={
            <>
              <span className="submenu-title-wrapper">Blockchain</span>
              {!isPhone && <IconFont className="submenu-arrow" type="Down" />}
            </>
          }
          className="aelf-submenu-container">
          <SubMenu key="Block" title="Block" popupOffset={[0, -4]} {...this.props}>
            <MenuItem key="/blocks">
              <Link href="/blocks">Blocks</Link>
            </MenuItem>
            <MenuItem key="/unconfirmedBlocks">
              <Link href="/unconfirmedBlocks">Unconfirmed Blocks</Link>
            </MenuItem>
          </SubMenu>

          <SubMenu key="Transaction" title="Transaction" {...this.props}>
            <MenuItem key="/txs">
              <Link href="/txs">Transactions</Link>
            </MenuItem>
            <MenuItem key="/unconfirmedTxs">
              <Link href="/unconfirmedTxs">Unconfirmed Transactions</Link>
            </MenuItem>
          </SubMenu>

          <SubMenu key="Address" title="Address" {...this.props}>
            <MenuItem key="/address">
              <Link href="/address">Accounts</Link>
            </MenuItem>
            <MenuItem key="/contract">
              <Link href="/contract">Contracts</Link>
            </MenuItem>
          </SubMenu>
        </SubMenu>

        <MenuItem key="/token">
          <Link href="/token">Token</Link>
        </MenuItem>
        <SubMenu
          {...this.props}
          key="GOVERNANCE"
          popupOffset={[0, -7]}
          popupClassName="common-header-submenu"
          title={
            <>
              <span className="submenu-title-wrapper">Governance</span>
              {!isPhone && <IconFont className="submenu-arrow" type="Down" />}
            </>
          }
          className="aelf-submenu-container">
          <MenuItem key="/proposal">
            <Link href="/proposal/proposals">Proposal</Link>
          </MenuItem>
          {voteHTML}
          {resourceHTML}
        </SubMenu>
        {isPhone && <Divider className="divider-mobile" />}
        {isPhone && this.renderPhoneMenu()}
        {isPhone && (
          <MenuItem key="/about">
            <a href="https://www.aelf.io/" target="_blank" rel="noopener noreferrer">
              About
            </a>
          </MenuItem>
        )}
      </Menu>
    );
  }

  toggleMenu() {
    this.setState({
      showMobileMenu: !this.state.showMobileMenu,
    });
  }

  renderMobileMore() {
    return (
      <div className={`header-navbar-mobile-more ${NETWORK_TYPE === 'MAIN' ? 'header-navbar-main-mobile-more' : ''}`}>
        <IconFont type={NETWORK_TYPE === 'MAIN' ? 'aelf' : 'aelf-test'} className="aelf-logo-container" />
        <MenuOutlined onClick={() => this.toggleMenu()} />
      </div>
    );
  }

  renderDrawerMenu(menuMode, showMenu = true) {
    return (
      <Drawer
        getContainer={false}
        visible={showMenu}
        placement="right"
        width={'80%'}
        closable={false}
        className={`header-drawer-menu-wrapper ${NETWORK_TYPE === 'MAIN' ? 'header-main-drawer-menu-wrapper' : ''}`}
        onClose={() => this.toggleMenu()}
        title={
          <>
            <IconFont type={NETWORK_TYPE === 'MAIN' ? 'aelf' : 'aelf-test'} className="aelf-logo-container" />
            <IconFont type="ErrorClose" className="close-icon" onClick={() => this.toggleMenu()} />
          </>
        }>
        <NetSelect chainList={this.state.chainList} />
        {this.renderMenu(menuMode, showMenu)}
      </Drawer>
    );
  }

  render() {
    const menuMode = this.isPhone ? 'inline' : 'horizontal';
    const mobileMoreHTML = this.isPhone ? this.renderMobileMore() : '';
    let menuHtml;
    if (this.isPhone) {
      menuHtml = this.renderDrawerMenu(menuMode, this.state.showMobileMenu);
    } else {
      menuHtml = this.renderMenu(menuMode);
    }

    const headerClass = this.isPhone ? 'header-container header-container-mobile' : 'header-container';
    const networkClass = this.isPhone
      ? NETWORK_TYPE === 'MAIN'
        ? ' header-main-container-mobile'
        : ''
      : NETWORK_TYPE === 'MAIN'
      ? ' header-main-container'
      : '';
    const onlyMenu = this.state.showSearch ? '' : 'only-menu ';
    const isMainNet = NETWORK_TYPE === 'MAIN' ? 'main-net' : 'test-net';

    return (
      <div className={'header-fixed-container ' + onlyMenu + isMainNet}>
        <div>
          {!this.isPhone && (
            <HeaderTop
              showSearch={this.state.showSearch}
              headerClass={headerClass}
              menuMode={menuMode}
              networkList={networkList}
            />
          )}
          <div className={headerClass + networkClass}>
            {mobileMoreHTML}

            <nav className={'header-navbar ' + (NETWORK_TYPE === 'MAIN' ? 'header-main-navbar' : '')}>
              {menuHtml}
              {this.isPhone && this.state.showSearch && (
                <div className="search-mobile-container">
                  <Search />
                </div>
              )}
              {!this.isPhone && <ChainSelect chainList={this.state.chainList} />}
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ ...state.common });

const mapDispatchToProps = (dispatch) => ({
  setIsSmallScreen: (isSmallScreen) => dispatch(setIsSmallScreen(isSmallScreen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withNoSSR(BrowserHeader));
