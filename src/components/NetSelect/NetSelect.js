import { Select } from "antd";
import React, { useCallback } from "react";
import "./NetSelect.style.less";
import { NETWORK_TYPE } from "../../../config/config";
import IconFont from "../IconFont";

const { Option } = Select;

export default function NetSelect({ networkList }) {
  const selectChange = useCallback((val) => {
    const network = networkList.find((item) => item.netWorkType === val);
    if (network) window.location = network.url;
  }, []);
  return (
    <div className="net-select-wrapper">
      <Select
        className="common-select-wrapper net-select-container"
        defaultValue={NETWORK_TYPE}
        onChange={selectChange}
        closeIcon={<IconFont type="Down" />}
      >
        {networkList.map((item) => (
          <Option
            className="common-select-option-wrapper net-select-option"
            key={item.url}
            value={item.netWorkType}
          >
            {item.title}
          </Option>
        ))}
      </Select>
    </div>
  );
}
