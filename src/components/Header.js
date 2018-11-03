import React, { PureComponent } from "react";
import { Layout, Menu, Icon } from "antd";
import { Link } from "react-router-dom";

import "./header.styles.less";
import Search from "./Search/Search";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class BrowserHeader extends PureComponent {
  state = {
    current: location.pathname || "/"
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  render() {
    return (
      <Header>
        <div className="header-container">
          <Link to="/" key="logo">
            <img src="https://aelf.io/assets/images/logo.jpg" />
          </Link>
          <nav className="header-navbar">
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              key="navbar"
              theme="dark"
            >
              <Menu.Item key="/home">
                <Icon type="home" />
                <Link to="/">首页</Link>
              </Menu.Item>
              <SubMenu
                title={
                  <span className="submenu-title-wrapper">
                    <Icon type="gold" />
                    区块链
                  </span>
                }
              >
                <MenuItemGroup title="区块">
                  <Menu.Item key="/glod">
                    <Icon type="gold" />
                    <Link to="/blocks">查看区块</Link>
                  </Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="交易">
                  <Menu.Item key="/txs">
                    <Icon type="pay-circle" />
                    <Link to="/txs">查看交易</Link>
                  </Menu.Item>
                </MenuItemGroup>
              </SubMenu>
              <Menu.Item key="/wallet">
                <Icon type="wallet" />
                <a
                  href="https://wallet-test.aelf.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  钱包
                </a>
              </Menu.Item>
              <Menu.Item key="/apps">
                <Icon type="appstore" />
                <Link to="/apps">应用中心</Link>
              </Menu.Item>
              <Menu.Item key="/about">
                <Icon type="profile" />
                <a
                  href="https://www.aelf.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  关于我们
                </a>
              </Menu.Item>
            </Menu>
            <Search />
          </nav>
        </div>
      </Header>
    );
  }
}
