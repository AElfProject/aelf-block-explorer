import React from "react";
import { connect } from "react-redux";
import { Button, Space } from "antd";
// export variable
import * as Icons from "@ant-design/icons";
// export default variable
import Icon from "@ant-design/icons";
import Logo from "../../assets/images/logo.png";
import { BitcoinIcon, RedditIcon, SendIcon } from "../custom.icons";

import "./footer.styles.less";

function getIconList() {
  const listInfo = [
    {
      href: "mailto:contact@aelf.io",
      type: "MailOutlined",
    },
    {
      href: "https://www.facebook.com/aelfofficial/",
      target: "_blank",
      type: "FacebookOutlined",
    },
    {
      href: "https://twitter.com/aelfblockchain",
      target: "_blank",
      type: "TwitterOutlined",
    },
    {
      href: "https://t.me/aelfblockchain",
      target: "_blank",
      component: SendIcon,
    },
    {
      href: "https://www.reddit.com/r/aelfofficial/",
      target: "_blank",
      component: RedditIcon,
    },
    {
      href: "https://medium.com/aelfblockchain",
      target: "_blank",
      type: "MediumOutlined",
    },
    {
      href: "https://github.com/aelfProject",
      target: "_blank",
      type: "GithubOutlined",
    },
    {
      href: "http://slack.aelf.io/",
      target: "_blank",
      type: "SlackOutlined",
    },
    {
      href: "https://www.linkedin.com/company/aelfblockchain/",
      target: "_blank",
      type: "LinkedinOutlined",
    },
    {
      href: "http://www.youtube.com/c/aelfblockchain",
      target: "_blank",
      type: "YoutubeOutlined",
    },
    {
      href: "https://0.plus/aelf_chs",
      target: "_blank",
      component: BitcoinIcon,
    },
  ];

  const html = listInfo.map((item) => (
    <Button
      key={item.href}
      href={item.href}
      rel='noopener noreferrer'
      target={item.target || ""}
      shape='circle'
    >
      {item.type ? (
        React.createElement(Icons[item.type], {
          style: { color: "#000" },
        })
      ) : (
        <Icon
          style={{
            color: "#000",
          }}
          component={item.component}
        />
      )}
    </Button>
  ));

  return html;
}

const BrowserFooter = (props) => {
  const iconListHTML = getIconList(props);

  return (
    <section {...props} className='footer'>
      <div className='footer-container basic-container'>
        <div className='footer-logo'>
          <img alt='aelf' src={Logo} />
          <p>Decentralized Cloud Computing Blockchain Network</p>
        </div>
        <div className='footer-links-container'>{iconListHTML}</div>
      </div>
      <p className='copyright-container'>
        Copyright © {new Date().getFullYear()} ælf
      </p>
    </section>
  );
};

const mapStateToProps = (state) => ({
  ...state.common,
});

export default connect(mapStateToProps)(BrowserFooter);
