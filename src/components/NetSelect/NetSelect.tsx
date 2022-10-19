import { Select } from 'antd';
import React, { useCallback } from 'react';
import config from 'constants/config/config';
require('./NetSelect.style.less');

const { Option } = Select;

export default function NetSelect({ chainList }) {
  const selectChange = useCallback((val) => {
    const chainInfo = chainList.find((item) => item.chainId === val);
    if (chainInfo.chainsLink) window.location = chainInfo.chainsLink;
  }, []);
  return (
    <div className="net-select-wrapper">
      <Select
        className="common-select-wrapper net-select-container"
        defaultValue={config.CHAIN_ID}
        onChange={selectChange}>
        {chainList.map((item) => (
          <Option className="common-select-option-wrapper net-select-option" key={item.chainId} value={item.chainId}>
            {item.chainsLinkName.replace('chain', '')}
          </Option>
        ))}
      </Select>
    </div>
  );
}
