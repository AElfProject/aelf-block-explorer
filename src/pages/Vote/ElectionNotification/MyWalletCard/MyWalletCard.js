import React, { memo } from 'react';
import { Button, Icon } from 'antd';

import './MyWalletCard.style.less';

const clsPrefix = 'my-wallet-card';

export default memo(function MyWalletCard() {
  return (
    <section className={`${clsPrefix}`}>
      <div className={`${clsPrefix}-header`}>
        <h2 className={`${clsPrefix}-header-title`}>我的钱包</h2>
        <button className={`${clsPrefix}-header-sync-btn`}>
          <Icon type='sync' />
        </button>
      </div>
      <div className={`${clsPrefix}-body`}>
        <div className={`${clsPrefix}-body-wallet-title`}>
          <h3 className={`${clsPrefix}-body-wallet-title-name`}>钱包A</h3>
          <Button shape='round'>解除绑定</Button>
        </div>
        <ul className={`${clsPrefix}-body-wallet-content`}>
          <li>资产总数： 100.0000</li>
          <li>可用余额： 91.0000</li>
          <li>
            待领取分红金额： 91.0000
            <Button
              shape='round'
              className={`${clsPrefix}-body-wallet-content-withdraw-btn`}
            >
              领取
            </Button>
          </li>
          <li>投票总数： 10.0000</li>
          <li>赎回总数： 1.0000</li>
          <li>投票到期时间： 2019/11/2</li>
        </ul>
      </div>
    </section>
  );
});
