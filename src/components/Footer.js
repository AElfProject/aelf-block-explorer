import React from "react";
import { Layout, Icon, Button } from "antd";
import { BitcoinIcon, RedditIcon, SendIcon } from "./custom.icons";

import "./footer.styles.less";

const { Footer } = Layout;

const BrowserFooter = props => (
  <Footer {...props} className="footer">
    <div>
      <p className="footer-logo">
        <img alt="aelf" src="https://aelf.io/assets/images/logo2.jpg" />
      </p>
      <div className="footer-links-container">
        <Button href="mailto:contact@aelf.io" shape="circle">
          <Icon type="mail" />
        </Button>
        <Button
          href="https://www.facebook.com/aelfofficial/"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon type="facebook" />
        </Button>
        <Button
          href="https://twitter.com/aelfblockchain"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon type="twitter" />
        </Button>
        <Button
          href="https://t.me/aelfblockchain"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon component={SendIcon} />
        </Button>
        <Button
          href="https://www.reddit.com/r/aelfofficial/"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon component={RedditIcon} />
        </Button>
        <Button
          href="https://medium.com/aelfblockchain"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon type="medium" />
        </Button>
        <Button
          href="https://github.com/aelfProject"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon type="github" />
        </Button>
        <Button
          href="http://slack.aelf.io/"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon type="slack" />
        </Button>
        <Button
          href="https://www.linkedin.com/company/aelfblockchain/"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon type="linkedin" />
        </Button>
        <Button
          href="http://www.youtube.com/c/aelfblockchain"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon type="youtube" />
        </Button>
        <Button
          href="https://0.plus/aelf_chs"
          target="_blank"
          rel="noopener noreferrer"
          shape="circle"
        >
          <Icon component={BitcoinIcon} />
        </Button>
      </div>
      <p>Copyright © 2018 ælf</p>
    </div>
  </Footer>
);

export default BrowserFooter;
