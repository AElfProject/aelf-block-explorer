import React from 'react';
import { connect } from 'react-redux';
import { Icon, Button } from 'antd';

import { BitcoinIcon, RedditIcon, SendIcon } from '../custom.icons';

import './footer.styles.less';

function getIconList(props) {
  const { isSmallScreen } = props;

  const listInfo = [
    {
      href: 'mailto:contact@aelf.io',
      type: 'mail'
    },
    {
      href: 'https://www.facebook.com/aelfofficial/',
      target: '_blank',
      type: 'facebook'
    },
    {
      href: 'https://twitter.com/aelfblockchain',
      target: '_blank',
      type: 'twitter'
    },
    {
      href: 'https://t.me/aelfblockchain',
      target: '_blank',
      component: SendIcon
    },
    {
      href: 'https://www.reddit.com/r/aelfofficial/',
      target: '_blank',
      component: RedditIcon
    },
    {
      href: 'https://medium.com/aelfblockchain',
      target: '_blank',
      type: 'medium'
    },
    {
      href: 'https://github.com/aelfProject',
      target: '_blank',
      type: 'github'
    },
    {
      href: 'http://slack.aelf.io/',
      target: '_blank',
      type: 'slack'
    },
    {
      href: 'https://www.linkedin.com/company/aelfblockchain/',
      target: '_blank',
      type: 'linkedin'
    },
    {
      href: 'http://www.youtube.com/c/aelfblockchain',
      target: '_blank',
      type: 'youtube'
    },
    {
      href: 'https://0.plus/aelf_chs',
      target: '_blank',
      component: BitcoinIcon
    }
  ];

  const html = listInfo.map(item => {
    return (
      <Button
        key={item.href}
        href={item.href}
        rel='noopener noreferrer'
        target={item.target || ''}
        shape='circle'
      >
        <Icon
          style={{
            color: '#000'
          }}
          type={item.type || null}
          component={item.component || ''}
        />
      </Button>
    );
  });

  return html;
}

const BrowserFooter = props => {
  const iconListHTML = getIconList(props);

  return (
    <section {...props} className='footer'>
      <div className='footer-container basic-container'>
        {/* <div className="footer-logo">
                <img alt="aelf" src="https://aelf.io/assets/images/logo.jpg" />
                <p>Contribute to communism around the world.</p>
            </div> */}
        <div className='footer-links-container'>{iconListHTML}</div>
        <p className='copyright-container'>
          Copyright © {new Date().getFullYear()} ælf
        </p>
      </div>
    </section>
  );
};

const mapStateToProps = state => ({
  ...state.common
});

export default connect(mapStateToProps)(BrowserFooter);
