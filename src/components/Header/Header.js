/**
 * @file
 * @author huangzongzhe
 */
/* eslint-disable fecs-camelcase */
import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Svg from '../../components/Svg/Svg';
import './header.styles.less';
import { getPathnameFirstSlash } from '@utils/urlUtils';
import { setIsSmallScreen } from '@actions/common';
import Search from '../Search/Search';
import ChainSelect from '../ChainSelect/ChainSelect';
import config, {CHAINS_LINK, CHAINS_LINK_NAMES, ADDRESS_INFO} from '../../../config/config';
import {isPhoneCheck} from '../../utils/deviceCheck';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

class BrowserHeader extends PureComponent {
  constructor() {
    super();
    this.timerInterval = null;
    this.interval = 300;
    this.showSearchTop = 330;
    this.state = {
      showSearch: this.getSearchStatus(),
      showMobileMenu: false,
      current:
        location.pathname === '/'
          ? '/home'
          : getPathnameFirstSlash(location.pathname)
    };
    this.isPhone = isPhoneCheck();
    this.handleResize = this.handleResize.bind(this);
  }

  getSearchStatus() {
    const { pathname } = location;
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
    return showSearch;
  }

  // TODO: 有空的话，回头使用观察者重写一遍，所有跳转都触发Header检测。而不是这种循环。
  setSeleted() {
    this.timerInterval = setInterval(() => {
      let pathname = `/${location.pathname.split('/')[1]}`;
      pathname = pathname === '/' ? '/home' : pathname;
      if (this.state.current !== pathname) {
        // white list
        const whiteList = ['/block', '/address', '/vote', '/voteold'];
        if (whiteList.indexOf(pathname) > -1) {
          pathname = '/blocks';
        }

        const showSearch = this.getSearchStatus();
        this.setState({
          current: pathname,
          showSearch
        });
      }
    }, this.interval);
  }

  componentDidMount() {
    this.setSeleted();
    this.handleResize();

    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (location.pathname === '/') {
      const showSearch = this.getSearchStatus();

      if (showSearch !== this.state.showSearch) {
        this.setState({
          showSearch
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

  handleClick = e => {
    clearTimeout(this.timerTimeout);
    this.timerTimeout = setTimeout(() => {
      const { isSmallScreen } = this.props;
      if (isSmallScreen) {
        this.toggleMenu();
      }
      this.setState({
        current: e.key
      });
    }, this.interval);
  };

  renderPhoneMenu() {
    const chainIdHTML = Object.keys(CHAINS_LINK).map(item => {
      let classSelected = '';
      if (ADDRESS_INFO.CURRENT_CHAIN_ID === item) {
        classSelected = 'header-chain-selected';
      }
      return  <Menu.Item key={item}>
        <a href={CHAINS_LINK[item]} className={classSelected}>{CHAINS_LINK_NAMES[item]}</a>
      </Menu.Item>;
    });
    return <SubMenu
      title={
        <span className='submenu-title-wrapper'>
                  EXPLORERS
            </span>
      }
      className='aelf-submenu-container'
    >
      {chainIdHTML}
    </SubMenu>;
  }


  renderMenu(menuMode, showMenu = true) {
    const nodeInfo = JSON.parse(localStorage.getItem('currentChain'));
    const { chain_id } = nodeInfo;

    let voteHTML = '';
    let resourceHTML = '';
    if (chain_id === config.MAINCHAINID) {
      voteHTML = (
        <Menu.Item key='/vote'>
          {/* <Icon type='appstore' /> */}
          <Link to='/vote'>VOTE</Link>
          {/* <Link to='/voteold'>VoteOld</Link> */}
          {/* <span>APP CENTER [Building]</span> */}
        </Menu.Item>
      );
      resourceHTML = (
        <Menu.Item key='/resource'>
          {/* <Icon type='appstore' /> */}
          <Link to='/resource'>RESOURCE</Link>
          {/* <span>APP CENTER [Building]</span> */}
        </Menu.Item>
      );
    }

    const menuClass = showMenu ? 'aelf-menu' : 'aelf-menu  aelf-menu-hidden';
    const isPhone = isPhoneCheck();

    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode={menuMode}
        key='navbar'
        className={menuClass}
      >
        <Menu.Item key='/home'>
          {/* <Icon type='home' /> */}
          <Link to='/'>HOME</Link>
        </Menu.Item>
        <SubMenu
          title={
            <span className='submenu-title-wrapper'>
              {/* <Icon type='gold' /> */}
              BLOCKCHAIN
            </span>
          }
          className='aelf-submenu-container'
        >
          <MenuItemGroup title='Block'>
            <Menu.Item key='/blocks'>
              {/* <Icon type='gold' /> */}
              <Link to='/blocks'>View Blocks</Link>
            </Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title='Transaction'>
            <Menu.Item key='/txs'>
              {/* <Icon type='pay-circle' /> */}
              <Link to='/txs'>View Transactions</Link>
            </Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <Menu.Item key='/contract'>
          <Link to='/contract'>CONTRACT</Link>
        </Menu.Item>
        {/* <Menu.Item key='/wallet'>
          <a
            href={config.WALLET_DOMAIN}
            target='_blank'
            rel='noopener noreferrer'
          >
            WALLET
          </a>
        </Menu.Item>
        <Menu.Item key='/apps'>
          <Link to='/apps'>APP CENTER[Building]</Link>
        </Menu.Item> */}
         {voteHTML}
        {/* <Menu.Item key='/voteold'> */}
        {/* <Link to='/voteold'>VoteOld</Link> */}
        {/* </Menu.Item> */}
         {resourceHTML}
        <Menu.Item key='/about'>
          {/* <Icon type='profile' /> */}
          <a
            href='https://www.aelf.io/'
            target='_blank'
            rel='noopener noreferrer'
          >
            ABOUT
          </a>
        </Menu.Item>
        {isPhone && this.renderPhoneMenu()}
      </Menu>
    );
  }

  toggleMenu() {
    this.setState({
      showMobileMenu: !this.state.showMobileMenu
    });
  }

  renderMobileMore() {
    return (
      <div
        className='header-navbar-mobile-more'
        onClick={() => this.toggleMenu()}
      >
        {/*...*/}
        <Icon type="menu" />
      </div>
    );
  }

  render() {

    const menuMode = this.isPhone ? 'inline' : 'horizontal';
    const mobileMoreHTML = this.isPhone ? this.renderMobileMore() : '';

    let menuHtml;
    if (this.isPhone) {
      menuHtml = this.renderMenu(menuMode, this.state.showMobileMenu);
    } else {
      menuHtml = this.renderMenu(menuMode);
    }

    const headerClass = this.isPhone ? 'header-container header-container-mobile' : 'header-container';

    return (
      <div className='header-fixed-container'>
        <div className={headerClass}>
          <Link to='/' key='logo'>
            <Svg
              icon='aelf_logo_purple'
              className='aelf-logo-container'
            />
          </Link>

          {mobileMoreHTML}

          <nav className='header-navbar'>
            {menuHtml}
            {this.state.showSearch && <Search />}
            {!this.isPhone && <ChainSelect />}
          </nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state.common });

const mapDispatchToProps = dispatch => ({
  setIsSmallScreen: isSmallScreen => dispatch(setIsSmallScreen(isSmallScreen))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserHeader);
