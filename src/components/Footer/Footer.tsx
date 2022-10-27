import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { NETWORK_TYPE } from 'constants/config/config';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import Image from 'next/image';
import BgFooter from 'assets/images/bg_footer.png';
import BgFooterTest from 'assets/images/bg_footer_test.png';
import BgFooterMobile from 'assets/images/bg_footer_mobile.png';
import BgFooterMobileTest from 'assets/images/bg_footer_mobile_test.png';
require('./footer.styles.less');

interface IProps {
  headers: any;
}
const BrowserFooter = ({ headers }: IProps) => {
  const { pathname } = useRouter();
  const [isNoFooter, setIsNoFooter] = useState(false);
  const NO_FOOTER_LIST = useMemo(() => ['search-invalid', 'search-failed'], []);
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));

  useEffect(() => {
    const firstPathName = pathname.split('/')[1];
    setIsNoFooter(NO_FOOTER_LIST.includes(firstPathName));
  }, [pathname]);

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);
  return isNoFooter ? (
    <></>
  ) : (
    <section className={'footer ' + (NETWORK_TYPE === 'MAIN' ? 'main' : 'test')}>
      {/* should add the priority property to the image that will be 
      the Largest Contentful Paint (LCP) element for each page */}
      {isMobile ? (
        NETWORK_TYPE === 'MAIN' ? (
          <Image
            src={BgFooterMobile}
            layout="fill"
            objectFit="contain"
            priority
            alt="Picture of the footer mobile"></Image>
        ) : (
          <Image
            src={BgFooterMobileTest}
            layout="fill"
            objectFit="contain"
            priority
            alt="Picture of the footer mobile test"></Image>
        )
      ) : NETWORK_TYPE === 'MAIN' ? (
        <Image src={BgFooter} layout="fill" objectFit="contain" priority alt="Picture of the footer"></Image>
      ) : (
        <Image src={BgFooterTest} layout="fill" objectFit="contain" priority alt="Picture of the footer test"></Image>
      )}
      <div className="footer-container">
        <div className="left">
          <div className="top">
            <h1>AELF Explorer</h1>
            <p className="description">Decentralized Cloud Computing Blockchain Network</p>
          </div>
          <div className="bottom">
            <div className="powered-by">Powered by AELF</div>
            <a target="_blank" href="https://aelf.com" rel="noreferrer">
              aelf.com
            </a>
          </div>
        </div>
        <div className="footer-links-container">
          <div className="link-list community">
            <p>Community</p>
            <div className="list">
              <a target="_blank" href="https://t.me/aelfblockchain" rel="noreferrer">
                Telegram
              </a>
              <a target="_blank" href="https://medium.com/aelfblockchain" rel="noreferrer">
                Medium
              </a>
              <a target="_blank" href="https://twitter.com/aelfblockchain" rel="noreferrer">
                Twitter
              </a>
              <a target="_blank" href="http://www.youtube.com/c/aelfblockchain" rel="noreferrer">
                Youtube
              </a>
              <a target="_blank" href="https://discord.gg/bgysa9xjvD" rel="noreferrer">
                Discord
              </a>
            </div>
          </div>
          <div className="link-list technology">
            <p>Technology</p>
            <div className="list">
              <a target="_blank" href="https://docs.aelf.io/en/latest/introduction/introduction.html" rel="noreferrer">
                Dev Docs
              </a>
              <a target="_blank" href="https://github.com/aelfProject" rel="noreferrer">
                Github
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://chrome.google.com/webstore/detail/aelf-explorer-extension/mlmlhipeonlflbcclinpbmcjdnpnmkpf?hl=zh-CN">
                Wallet
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="copyright-container">AELF © {new Date().getFullYear()}</p>
    </section>
  );
};

export default BrowserFooter;
